from django.urls import path
from . import views

urlpatterns = [
	path('email',views.send_email),
	path('resetpassword',views.resetPassword),
	path('emailtemplate',views.emailtemplate),	
	]