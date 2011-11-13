from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.template import Context, RequestContext
from django.shortcuts import render_to_response, get_object_or_404, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from solextension_site.models import *

@csrf_exempt
def main_page(request):
	variables = RequestContext(request, {
		'reports': Report.objects.all(),
	})

	return render_to_response(
			'main_page.html',
			variables,
		)
