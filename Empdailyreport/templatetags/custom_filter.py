import datetime
from django import template
register = template.Library()

@register.simple_tag
def get_nowtime():
	time = datetime.datetime.now().time()
	lunchtime1 = datetime.datetime.strptime('15:00', "%H:%M").time()
	lunchtime2 = datetime.datetime.strptime('15:30', "%H:%M").time()
	ofctime1 = datetime.datetime.strptime('18:30', "%H:%M").time()
	ofctime2 = datetime.datetime.strptime('23:59', "%H:%M").time()
	if (time >=lunchtime1 and time<=lunchtime2)  or (time >=ofctime1  and time <=ofctime2):
	    res = "True"

	else:
	    
		res ="False"
	return res

@register.simple_tag
def get_counting():
	val=0
	return val

