from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import datetime
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail, EmailMultiAlternatives,EmailMessage
from DailyReport.settings import DEFAULT_FROM_EMAIL
from .validations import is_valid_email
from django.template.loader import render_to_string
from django.utils.html import strip_tags

@csrf_exempt
# @login_required
def send_email(request):
	if request.method == "POST":
		stremail= request.POST.get('email')
		print('stremail',stremail)
		print("requestcome")
		if not is_valid_email(stremail):
			return JsonResponse({'msg':'Invalid Email','status':400})
		# user_obj = User.objects.filter(email = strdata).first()
		# if user_obj:
		# 	return JsonResponse({'msg':'Already Exist','status':400})
		email=str(stremail)
		body='change your password'
		subject='subject'
		html_message = render_to_string('email_pass.html',{'data':'hiii','href':'127.0.0.1:8000/'})
		print('html_message',html_message)
		plain_message = strip_tags(html_message)
		# try:
		msg = EmailMessage(subject,html_message, DEFAULT_FROM_EMAIL,[email],)
		msg.content_subtype = "html"
		msg.send()
		# except:
			# return JsonResponse({'msg':'Network Issue','status':400})
		return JsonResponse({'msg':'Success','status':200})




	


