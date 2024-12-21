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
    prioridad_display = serializers.CharField(source='get_prioridad_display', read_only=True)
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)


    class Meta:
        model = Ticket
        fields = ['id', 'asunto', 'mensaje', 'estado', 'prioridad', 
            'prioridad_display', 'estado_display', 'categoria',
            'usuario', 'agente', 'fecha_creacion', 'fecha_actualizacion']
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion', 'usuario', 'agente']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id','username', 'password', 'email', 'date_joined', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])  # Hashea la contraseña
        user.save()
        return user

     


        