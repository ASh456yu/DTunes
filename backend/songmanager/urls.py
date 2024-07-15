from django.urls import path
from .views import (
    SongsListView,
    SongDetailView,
    deletePlaylist,
    updatePlaylist,
    sendPlaylist,
    create_playlist,
    send_songs,
    send_song,
    search,
    add_to_playlist,
    delete_from_playlist,
    likes_manage,
    dlikes_manage,
    send_user_data,
    send_playlist_songs
)

urlpatterns = [
    path("delete_playlist/", deletePlaylist, name="delete_playlist"),
    path("update_playlist/", updatePlaylist, name="update_playlist"),
    path("send_playlist/", sendPlaylist, name="send_playlist"),
    path("create_playlist/", create_playlist, name="create_playlist"),
    path("songs/", SongsListView.as_view(), name="songs-list"),
    path("songs/<int:pk>/", SongDetailView.as_view(), name="song-detail"),
    path("send_songs/", send_songs, name="send-songs"),
    path("send_song/", send_song, name="send-song"),
    path("search/", search, name="search-song"),
    path("add_to_playlist/", add_to_playlist, name="add_to_playlist"),
    path("delete_from_playlist/", delete_from_playlist, name="delete_from_playlist"),
    path("likes_manage/", likes_manage, name="likes_manage"),
    path("dlikes_manage/", dlikes_manage, name="dlikes_manage"),
    path("send_user_data/", send_user_data, name="send_user_data"),
    path("send_playlist_songs/", send_playlist_songs, name="send_playlist_songs"),
]
