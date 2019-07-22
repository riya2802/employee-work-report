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
			return JsonResponse({'msg':'User does not Exist', 'status':400}) 
		user = authenticate(username=user_obj.username, password=password)
		if not user:
			return JsonResponse({'msg':'Password Not Match', 'status':400}) 
		login(request,user)
		print('date=',datetime.datetime.now().date())
		checkReport = Report.objects.filter(userid =user_obj ,date=datetime.datetime.now().date())
		print('checkReport',checkReport)
		if not checkReport:
			reportObj = Report.objects.create(userid=user_obj,date=datetime.datetime.now().date())
		return JsonResponse({'msg':'Success', 'status':200}) 



@csrf_exempt
def home(request):
	return render(request,'myform.html')
	


@csrf_exempt
def logoutFun(request):
	print(request.user.username)
	if not request.user.is_authenticated:
		return redirect('/home')
	user_obj =User.objects.filter(email=request.user.email).first()
	obj = Report.objects.filter(userid=user_obj).first()
	obj.logoutTime = datetime.datetime.now().time()
	obj.save()
	logout(request)
	return redirect('/home')

def reportList(request):
	if not request.user.is_authenticated:
		return redirect('/home')
	if request.method =="GET":
		user_obj =User.objects.filter(email=request.user.email).first()
		obj = Report.objects.filter(userid=user_obj,status="Pending" ).order_by('-date')
		print(len(obj))
		todaydate = datetime.datetime.now().date()
		return render(request,'pricing-table-1.html', {'data':obj,'name':user_obj.username,'todaydate':todaydate})
	date = request.POST.get('date')
	tdate = datetime.datetime.now().date()
	if date < tdate or date >tdate :
		return JsonResponse({'msg':'Date is less then today date','status':400})
	return JsonResponse({'msg':'Success','status':200})





@csrf_exempt
def reportform(request):
	if not request.user.is_authenticated:
		return redirect('/home')
	if request.method == "GET":
		projectlist= Projects.objects.all()

		return render(request, 'report.html', {'projectlist':projectlist,})
	
	user_obj =User.objects.filter(email=request.user.email).first()
	report_obj = Report.objects.filter(userid=user_obj).first()
	print('report_obj',report_obj,report_obj.date)
	project_list = request.POST.getlist('projectname[]')
	print('project_list',project_list,type(project_list))
	project_description = request.POST.getlist('project_description[]')
	print('project_description',project_description,type(project_description))
	insert_list=[]
	for i in range(len(project_description)):
		print("for")
		print(len(project_description[i]))
		if project_description[i] == " " or project_description[i] is None or project_description[i] =="" or len(project_description[i])< 10:
			print("in")
			print('project_description[i]',project_description[i])
			return JsonResponse({'msg':'Blank project Descriprtion is not allowed','status':400})
		insert_list.append(WorkReport(userid=user_obj,projectName=project_list[i],projectDescription=project_description[i],reportid=report_obj))
	print("insert_list",insert_list)
	date = report_obj.date
	WorkReport.objects.bulk_create(insert_list)
	print('insert_list',insert_list)
	obj = Report.objects.filter(userid=user_obj,date =datetime.datetime.now().date()).update(status='Success')
	return JsonResponse({'msg':'Success','status':200})