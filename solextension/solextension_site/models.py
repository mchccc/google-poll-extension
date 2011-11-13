from django.db import models

class Report(models.Model):
	query = models.CharField(max_length=2048)
	user_id = models.CharField(max_length=2048)
	item = models.PositiveIntegerField(null=False)
	page = models.PositiveIntegerField(null=False)
	reason = models.CharField(null=True, max_length=160)
	custom_text = models.CharField(null=True, max_length=2048)
	timestamp = models.DateTimeField()

	def __unicode__(self):
		string = "%s clicked item %d on page %d for query \"%s\" at %s" % (self.user_id, self.item, self.page, self.query, self.timestamp)
		if self.reason or self.custom_text:
			string += " because of"
			if self.reason:
				string += (" %s" % self.reason)
				if self.custom_text:
					string += " and"
			if self.custom_text:
				string += (" %s" % self.custom_text)
		return string