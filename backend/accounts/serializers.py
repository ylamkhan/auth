# serializers.py
from dj_rest_auth.registration.serializers import RegisterSerializer
from django.contrib.auth.models import User
from rest_framework import serializers
# from dj_rest_auth.serializers import LoginSerializer

class CustomRegisterSerializer(RegisterSerializer):
    # first_name = serializers.CharField(max_length=30)
    # last_name = serializers.CharField(max_length=30)
    # username = serializers.CharField(max_length=30)

    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    username = serializers.CharField(read_only=True)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data['first_name'] = self.validated_data.get('first_name', '')
        data['last_name'] = self.validated_data.get('last_name', '')
        # Automatically generate a username from first and last name
        data['username'] = f"{data['first_name'].lower()}_{data['last_name'].lower()}"
        return data

    def save(self, request):
        user = super().save(request)
        user.first_name = self.validated_data.get('first_name')
        user.last_name = self.validated_data.get('last_name')
        # Generate the username
        user.username = f"{user.first_name.lower()}_{user.last_name.lower()}"
        user.save()
        return user




from dj_rest_auth.serializers import LoginSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class CustomLoginSerializer(LoginSerializer):
    username = None  # Disable the username field

    email = serializers.EmailField(required=True)  # Add the email field

    def validate(self, attrs):
        # Get the email and password from the request
        email = attrs.get('email')
        password = attrs.get('password')

        # Find the user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError('User with this email does not exist.')

        # Check the password
        if not user.check_password(password):
            raise serializers.ValidationError('Invalid password.')

        # If everything is valid, return the user
        attrs['user'] = user
        return attrs
