# -*- encoding: utf-8 -*-
from rest_framework import serializers
from .models import User
from RPosts.snippets import datetime_to_ms

class UserSerializer(serializers.ModelSerializer):
    can_create_posts = serializers.SerializerMethodField()
    date_joined = serializers.SerializerMethodField()

    def get_can_create_posts(self, obj):
        return obj.has_perm('posts.add_post')

    def get_date_joined(self, obj):
        return datetime_to_ms(obj.date_joined)

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'can_create_posts',
            'date_joined')


# -*- encoding: utf-8 -*-
import datetime
from time import mktime

def datetime_to_ms(dt):
    return 1000.0 * mktime(dt.timetuple())
