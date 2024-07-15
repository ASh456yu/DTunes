import json
from django.shortcuts import redirect, render
from django.views import View
from rest_framework import generics, status
from .models import Songs
from .serializers import SongsSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.decorators import login_required
from .models import Playlist
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login, authenticate
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User


@csrf_exempt
def Login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")
        except json.JSONDecodeError:
            username = None
            password = None
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"message": "Login successful", "status": "ok"})
        else:
            return JsonResponse({"error": "Invalid credentials", "status": "no"})
    else:
        return JsonResponse({"status": "no"})


class SongsListView(generics.ListCreateAPIView):
    queryset = Songs.objects.all()
    serializer_class = SongsSerializer
    permission_classes = [AllowAny]


class SongDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Songs.objects.all()
    serializer_class = SongsSerializer
    permission_classes = [AllowAny]


@ensure_csrf_cookie
def csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})


def sendPlaylist(request):
    playlists = Playlist.objects.all().filter(user=request.user)
    playlists_data = []
    for playlist in playlists:
        playlists_data.append(
            {
                "id": playlist.id,
                "playlist_name": playlist.playlist_name,
            }
        )
    return JsonResponse({"playlists": playlists_data})


@csrf_exempt
def updatePlaylist(request):
    if request.method == "POST":
        try:
            try:
                data = json.loads(request.body)
                playlist_id = data.get("id")
                playlist_new_name = data.get("name")
            except json.JSONDecodeError:
                playlist_id = None
                playlist_new_name = None

            playlists = Playlist.objects.get(id=playlist_id)
            playlists.playlist_name = playlist_new_name
            playlists.save()
            return JsonResponse({"status": "ok"})
        except Exception as e:
            return JsonResponse({"status": "no", "error": e})
    else:
        return JsonResponse({"status": "not possible"})


@csrf_exempt
def deletePlaylist(request):
    if request.method == "POST":
        try:
            try:
                data = json.loads(request.body)
                playlist_id = data.get("id")
            except json.JSONDecodeError:
                playlist_id = None

            playlists = Playlist.objects.get(id=playlist_id)
            playlists.delete()
            return JsonResponse({"status": "ok"})
        except Exception as e:
            return JsonResponse({"status": "no", "error": e})
    else:
        return JsonResponse({"status": "not possible"})


@login_required
@csrf_exempt
def create_playlist(request):
    if request.method == "POST":
        try:
            playlist = Playlist.objects.create(
                playlist_name="New Playlist", user=request.user
            )
            playlist.save()
            return JsonResponse({"status": "ok"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})
    else:
        return JsonResponse({"status": "no"})


def send_songs(request):
    songs = Songs.objects.all()
    songs_data = []
    for song in songs:
        songs_data.append(
            {
                "id": song.id,
                "song_title": song.title,
                "song_artist": song.artist,
            }
        )
    return JsonResponse({"songs": songs_data})


@csrf_exempt
def send_song(request):
    if request.method == "POST":
        try:
            try:
                data = json.loads(request.body)
                song_id = data.get("song_id")
            except json.JSONDecodeError:
                song_id = None

            song = Songs.objects.get(id=song_id)
            song_playlist = []
            for plist in song.playlist.all():
                song_playlist.append(plist.id)
            song_data = {
                "song_title": song.title,
                "song_artist": song.artist,
                "song": str(song.song),
                "song_playlist": song_playlist,
            }
            return JsonResponse({"status": "ok", "song": song_data})
        except Exception as e:
            return JsonResponse({"status": "err", "error": e})
    else:
        return JsonResponse({"status": "not possible"})


@csrf_exempt
def search(request):
    if request.method == "POST":
        try:
            try:
                data = json.loads(request.body)
                query = data.get("query")
            except json.JSONDecodeError:
                query = None
            songs = Songs.objects.all()

            songs_data = []
            for s in songs:
                if (
                    query.lower() in s.title.lower()
                    or query.lower() in s.artist.lower()
                ):
                    songs_data.append(
                        {
                            "id": s.id,
                            "song_title": s.title,
                            "song_artist": s.artist,
                        }
                    )
                # print(s)
            return JsonResponse({"songs": songs_data})
        except Exception as e:
            return JsonResponse({"status": "err", "error": e})
    else:
        return JsonResponse({"status": "not possible"})


