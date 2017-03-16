# -*- encoding: utf-8 -*-
import json
from django.http import HttpResponse

def can_create_post(view_func):
    def wrap(request, *args, **kwargs):
        if not request.user.has_perm('posts.add_post'):
        	return HttpResponse(json.dumps({
        	    'success': False,
        	    'errors': u'No tiene permisos para crear posts'
        	}), content_type='application/json')

        return view_func(request, *args, **kwargs)
    return wrap
