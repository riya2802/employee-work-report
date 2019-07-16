from django.db import models
from django.contrib.auth.models import User
import datetime

reportStatus=(('Success','Success'),('Pending','Pending'))

class Report(models.Model):
	userid = models.ForeignKey(User,models.CASCADE)
	date = models.DateField(auto_now=True)
	loginTime = models.TimeField(auto_now=True)
	logoutTime = models.TimeField(blank=True, null=True, default=datetime.time(0,0))
	status=models.CharField(max_length=30, choices=reportStatus, default="Pending" )

class Projects(models.Model):
	projectName = models.CharField(max_length=255)

class WorkReport(models.Model):
	userid = models.ForeignKey(User,models.CASCADE)
	projectName = models.CharField(max_length=255)
	projectDescription = models.CharField(max_length=1000)
