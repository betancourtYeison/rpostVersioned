from django.conf.urls import url
from .views import UserCreate, UserUpdate, UserDelete, UserList, signin

urlpatterns = [
	url(r'^create/$', UserCreate.as_view(), name='user-create'),
	url(r'^update/(?P<pk>\d+)/$', UserUpdate.as_view(), name='user-update'),
	url(r'^delete/(?P<pk>\d+)/$', UserDelete.as_view(), name='user-delete'),
	url(r'^list/$', UserList.as_view(), name='user-list'),
	url(r'^signin/$', signin, name='user-signin')
]
