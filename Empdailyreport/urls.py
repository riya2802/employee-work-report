from django.urls import path
from . import views

urlpatterns = [
	path('',views.home),
	path('home',views.home),
    path('login',views.loginFun),
    path('logout',views.logoutFun),
    path('reportlist',views.reportList),
    path('reportform', views.reportform),
    
   
   
]