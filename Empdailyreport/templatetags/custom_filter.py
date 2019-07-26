import datetime
from Empdailyreport.models import UrlTime
from django import template
register = template.Library()

@register.simple_tag
def get_nowtime():
	time = datetime.datetime.now().time()
	dtime = UrlTime.objects.get()
	# lunchtime1 = datetime.datetime.strptime('15:00', "%H:%M").time()
	# lunchtime2 = datetime.datetime.strptime('16:00', "%H:%M").time()
	# ofctime1 = datetime.datetime.strptime('18:30', "%H:%M").time()
	# ofctime2 = datetime.datetime.strptime('23:59', "%H:%M").time()
	if (time >=dtime.lunchTimeStart and time<=dtime.lunchTimeEnd)  or (time >=dtime.eveningstart  and time <=dtime.eveningend):	   
 		res = "True"
	else:
		res ="False"
	return res

@register.filter
def get_index(page_no):
	pno = page_no -1
	startindex = pno*5+1
	return startindex 
	

