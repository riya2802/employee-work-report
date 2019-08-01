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
import json
from django.apps import apps



@csrf_exempt
# @login_required
def send_email(request):
	if request.method == "POST":
		stremail= request.POST.get('email')
		if not is_valid_email(stremail):
			return JsonResponse({'msg':'Invalid Email','status':400})
		email=str(stremail)
		hashtoken = hashlib.sha256(email.encode('utf-8')).hexdigest() ##generate hash using sha256 with email 
		user_obj = User.objects.filter(email = email).first()
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
	if request.method == "GET":
		token = request.GET.get('token')
		tokenmatch = ResetPasswordToken.objects.filter(token=token).first()
		print("token",token)
		if tokenmatch is None : 
			return render(request,'error-6.html')
		else:
			return render(request,'resetPassword.html')

	if request.method == "POST":	
		newpassword = request.POST.get('password')
		conpassword = request.POST.get('confirmpassword')
		token = request.POST.get('token')
		tokenmatch = ResetPasswordToken.objects.filter(token=token).first()
		if tokenmatch is None : 
			return JsonResponse({'msg':'Invalid Token','status':400})
		if conpassword == "" or  newpassword =="" or  not conpassword == newpassword :
			return JsonResponse({'msg':'password not match','status':400})
		
		user= User.objects.get(id =tokenmatch.userid_id)
		user.password = make_password(newpassword)
		user.save()
		tokenmatch.delete()
		return JsonResponse({'msg':'Success','status':200})

@csrf_exempt
def emailtemplate(request):
	return render(request,'passwordchange.html')



def data(request):
	def sendResponse(valid_model_name,offset = None,limit = None):
		if offset is None and limit is not None:# when page ==1
			user_data = valid_model_name.objects.all()[:limit]
		elif offset is not  None and limit is not None: ## when page no is grater then 1
			user_data = model.objects.all()[offset:limit]
		else :
			user_data =  valid_model_name.objects.all()
		json_res=serializers.serialize("json",user_data)
		res =json.loads(json_res)
		return JsonResponse({'res':res})
	
	model_name = request.GET.get('model',None)
	page = request.GET.get('page',None)
	per_page = request.GET.get('per_page',None)
	if page is not None and not page.isnumeric() or per_page is not None and not per_page.isnumeric():
		return JsonResponse({'msg':"invalid credentials "})
	if  model_name is not None:
		try:
			model = apps.get_model('Empdailyreport', model_name)
		except:
			return JsonResponse({'msg':"invalid model name"})
	if model_name is None and  page is None and per_page is None :
		result =sendResponse(User)
	if model_name is not None  and page is None and per_page is None : 
		result =sendResponse(model)
	if model_name is not None and  page is not None and per_page is None:
		result =sendResponse(model)
	if model_name is not None and page is not None and per_page is not None :
		if page == '1':
			result =sendResponse(model,limit=int(per_page))
		else :
			offset = (int(page)-1)*int(per_page)
			result =sendResponse(model,offset =offset,limit=offset+int(per_page))
	return result



	











	


	





	


