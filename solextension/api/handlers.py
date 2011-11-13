from piston.handler import BaseHandler
from solextension.solextension_site.models import Report

import simplejson
from piston.utils import Mimer
#Mimer.register(simplejson.loads, ('application/json', 'application/json; charset=UTF-8',))

class ReportHandler(BaseHandler):
	model = Report
