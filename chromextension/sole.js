function betterEncodeURI(data) {
	data = encodeURIComponent(data);
	data = data.replace(/!/g,"%21");
	data = data.replace(/\*/g,"%2A");
	data = data.replace(/\'/g,"%27");
	data = data.replace(/\(/g,"%28");
	data = data.replace(/\)/g,"%29");
	return data
}

if($('li.g a').length)
	chrome.extension.sendRequest(null, function(response) {});
	// tell background that we're active so it'll show the icon in the addressbar

$('li.g a') // all the results' link
	.removeAttr('onmousedown') // prevent nasty link rewriting
	.bind('click', function(event) {
		event.preventDefault(); // avoid going to destination right away
		var location = $(this).attr("href"); // but remember its location

		var user_id = "";
		var debug = false;
		chrome.extension.sendRequest( // get information from our popup
			{ localstorage: 'user_id', debug: 'debug' },
			function(response) {
				if (response && response.user_id)
					user_id = response.user_id;
				if (response && response.debug == "true")
					debug = true;
		});

		var oldpoll = $('#solextension');
		if (oldpoll.length) {
			oldpoll.attr("id","solextension_old");
			oldpoll.slideUp('fast', function(){
										$(this).remove();
									}); // remove (eventual) old poll
		}

		var item = $(this).parents('.g').index() + 1; // index of the clicked result
		var page = $('#nav .cur').text(); // page number straight from footer's text
		var now = new Date(); // for timestamp

		var string = $(this).parents('.g').index() + 1;
		if (string === 1)
			string += "st";
		else
			if (string === 2)
				string += "nd";
			else if (string === 3)
					string += "rd";
				else
					string += "th";

		data = "item=" + item + "&page=" + page;
		data += "&timestamp=" + now.format("yyyy-mm-dd HH:MM:ss.l") + "000";

		var ajax_call = function(data, user_id, debug) {
							var radio = $('input:radio[name=solextension]:checked');
							if (typeof radio.val() !== "undefined")
								data += "&reason=" + betterEncodeURI(radio.val());
							var custom_text = $('#reason_text').val();
							if(custom_text != 'something (gasp!) else')
									data += "&custom_text=" + betterEncodeURI(custom_text);

							var query = $('input:text[title=Search]').val();
							data += "&query=" + betterEncodeURI(query);
							data += "&user_id=" + betterEncodeURI(user_id);
							if(debug)
								alert(data);

							$.ajax({
								accept: 'application/json',
								type: 'POST',
								url:'http://localhost:8000/api/reports',
								data: data,
								crossDomain: true,
								processData: false
							});
						};

		// let's build the poll
		var element = "<div id='solextension'>I see you clicked on the ";
		element += string;
		element += " link; now, why would you do that?<br />";
		element += "<input type='radio' name='solextension' value='Pertinence' />Pertinence<br />";
		element += "<input type='radio' name='solextension' value='Impatience' />Impatience<br />";
		element += "<input type='radio' name='solextension' value='Kittens!' />Kittens!<br />";
		element += "<input type='text' id='reason_text' value='something (gasp!) else' /><br />";
		element += "<a>okay</a>";
		element += "</div>";

		$(this).parents('.g').append(element);
		$('#solextension a').attr('href', location);
		$('#solextension a').bind('click', function(){ajax_call(data, user_id, debug);});
		$('#solextension #reason_text').one('focus', function(){$(this).val("");});
		$('#solextension').slideDown();

		// just feedback / debug
		string += " link on page ";
		string += page;
//		alert(string);
});