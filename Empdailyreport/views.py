from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import datetime
from .models import Report, Projects, WorkReport
from .validations import is_valid_email

@csrf_exempt
def loginFun(request):
	print(request.method)
	if request.method == "POST":

		email = request.POST.get('email')
		password = request.POST.get('password')
		print("password",password)
		if email =="" or email is None  or password =="" or password is None :
			print("in")
			return JsonResponse({'msg':'Required field empty !', 'status':400})
		if not is_valid_email(email):
			return JsonResponse({'msg':'Enter valid Email !', 'status':400})
		user_obj =User.objects.filter(email=email).first()
		if user_obj is None:
			return JsonResponse({'msg':'User not Exist', 'status':400}) 
		user = authenticate(username=user_obj.username, password=password)
		if not user:
			return JsonResponse({'msg':'password Not Match', 'status':400}) 
		login(request,user)
		print('date=',datetime.datetime.now().date())
		checkReport = Report.objects.filter(userid =user_obj ,date=datetime.datetime.now().date())
		if not checkReport:
			reportObj = Report.objects.create(userid=user_obj)
		return JsonResponse({'msg':'Success', 'status':200}) 

@csrf_exempt
def home(request):
	return render(request,'login.html')
	


@csrf_exempt
def logoutFun(request):
	print(request.user.username)
	user_obj =User.objects.filter(email=request.user.email).first()
	obj = Report.objects.filter(userid=user_obj).first()
	obj.logoutTime = datetime.datetime.now().time()
	print('obj.logoutTime',obj.logoutTime)
	obj.save()
	logout(request)
	return redirect('/login')

def reportList(request):
	if not request.user.is_authenticated:
		return redirect('/login')
	user_obj =User.objects.filter(email=request.user.email).first()
	obj = Report.objects.filter(userid=user_obj,status="Pending" )
	for i in obj:
		print(i)
	return render(request,'Listcopy.html', {'data':obj,'name':user_obj.username})

@csrf_exempt
def reportform(request):
	if not request.user.is_authenticated:
		return redirect('/login')
	if request.method == "GET":
		projectlist= Projects.objects.all()
		return render(request, 'report.html', {'projectlist':projectlist})
	user_obj =User.objects.filter(email=request.user.email).first()
	project_list = request.POST.getlist('projectname')
	print('project_list',project_list,type(project_list))
	project_description = request.POST.getlist('project_description')
	print('project_description',project_description,type(project_description))
	insert_list=[]
	for i in range(len(project_description)):
		if project_description[i] == "" :
			print('project_description[i]',project_description[i])
			return redirect('/reportform')
		insert_list.append(WorkReport(userid=user_obj,projectName=project_list[i],projectDescription=project_description[i]))
	WorkReport.objects.bulk_create(insert_list)
	print('insert_list',insert_list)
	obj = Report.objects.filter(userid=user_obj,date =datetime.datetime.now().date()).update(status='Success')
	return redirect('/reportist')