# -*- encoding: utf-8 -*-
import json
from django.http import HttpResponse
from django.views.generic import ListView
from django.views.generic.edit import CreateView
from .models import Post
from .forms import PostForm
from .serializers import PostSerializer
from .decorators import can_create_post
from RPosts.serializers import format_form_errors
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from users.decorators import user_login_required
# Create your views here.


class PostCreate(CreateView):
    model = Post
    form_class = PostForm

    @method_decorator(user_login_required)
    @method_decorator(can_create_post)
    def dispatch(self, request):
        return super(PostCreate, self).dispatch(request=request)

    def form_valid(self, form):
        self.object = form.save(commit=False)
        self.object.user = self.request.user
        self.object.save()

        return HttpResponse(json.dumps({
                'success': True
            }), content_type='application/json')

    def form_invalid(self, form):
        return HttpResponse(json.dumps({
                'success': False,
                'errors': format_form_errors(form)
            }), content_type='application/json')


class PostList(ListView):
    model = Post
    context_object_name = 'posts'

    @method_decorator(user_login_required)
    def dispatch(self, request):
        return super(PostList, self).dispatch(request=request)

    def render_to_response(self, context, **response_kwargs):
        serializer = PostSerializer(context['posts'], many=True)
        return HttpResponse(json.dumps({
                'posts': serializer.data
            }), content_type='application/json')
