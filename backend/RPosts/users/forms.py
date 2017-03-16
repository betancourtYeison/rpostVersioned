# -*- encoding: utf-8 -*-
from django import forms
from .models import User
from django.contrib.auth import authenticate

class UserForm(forms.ModelForm):
	can_create_posts = forms.BooleanField(required=False)

	class Meta:
		model = User
		fields = ('username', 'password', 'first_name', 'last_name', 'email')


class UserUpdateForm(UserForm):

	class Meta:
		model = User
		fields = ('first_name', 'last_name', 'email')


class UserAuthenticationForm(forms.Form):
    username = forms.CharField(required=True)
    password = forms.CharField(widget=forms.PasswordInput)

    def clean(self):
    	username = self.cleaned_data.get('username')
    	password = self.cleaned_data.get('password')

    	self.user = authenticate(username=username, password=password)

    	if not self.user:
            raise forms.ValidationError(
                u'Los datos de inicio de sesión no son correctos.')

        return self.cleaned_data
