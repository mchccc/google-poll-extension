from django.db import models

class Report(models.Model):
	query = models.CharField(max_length=2048)
	user_id = models.CharField(max_length=2048)
	item = models.PositiveIntegerField(null=False)
	page = models.PositiveIntegerField(null=False)
	url = models.CharField(max_length=240)
	title = models.CharField(max_length=2048)
	reason = models.CharField(null=True, max_length=240)
	custom_text = models.CharField(null=True, max_length=2048)
	timestamp = models.DateTimeField()

	def __unicode__(self):
		string = "%s clicked item %d on page %d (%s) for query \"%s\" at %s" % (self.user_id, self.item, self.page, self.title, self.query, self.timestamp)
		if self.reason or self.custom_text:
			string += " because of"
			if self.reason:
				string += (" %s" % self.reason)
				if self.custom_text:
					string += " and"
			if self.custom_text:
				string += (" %s" % self.custom_text)
		return string


class FirstrunReport(models.Model):
	user_id = models.CharField(max_length=2048)
	answer = models.CharField(null=True, max_length=240)
	timestamp = models.DateTimeField()

	def __unicode__(self):
		if self.answer == 'yes':
			verb = 'does look'
		elif self.answer == 'no':
			verb = 'doesn\'t look'
		elif self.answer == 'depends':
			verb = 'sometimes looks'
		string = "%s says that s/he %s deeper into queries" % (self.user_id, verb)
		return string