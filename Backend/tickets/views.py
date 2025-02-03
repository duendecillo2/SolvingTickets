from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .models import Ticket, Categoria, UserProfile, TicketMessage
from .serializers import TicketSerializer, CategoriaSerializer, UserSerializer, TicketMessageSerializer
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
from rest_framework.views import APIView
from django.http import JsonResponse
from django.contrib.auth import authenticate, login

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['patch'], url_path='actualizar-estado', permission_classes=[IsAuthenticated])
    def actualizar_estado(self, request, pk=None):
        ticket = self.get_object()
        nuevo_estado = request.data.get('estado')

        # Validar que el nuevo estado es válido
        if nuevo_estado not in dict(Ticket.ESTADO_CHOICES).keys():
            return Response({'error': 'Estado no válido'}, status=status.HTTP_400_BAD_REQUEST)

        ticket.estado = nuevo_estado
        ticket.save()

        return Response({'mensaje': 'Estado actualizado correctamente', 'estado': ticket.estado}, status=status.HTTP_200_OK)

    def get_queryset(self):

        #Devuelve todos los tickets si es un agente
        if self.request.user.profile.role == 'agent':
            return Ticket.objects.filter(agente=self.request.user)

        # Filtra los tickets para que solo se muestren los del usuario autenticado
        return Ticket.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.validated_data['usuario'] = self.request.user

        # Buscar el agente con menos tickets asignados
        agente_asignado = User.objects.filter(profile__role='agent') \
                                    .annotate(num_tickets=Count('tickets_asignados')) \
                                    .order_by('num_tickets') \
                                    .first()

        # Si hay agentes disponibles, asignar el que tenga menos tickets
        if agente_asignado:
            serializer.validated_data['agente'] = agente_asignado

        serializer.save()

class TicketMessageViewSet(viewsets.ModelViewSet):
    queryset = TicketMessage.objects.all()
    serializer_class = TicketMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtrar los mensajes por ticket
        ticket_id = self.request.query_params.get('ticket')
        if ticket_id:
            return TicketMessage.objects.filter(ticket_id=ticket_id)
        return TicketMessage.objects.all()

    @action(detail=True, methods=['post'], url_path='responder', permission_classes=[IsAuthenticated])
    def responder_mensaje(self, request, pk=None):
        """
        Permite que un administrador responda a un mensaje específico de un ticket.
        """
        try:
            ticket_message = TicketMessage.objects.get(pk=pk)
        except TicketMessage.DoesNotExist:
            return Response({'error': 'Mensaje no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.profile.role != 'agent':
            return Response({'error': 'No tienes permiso para responder mensajes'}, status=status.HTTP_403_FORBIDDEN)

        respuesta = request.data.get('respuesta')

        # Validar que se envió una respuesta
        if not respuesta:
            return Response({'error': 'Se requiere una respuesta'}, status=status.HTTP_400_BAD_REQUEST)

        # Actualizar la respuesta del mensaje
        ticket_message.respuesta = respuesta
        ticket_message.save()

        # Actualizar el estado del ticket si no está "Cerrado"
        ticket = ticket_message.ticket
        if ticket.estado != 'C':
            ticket.estado = 'R'  # Marcamos como Respondido
            ticket.agente = request.user
            ticket.save()

        return Response({"mensaje": "La respuesta ha sido registrada correctamente"}, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """
        Permite a un usuario enviar un nuevo mensaje asociado a un ticket.
        """
        
        ticket_id = request.data.get('ticket')
        mensaje = request.data.get('mensaje')

        # Validar que se envíe el ticket y el mensaje
        if not ticket_id or not mensaje:
            return Response({'error': 'Se requiere un ticket y un mensaje'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            ticket = Ticket.objects.get(pk=ticket_id)
        except Ticket.DoesNotExist:
            return Response({'error': 'El ticket no existe'}, status=status.HTTP_404_NOT_FOUND)

        # Crear una nueva instancia de TicketMessage
        ticket_message = TicketMessage.objects.create(
            ticket=ticket,
            mensaje=mensaje
        )

        # Si el ticket está cerrado, no permitir enviar mensajes
        if ticket.estado == 'C':
            return Response({'error': 'No se pueden enviar mensajes a un ticket cerrado'}, status=status.HTTP_400_BAD_REQUEST)

        ticket_message.save()

        # Cambiar el estado del ticket a Pendiente si es necesario
        if ticket.estado != 'C':
            ticket.estado = 'P'  # Pendiente
            ticket.save()

        return Response({"mensaje": "El mensaje ha sido enviado correctamente"}, status=status.HTTP_201_CREATED)    

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

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

def get_users(request):
        users = User.objects.all().select_related('profile').values(
            'id', 'username', 'email', 'is_active', 'profile__role', 'profile__status'
        )
        user_list = list(users)
        return JsonResponse(user_list, safe=False)

def get_user(request, pk):
    user = User.objects.filter(pk=pk).select_related('profile').values(
        'id', 'username', 'email', 'is_active', 'profile__role', 'profile__status'
    )
    return JsonResponse(list(user), safe=False)  

class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated]  # Permite solo a usuarios autenticados

    def delete(self, request, user_id):
        print("holaa")
        try:
            user = User.objects.get(id=user_id)
            if request.user.profile.role != 'agent':
                return Response({"detail": "No tienes permiso para eliminar usuarios."}, status=status.HTTP_403_FORBIDDEN)
            user.delete()
            return Response({"message": "User deleted successfully."}, status=204)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=404)

class EditUserView(APIView):
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden editar
    
    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            profile = user.profile

            # Verificar si el usuario que realiza la acción es un agente
            if request.user.profile.role != 'agent':
                return Response({"detail": "No tienes permiso para editar usuarios."}, status=status.HTTP_403_FORBIDDEN)

            # Obtener el nuevo rol del cuerpo de la solicitud
            new_role = request.data.get('role')
            if new_role not in ['user', 'agent']:
                return Response({"detail": "Rol no válido."}, status=status.HTTP_400_BAD_REQUEST)

            # Actualizar el rol del usuario
            profile.role = new_role
            profile.save()

            return Response({"message": "User role updated successfully."}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Solo administradores pueden banear/desbanear
def toggle_ban_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        profile = user.profile
        profile.status = 'ban' if profile.status == 'active' else 'active'
        profile.save()
        return Response({"message": f"User {user.username} is now {profile.status}"})
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
