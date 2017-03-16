# -*- encoding: utf-8 -*-
import json
from django.http import HttpResponse

def user_login_required(view_func):
    def wrap(request, *args, **kwargs):
        if not request.user.is_authenticated():
        	return HttpResponse(json.dumps({
        	    'success': False,
        	    'errors': u'Requiere iniciar sesión'
        	}), content_type='application/json')

        return view_func(request, *args, **kwargs)
    return wrap
