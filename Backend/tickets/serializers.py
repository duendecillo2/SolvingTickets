from rest_framework import serializers
from .models import Categoria, Ticket
from django.contrib.auth.models import User

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class TicketSerializer(serializers.ModelSerializer):
    usuario = serializers.StringRelatedField(read_only=True)
    agente = serializers.StringRelatedField(read_only=True)
    categoria = serializers.StringRelatedField()


    class Meta:
        model = Ticket
        fields = '__all__'
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion', 'usuario', 'agente']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email')

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])  # Hashea la contraseña
        user.save()
        return user

        