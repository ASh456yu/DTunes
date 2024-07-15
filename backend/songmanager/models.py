from django.db import models
import uuid
from django.contrib.auth.models import User


class Playlist(models.Model):
    playlist_name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.playlist_name


class Songs(models.Model):
    title = models.CharField(max_length=100)
    artist = models.CharField(max_length=100, default="")
    song = models.FileField(upload_to="audios/", null=False)
    playlist = models.ManyToManyField(Playlist, related_name="songs", blank=True)
    like = models.ManyToManyField(User, related_name="likes", blank=True)
    dlike = models.ManyToManyField(User, related_name="dlikes", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.title
