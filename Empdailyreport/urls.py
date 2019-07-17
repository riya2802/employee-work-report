from django.urls import path
from . import views

urlpatterns = [
    path('login',views.loginFun),
    path('logout',views.logoutFun),
    path('reportist',views.reportList),
    path('reportform', views.reportform),
    path('',views.home),
   
]