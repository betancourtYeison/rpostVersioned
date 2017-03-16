from django.conf.urls import url
from .views import PostCreate, PostList

urlpatterns = [
	url(r'^create/$', PostCreate.as_view(), name='post-create'),
	url(r'^list/$', PostList.as_view(), name='post-list')
]
