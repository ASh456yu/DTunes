from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf.urls.static import static
from songmanager.views import (
    csrf_token,
    Login,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("csrf_token/", csrf_token, name="csrf_token"),
    path('api/logins/', Login, name='custom_login'),
    path('songmanage/', include("songmanager.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
