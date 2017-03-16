# -*- encoding: utf-8 -*-
from rest_framework import serializers
from .models import Post
from RPosts.snippets import datetime_to_ms


class PostSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    def get_user(self, obj):
        return {
            'username': obj.user.username,
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name
        }

    def get_created_at(self, obj):
        return datetime_to_ms(obj.created_at)

    class Meta:
        model = Post
        fields = ('title', 'message', 'created_at', 'user')
