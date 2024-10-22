# project/urls.py (this is the main urls.py)

from django.contrib import admin
from django.urls import path, include
from dj_rest_auth.app_settings import api_settings

from dj_rest_auth.registration.views import RegisterView, LoginView, VerifyEmailView, ResendEmailVerificationView
from dj_rest_auth.views import LoginView, LogoutView, UserDetailsView, PasswordChangeView, PasswordResetView, PasswordResetConfirmView
# from accounts.views import CustomRegisterView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),  # Include your app's URLs here

    # path('', include('dj_rest_auth.urls')),  # Authentication routes

    # path('verify-email/', VerifyEmailView.as_view(), name='verify_email'),
    # path('resend-verification/', ResendEmailVerificationView.as_view(), name='resend_email_verification'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/user/', UserDetailsView.as_view(), name='user_details'),
    path('api/password/change/', PasswordChangeView.as_view(), name='password_change'),
    path('api/password/reset/', PasswordResetView.as_view(), name='password_reset'),
    path('api/password/reset/', PasswordResetView.as_view(), name='password_reset'),
    path('api/password/reset/confirm/<uid>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]

# Conditionally add JWT routes if USE_JWT is enabled
if api_settings.USE_JWT:
    from rest_framework_simplejwt.views import TokenVerifyView
    from dj_rest_auth.jwt_auth import get_refresh_view

    urlpatterns += [
        path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
        path('api/token/refresh/', get_refresh_view().as_view(), name='token_refresh'),
    ]
