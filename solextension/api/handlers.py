from piston.handler import BaseHandler
from solextension.solextension_site.models import *

import simplejson
from piston.utils import Mimer
#Mimer.register(simplejson.loads, ('application/json', 'application/json; charset=UTF-8',))

class ReportHandler(BaseHandler):
	allowed_methods = ('POST', 'GET')
	model = Report

class FirstrunReportHandler(BaseHandler):
	allowed_methods = ('POST', 'GET')
	model = FirstrunReport
