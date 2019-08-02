import re


def is_valid_email(email):
	if re.search(r'\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b', email, re.I):
		print('kkkk')
		return True
	else:
		return False

