# Generated by Django 5.0.2 on 2024-07-14 10:27

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("songmanager", "0002_remove_songslist_artist_pic_songslist_artist_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="songslist",
            name="playlist",
            field=models.ManyToManyField(
                blank=True, related_name="songs", to="songmanager.playlist"
            ),
        ),
    ]
