from django.conf.urls.defaults import *
from piston.resource import Resource
from solextension.api.handlers import ReportHandler

report_resource = Resource(ReportHandler)

urlpatterns = patterns('',
	url(r'^reports/(?P<id>\d+)$', report_resource),
	url(r'^reports$', report_resource),
)