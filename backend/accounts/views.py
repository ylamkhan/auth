# # views.py
# from dj_rest_auth.registration.views import RegisterView
# from .serializers import CustomRegisterSerializer
# from dj_rest_auth.views import LoginView

# class CustomRegisterView(RegisterView):
#     serializer_class = CustomRegisterSerializer


# views.py

# class CustomLoginView(LoginView):
#     serializer_class = CustomLoginSerializer


# accounts/views.py (or your relevant views file)

from django.contrib.auth.models import User
from dj_rest_auth.registration.views import RegisterView
from django.utils.text import slugify

class CustomRegisterView(RegisterView):
    def perform_create(self, serializer):
        first_name = self.request.data.get('first_name')
        last_name = self.request.data.get('last_name')
        
        # Generate a username
        base_username = f"{first_name}_{last_name}"
        username = slugify(base_username)  # This will create a URL-friendly version of the username
        counter = 1
        
        # Ensure the username is unique
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
        
        # Create the user with the unique username
        serializer.save(username=username)
