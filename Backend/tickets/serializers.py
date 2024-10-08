from rest_framework import serializers
from .models import Categoria, Ticket

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class TicketSerializer(serializers.ModelSerializer):
    usuario = serializers.StringRelatedField(read_only=True)
    agente = serializers.StringRelatedField(read_only=True)
    categoria = CategoriaSerializer(read_only=True)

    class Meta:
        model = Ticket
        fields = '__all__'
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion']
