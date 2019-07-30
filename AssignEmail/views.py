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
import hashlib
from .models import ResetPasswordToken
from django.contrib.auth.hashers import make_password
from Empdailyreport.models import Report
from django.core import serializers


@csrf_exempt
# @login_required
def send_email(request):
	if request.method == "POST":
		stremail= request.POST.get('email')
		print('stremail',stremail)
		print("requestcome")
		if not is_valid_email(stremail):
			return JsonResponse({'msg':'Invalid Email','status':400})
		email=str(stremail)
		hashtoken = hashlib.sha256(email.encode('utf-8')).hexdigest() ##generate hash using sha256 with email 
		user_obj = User.objects.filter(email = email).first()
		print('user_obj',user_obj)
		# if user_obj:
		# 	return JsonResponse({'msg':'Already Exist','status':400})
		
		subject='change your password'
		token=hashtoken
		html_message = render_to_string('email_pass.html',{'token':token,'href':' http://192.168.0.191:8000/sendmail/resetpassword'})
		plain_message = strip_tags(html_message)
		try:
			msg = EmailMessage(subject,html_message, DEFAULT_FROM_EMAIL,[email])
			msg.content_subtype = "html"
			msg.send()
			ResetPasswordToken.objects.create(userid=user_obj, token=token)
		except:
			return JsonResponse({'msg':'Network Issue','status':400})
		return JsonResponse({'msg':'Success','status':200})

@csrf_exempt
def resetPassword(request):
	print("request")
	if request.method == "GET":
		token = request.GET.get('token')
		tokenmatch = ResetPasswordToken.objects.filter(token=token).first()
		print("token",token)
		if tokenmatch is None : 
			return render(request,'passwordchange.html')
		else:
			return render(request,'passwordchange.html')

	if request.method == "POST":	
		newpassword = request.POST.get('password')
		conpassword = request.POST.get('conpassword')
		token = request.POST.get('token')
		print('token--->',token)
		tokenmatch = ResetPasswordToken.objects.filter(token=token).first()
		if tokenmatch is None : 
			return JsonResponse({'msg':'Invalid Token','status':400})
		if conpassword == "" or  newpassword=="" or  not conpassword == newpassword :
			return JsonResponse({'msg':'password not match','status':400})
		
		user= User.objects.get(id =tokenmatch.userid_id)
		user.password = make_password(newpassword)
		user.save()
		tokenmatch.delete()
		return JsonResponse({'msg':'Success','status':200})










	


	





	


