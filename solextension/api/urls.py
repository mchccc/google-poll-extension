from django.conf.urls.defaults import *
from piston.resource import Resource
from solextension.api.handlers import *

report_resource = Resource(ReportHandler)
firstrunreport_resource = Resource(FirstrunReportHandler)

urlpatterns = patterns('',
	url(r'^reports/(?P<id>\d+)$', report_resource),
	url(r'^reports$', report_resource),

	url(r'^firstrun_reports/(?P<id>\d+)$', firstrunreport_resource),
	url(r'^firstrun_reports$', firstrunreport_resource),
)