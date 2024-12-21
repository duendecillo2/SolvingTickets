from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Ticket, Categoria
from .serializers import TicketSerializer, CategoriaSerializer, UserSerializer
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtra los tickets para que solo se muestren los del usuario autenticado
        return Ticket.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)  

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        user = serializer.save()

    def get_queryset(self):
        # Filtra los usuarios para que solo se muestren los del usuario autenticado
        return User.objects.filter(id=self.request.user.id)    

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.first_name = request.data.get('first_name', instance.first_name)
        if 'password' in request.data:
            instance.set_password(request.data['password'])
        instance.save()
        return Response(UserSerializer(instance).data)
        
@api_view(['POST'])
def login(request):

    user = get_object_or_404(User, username=request.data['username'])

    if not user.check_password(request.data['password']):
        return Response({"error" : "Invalid password"}, status=HTTP_400_BAD_REQUEST)

    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)

    return Response({"token": token.key, "user":serializer.data}, status=HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_authenticated_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
