from __future__ import unicode_literals
import datetime
from django.db import models
from users.models import User

# Create your models here.


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)

    title = models.CharField(max_length=100)
    message = models.TextField()

    created_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        self.created_at = datetime.datetime.now()
        return super(Post, self).save(*args, **kwargs)
