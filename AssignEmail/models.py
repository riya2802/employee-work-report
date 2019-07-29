from django.db import models
from django.contrib.auth.models import User
import datetime

class ResetPasswordToken(models.Model):
	userid = models.ForeignKey(User,models.CASCADE)
	token = models.CharField(max_length=65, null=True)

