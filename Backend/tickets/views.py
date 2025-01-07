from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Ticket, Categoria, UserProfile
from .serializers import TicketSerializer, CategoriaSerializer, UserSerializer
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.authtoken.models import Token
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK
from .models import UserProfile
from .serializers import UserProfileSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import FileSystemStorage
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Count

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'], url_path='responder', permission_classes=[IsAuthenticated])
    def responder_ticket(self,request,pk=None):
        ticket = self.get_object()
        if request.user.profile.role != 'agent':
            return Response({'error': 'No tienes permiso para responder tickets'}, status=400)

        respuesta = request.data.get('respuesta')

        #Compruebo si se obtiene la respuesta
        if not respuesta:
            return Response({'error' : 'Se requiere una respuesta'}, status=400)

        ticket.estado = 'R'    
        ticket.respuesta = respuesta
        ticket.agente = request.user
        ticket.save()

        return Response({"exito" : "El ticket ha sido respondido correctamente"})


    def get_queryset(self):

        #Devuelve todos los tickets si es un agente
        if self.request.user.profile.role == 'agent':
            return Ticket.objects.filter(agente=self.request.user)

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
        UserProfile.objects.create(user=user)

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

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    @action(detail=False, methods=['patch'], url_path='upload-profile-image')
    def upload_profile_image(self, request):
        print(f"request.FILES: {request.FILES}")
        if 'profile_image' not in request.FILES:
            return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            profile = UserProfile(user=request.user)

        profile.profile_image = request.FILES['profile_image']
        profile.save()

        return Response({
            'imageUrl': profile.profile_image.url if profile.profile_image else None
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ticket_stats(request):
    # Filtrar los tickets asignados al agente actual
    print("Obteniendo estadísticas de tickets...")
    current_user = request.user
    assigned_tickets = Ticket.objects.filter(agente=current_user)

    total_tickets = assigned_tickets.count()

    # Contar tickets por estado
    tickets_by_state = assigned_tickets.values('estado').annotate(count=Count('estado'))
    estado_display_map = dict(Ticket.ESTADO_CHOICES)  # Mapea los valores de estado a sus nombres legibles
    state_stats = {estado_display_map.get(item['estado'], item['estado']): item['count'] for item in tickets_by_state}

    # Contar tickets por prioridad
    tickets_by_priority = assigned_tickets.values('prioridad').annotate(count=Count('prioridad'))
    priority_display_map = dict(Ticket.PRIORIDAD_CHOICES)  # Mapea los valores de prioridad
    priority_stats = {priority_display_map.get(item['prioridad'], item['prioridad']): item['count'] for item in tickets_by_priority}

    # Contar tickets por categoría
    tickets_by_category = assigned_tickets.values('categoria__nombre').annotate(count=Count('categoria'))
    category_stats = {item['categoria__nombre']: item['count'] for item in tickets_by_category}

    # Porcentaje de tickets cerrados
    closed_tickets = assigned_tickets.filter(estado='C').count()
    closed_percentage = (closed_tickets / total_tickets * 100) if total_tickets > 0 else 0

    # Preparar datos para la respuesta
    data = {
        'total': total_tickets,
        'by_state': state_stats,
        'by_priority': priority_stats,
        'by_category': category_stats,
        'closed_percentage': closed_percentage,
    }
    return Response(data)