from django.urls import path
from . import views

urlpatterns = [
	path('send_email',views.send_email),
	path('resetpassword',views.resetPassword),
	path('emailtemplate',views.emailtemplate),	
	path('data',views.data),
	path('index',views.index),
	path('isemailexist',views.isemailexist),

	]