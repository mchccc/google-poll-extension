function betterEncodeURI(data) {
	data = encodeURIComponent(data);
	data = data.replace(/!/g,"%21");
	data = data.replace(/\*/g,"%2A");
	data = data.replace(/\'/g,"%27");
	data = data.replace(/\(/g,"%28");
	data = data.replace(/\)/g,"%29");
	return data
}

var user_id = "";
var debug = false;
var firstrun = true;
var loading = "";

if($('li.g a').length || $('input[name="q"]').length)
	if($('input[name="q"]').length && !$('li.g a').length)
		hp = true
	else
		hp = false
	chrome.extension.sendRequest( // get information from our popup
		{ localstorage: 'user_id', debug: 'debug', hp: hp },
		function(response) {
			if (response && response.user_id)
				user_id = response.user_id;
			if (response && response.firstrun)
				if (response.firstrun === "false")
					firstrun = false;
			if (response && response.debug)
				if (response.debug === "true")
					debug = true;
			if (response && response.loading)
				loading = response.loading;
	});
	// tell background that we're active, so it'll show the icon in the addressbar

$('li.g a') // all the results' link
	.removeAttr('onmousedown') // prevent nasty link rewriting
	.bind('click', function(event) {
		event.preventDefault(); // avoid going to destination right away
		var location = $(this).attr("href"); // but remember its location
		var title = $(this).text();

		var oldpoll = $('#solextension');
		if (oldpoll.length) {
			oldpoll.attr("id", "solextension_old");
			oldpoll.slideUp('fast', function(){
										$(this).remove();
									}); // remove (eventual) old poll
		}

		var item = $(this).parents('.g').index() + 1; // index of the clicked result
		var page = $('#nav .cur').text(); // page number straight from footer (navigation)'s text
		var now = new Date(); // for timestamp

		var string = item;
		if (string === 1)
			string += "st";
		else
			if (string === 2)
				string += "nd";
			else if (string === 3)
					string += "rd";
				else
					string += "th";

		data = "timestamp=" + now.format("yyyy-mm-dd HH:MM:ss.l") + "000";
		data += "&item=" + item + "&page=" + page;
		data += "&url=" + betterEncodeURI(location) + "&title=" + betterEncodeURI(title);

		var ajax_call = function(target, data, user_id, debug, firstrun) {
							$(target).next().fadeIn();
							if(!user_id)
								firstrun = false;

							var radio = $('input:radio[name=solextension]:checked');
							if (typeof radio.val() !== "undefined")
								data += "&reason=" + betterEncodeURI(radio.val());
							var custom_text = $('#reason_text').val();
							if(custom_text)
								data += "&custom_text=" + betterEncodeURI(custom_text);

							var query = $('input:text[name="q"]').val();
							data += "&query=" + betterEncodeURI(query);
							data += "&user_id=" + betterEncodeURI(user_id);
							if(debug)
								alert(data);

							var other_done = false;
							$.ajax({
								accept: 'application/json',
								type: 'POST',
								url:'http://cico.alwaysdata.net/api/reports',
								data: data,
								crossDomain: true,
								processData: false
							}).done(function() { 	if(!firstrun || other_done)
								 						$(target).parents("#submit").submit();
													other_done = true;
												});
							if(firstrun) {
								chrome.extension.sendRequest( // set firstrun
									{ firstrun: user_id, set: true },
									function(response) {}
								);
								var radio = $('input:radio[name=solextension_extra]:checked');
								if (typeof radio.val() !== "undefined") {
									var firstrun_data = data.slice(0,36);
									firstrun_data += "&answer=" + betterEncodeURI(radio.val());
									firstrun_data += "&user_id=" + betterEncodeURI(user_id);
									if(debug)
										alert(firstrun_data);

									$.ajax({
										accept: 'application/json',
										type: 'POST',
										url:'http://cico.alwaysdata.net/api/firstrun_reports',
										data: firstrun_data,
										crossDomain: true,
										processData: false
									}).done(function() { 	if(other_done)
																$(target).parents("#submit").submit();
															other_done = true;
														});
								}
							}
						};

		// let's build the poll
		var element = "<div id='solextension'>";
		if(!user_id)
			element += "<strong style='color:#ee3d2f;'>Please insert a username by clicking on the icon in the address bar</strong>"
		element += "<div id='firstquestion'>I see you clicked on the ";
		element += string;
		element += " link; now, why would you do that?<br />";
		element += "<input type='radio' name='solextension' value='titolo' />Interesse suscitato dal titolo<br />";
		element += "<input type='radio' name='solextension' value='pertinenza' />Pertinenza di ricerca dopo aver letto il testo descrittivo<br />";
		element += "<input type='radio' name='solextension' value='indirizzo' />Conosci l&#39;indirizzo del sito<br />";
		element += "<input type='text' id='reason_text' placeholder='(anche) altro...' /></div>";

		if (user_id && firstrun) {
			element += "<strong>Extra Question - first search only</strong>";
			element += "<div id='secondquestion'>Solitamente controlli con altre ricerche le informazioni ottenute dal primo risultato?<br />";
			element += "<input type='radio' name='solextension_extra' value='yes' />S&igrave;, guardo diversi siti per la stessa informazione<br />";
			element += "<input type='radio' name='solextension_extra' value='no' />No, mi fermo al primo<br />";
			element += "<input type='radio' name='solextension_extra' value='depends' />Dipende dalla ricerca</div>";
		}

		element += "<form id='submit' method='GET'><div id='anchor'>"
		element += "<a>okay</a>"
		element += "<img id='ajax-loader' src=" + loading + " />"
		element += "</div></form>";
		element += "</div>";

		$(this).parents('.g').append(element);
		$('#submit').attr('action', location);
		$('#anchor a')
					.attr('href', location)
					.bind('click', function(e){
											e.preventDefault();
											ajax_call(e.target, data, user_id, debug, firstrun);
										});
		$('#solextension').slideDown();

		// just feedback / debug
		string += " link on page ";
		string += page;
//		alert(string);
});