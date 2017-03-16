# -*- encoding: utf-8 -*-
import json
from django.http import HttpResponse
from django.shortcuts import render
from django.views.generic import ListView
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from .models import User
from .forms import UserForm, UserUpdateForm, UserAuthenticationForm
from .serializers import UserSerializer
from .decorators import user_login_required
from django.contrib.auth.models import Permission
from RPosts.serializers import format_form_errors
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login
from django.middleware.csrf import get_token as get_csrf_token

# Create your views here.

class UserCreate(CreateView):
    model = User
    form_class = UserForm

    @method_decorator(user_login_required)
    def dispatch(self, request):
        return super(UserCreate, self).dispatch(request=request)

    def form_valid(self, form):
        self.object = form.save(commit=False)
        self.object.set_password(form.cleaned_data.get('password'))
        self.object.user_creator = self.request.user
        self.object.save()

        if form.cleaned_data.get('can_create_posts'):
            add_post_perm = Permission.objects.get(
                codename='add_post')
            self.object.user_permissions.add(add_post_perm)

        return HttpResponse(json.dumps({
                'success': True
            }), content_type='application/json')

    def form_invalid(self, form):
        return HttpResponse(json.dumps({
                'success': False,
                'errors': format_form_errors(form)
            }), content_type='application/json')


class UserUpdate(UpdateView):
    model = User
    form_class = UserUpdateForm

    @method_decorator(user_login_required)
    def dispatch(self, request, pk):
        return super(UserUpdate, self).dispatch(request=request, pk=pk)

    def form_valid(self, form):
        self.object = form.save()

        add_post_perm = Permission.objects.get(
            codename='add_post')

        if self.object.has_perm('posts.add_post') and \
            not form.cleaned_data.get('can_create_posts'):
            self.object.user_permissions.remove(add_post_perm)
        elif not self.object.has_perm('posts.add_post') and \
            form.cleaned_data.get('can_create_posts'):
            self.object.user_permissions.add(add_post_perm)

        return HttpResponse(json.dumps({
                'success': True
            }), content_type='application/json')

    def form_invalid(self, form):
        return HttpResponse(json.dumps({
                'success': False,
                'errors': format_form_errors(form)
            }), content_type='application/json')


class UserDelete(DeleteView):
    model = User

    @method_decorator(user_login_required)
    def dispatch(self, request, pk):
        return super(UserDelete, self).dispatch(request=request, pk=pk)

    def delete(self, request, *args, **kwargs):
        """
        Calls the delete() method on the fetched object and then
        redirects to the success URL.
        """
        self.object = self.get_object()
        self.object.delete()
        return HttpResponse(json.dumps({
                'success': True
            }), content_type='application/json')


class UserList(ListView):
    model = User
    context_object_name = 'users'

    @method_decorator(user_login_required)
    def dispatch(self, request):
        return super(UserList, self).dispatch(request=request)

    def render_to_response(self, context, **response_kwargs):
        serializer = UserSerializer(context['users'], many=True)
        return HttpResponse(json.dumps({
                'users': serializer.data
            }), content_type='application/json')


@csrf_exempt
def signin(request):
    if not request.method == 'POST':
        raise ValidationError(
            u'El método para realizar esta petición no es permitido.')
    else:
        form = UserAuthenticationForm(request.POST)

        if form.is_valid():
            request.session.flush()
            login(request, form.user)
            session_id = request.session.session_key
            csrf_token = get_csrf_token(request)

            return HttpResponse(json.dumps({
                'success': True,
                'sessionid': session_id,
                'csrftoken': csrf_token,
                'username': request.user.username,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name
            }), content_type='application/json')
        else:
            return HttpResponse(json.dumps({
                'success': False,
                'errors': format_form_errors(form)
            }), content_type='application/json')
