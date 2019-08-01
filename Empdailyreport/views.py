from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import datetime
from .models import Report, Projects, WorkReport,UrlTime
from .validations import is_valid_email
from django.core.paginator import Paginator
from django.shortcuts import render 
from django.contrib.auth.decorators import login_required


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
		checkReport = Report.objects.filter(userid =user_obj ,date=datetime.datetime.now().date())
		print('checkReport',checkReport)
		if not checkReport:
			reportObj = Report.objects.create(userid=user_obj,date=datetime.datetime.now().date())
		return JsonResponse({'msg':'Success', 'status':200}) 

def home(request):
	return render(request,'login.html')
	
def logoutFun(request):
	print(request.user.username)
	if not request.user.is_authenticated:
		return redirect('/home')
	user_obj =User.objects.filter(email=request.user.email).first()
	obj = Report.objects.filter(userid=user_obj).first()
	obj.logoutTime = datetime.datetime.now().time()
	obj.save()
	logout(request)
	return redirect('/')

def reportList(request):
	if not request.user.is_authenticated:
		return redirect('/home')
	user_obj =User.objects.filter(email=request.user.email).first()
	obj = Report.objects.filter(userid=user_obj,status="Pending" ).order_by('-date')
	print(len(obj))
	todaydate = datetime.datetime.now().date()
	paginator = Paginator(obj,5) # Show 25 contacts per page
	page = request.GET.get('page')
	data_page = paginator.get_page(page)
	return render(request,'reportlist.html', {'data':data_page,'name':user_obj.username,'email':user_obj.email,'todaydate':todaydate})


def reportform(request):
	if not request.user.is_authenticated:
		return redirect('/home')
	if request.method == "GET":
		time = datetime.datetime.now().time()
		projectlist= Projects.objects.all()
		dtime = UrlTime.objects.get()
		print('dtime',dtime.lunchTimeStart)
		# lunchtime1 =datetime.datetime.strptime('15:00', "%H:%M").time()
		# lunchtime2=datetime.datetime.strptime('16:00', "%H:%M").time()
		# ofctime1=datetime.datetime.strptime('18:30', "%H:%M").time()
		# ofctime2=datetime.datetime.strptime('23:59', "%H:%M").time()
		if (time >=dtime.lunchTimeStart and time<=dtime.lunchTimeEnd)  or (time >=dtime.eveningstart  and time <=dtime.eveningend):
			return render(request, 'report.html', {'projectlist':projectlist,})
		else :
			return redirect('/reportlist')
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


@csrf_exempt
def template(request):
	return render(request,'passwordchange.html')



@login_required
def changePassword(request):
    old_pass=request.POST.get('oldpassword')
    new_pass = request.POST.get('newpassword')
    if old_pass is None or old_pass == "" or new_pass is None or new_pass == "":
        return Response({'message':' Required field Empty','status'=400})
    user_obj = User.objects.filter(username= request.user).first()
    passwordMatch= user_obj.check_password(old_pass)
    print(passwordMatch)
    if passwordMatch is None: 
        return Response({'message':'Password not match','status'=400})
    # passwordvalidation= myrsource.validate_password(new_pass)
    # if passwordvalidation is not True :
    #     return Response({'message':' Enter Invalid password'},status= HTTP_400_BAD_REQUEST)
    updatePassword = make_password(new_pass)
    user_obj.password = updatePassword
    user_obj.save()
    return Response({'message':'password updated successfully '})


def forgotPasssword(request):
	email = request.POST.get('email', None)
	password =request.POST.get('password', None)
    if email is None or email == '' and  password is None or password == '' :
        return Response({'message': 'Required field Empty','status'=400})
    user= User.objects.filter(email=email).first()
    if user is None :
        return Response({'message': 'Email is not register', "status"=400})
    updatePassword = make_password(password)
    user_obj.password = updatePassword
    user.save()
    return Response({'message':'password updated successfully '})



      
