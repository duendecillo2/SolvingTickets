from django.urls import path, include
from .views import TicketViewSet, CategoriaViewSet, UserViewSet , login, UserProfileViewSet, ticket_stats, TicketMessageViewSet, DeleteUserView, EditUserView, toggle_ban_user, listar_administradores
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register(r'tickets', TicketViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'usuarios', UserViewSet)
router.register(r'profile', UserProfileViewSet, basename='profile')
router.register(r'ticket-messages', TicketMessageViewSet)

urlpatterns = [
    path('api/tickets/stats/', ticket_stats, name='ticket-stats'),
    path('api/login/', login, name='login'),
    path('api/', include(router.urls)),  
    path('api/profile/upload-profile-image/', UserProfileViewSet.as_view({'patch': 'upload_profile_image'}), name='upload_profile_image'),
    path('api/users/', views.get_users, name='get_users'),
    path('api/users/<int:pk>/', views.get_user, name='get_user'),
    path('api/users/<int:user_id>/delete/', DeleteUserView.as_view(), name='delete_user'),
    path('api/users/<int:user_id>/edit/', EditUserView.as_view(), name='edit-user'),
    path('api/users/<int:user_id>/ban/', toggle_ban_user, name='toggle-ban-user'),
    path('api/administradores/', listar_administradores, name='listar_administradores'),
]