@csrf_exempt
def add_to_playlist(request):
    if request.method == "POST":
        try:
            try:
                data = json.loads(request.body)
                song_id = data.get("song_id")
                playlist_id = data.get("playlist_id")
            except json.JSONDecodeError:
                song_id = None
                playlist_id = None
            song = Songs.objects.get(id=song_id)
            playlist = Playlist.objects.get(id=playlist_id)

            song.playlist.add(playlist)
            song.save()
            return JsonResponse({"status": "ok"})
        except Exception as e:
            return JsonResponse({"status": "err", "error": e})
    else:
        return JsonResponse({"status": "not possible"})


@csrf_exempt
def delete_from_playlist(request):
    if request.method == "POST":
        try:
            try:
                data = json.loads(request.body)
                song_id = data.get("song_id")
                playlist_id = data.get("playlist_id")
            except json.JSONDecodeError:
                song_id = None
                playlist_id = None
            song = Songs.objects.get(id=song_id)
            playlist = Playlist.objects.get(id=playlist_id)

            song.playlist.remove(playlist)
            song.save()
            return JsonResponse({"status": "ok"})
        except Exception as e:
            return JsonResponse({"status": "err", "error": e})
    else:
        return JsonResponse({"status": "not possible"})


@csrf_exempt
def likes_manage(request):
    if request.method == "POST":
        try:
            try:
                data = json.loads(request.body)
                song_id = data.get("song_id")
                addordel = data.get("add_or_del")
            except json.JSONDecodeError:
                song_id = None
            song = Songs.objects.get(id=song_id)

            if addordel:
                song.like.add(request.user)
            else:
                song.like.remove(request.user)
            song.save()
            return JsonResponse({"status": "ok"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})
    else:
        return JsonResponse({"status": "no"})


@csrf_exempt
def dlikes_manage(request):
    if request.method == "POST":
        try:
            try:
                data = json.loads(request.body)
                song_id = data.get("song_id")
                addordel = data.get("add_or_del")
            except json.JSONDecodeError:
                song_id = None
                addordel = None
            song = Songs.objects.get(id=song_id)

            if addordel:
                song.dlike.add(request.user)
            else:
                song.dlike.remove(request.user)
            song.save()
            return JsonResponse({"status": "ok"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})
    else:
        return JsonResponse({"status": "no"})


@csrf_exempt
def send_user_data(request):
    if request.method == "POST":
        try:
            liked_songs = request.user.likes.all()
            dliked_songs = request.user.dlikes.all()
            like_song = []
            dlike_song = []
            for song in liked_songs:
                like_song.append(song.id)
            for song in dliked_songs:
                dlike_song.append(song.id)
            usrData = {
                "likedSongs": like_song,
                "dlikedSongs": dlike_song,
            }
            return JsonResponse({"status": "ok", "usrdata": usrData})
        except Exception as e:
            return JsonResponse({"status": "no", "error": e})
    return JsonResponse({"status": "get"})


@csrf_exempt
def send_playlist_songs(request):
    if request.method == "POST":
        try:
            try:
                data = json.loads(request.body)
                playlist_id = data.get("playlist_id")
            except json.JSONDecodeError:
                playlist_id = None
            playlist = Playlist.objects.get(id=playlist_id)
            all_songs = Songs.objects.all()
            playlist_songs = playlist.songs.all()
            pl_song = []
            npl_song = []
            for song in all_songs:
                if song not in playlist_songs:
                    npl_song.append(
                        {
                            "song_name": song.title,
                            "song_artist": song.artist,
                        }
                    )
                else:
                    pl_song.append(
                        {
                            "song_name": song.title,
                            "song_artist": song.artist,
                        }
                    )
            return JsonResponse(
                {
                    "status": "ok",
                    "playlist_song": {"playlist_s": pl_song, "nplaylist_s": npl_song},
                }
            )
        except Exception as e:
            return JsonResponse({"status": "no", "error": e})
    return JsonResponse({"status": "get"})
