from rest_framework import serializers
from .models import Categoria, Ticket, UserProfile, TicketMessage
from django.contrib.auth.models import User

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre']

class TicketSerializer(serializers.ModelSerializer):
    usuario = serializers.StringRelatedField(read_only=True)
    agente = serializers.StringRelatedField(read_only=True)
    categoria = serializers.PrimaryKeyRelatedField(queryset=Categoria.objects.all())
    prioridad_display = serializers.CharField(source='get_prioridad_display', read_only=True)
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)


    class Meta:
        model = Ticket
        fields = ['id', 'asunto', 'estado', 'prioridad', 
            'prioridad_display', 'estado_display', 'categoria',
            'usuario', 'agente', 'fecha_creacion', 'fecha_actualizacion',]
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion', 'usuario', 'agente']

class TicketMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketMessage
        fields = ['id', 'ticket', 'mensaje', 'respuesta']        

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'date_joined', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])  # Hashea la contraseña
        user.save()
        
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'profile_image', 'bio', 'role', 'role_display', 'status', 'status_display']

    def update(self, instance, validated_data):
        profile_image = validated_data.get('profile_image', None)
        role = validated_data.get('role', None)

        if profile_image:
            instance.profile_image = profile_image

        # Asignar rol 'user' por defecto si el rol es nulo
        if role is None:
            instance.role = 'user'
        else:
            instance.role = role

        instance.save()
        return instance
