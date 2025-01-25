from django.urls import path, include
from .views import TicketViewSet, CategoriaViewSet, UserViewSet , login, UserProfileViewSet, ticket_stats
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'tickets', TicketViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'profile', UserProfileViewSet, basename='profile')
router.register(r'usuarios', UserViewSet)

urlpatterns = [
    path('api/tickets/stats/', ticket_stats, name='ticket-stats'),
    path('api/login/', login, name='login'),
    path('api/', include(router.urls)),  # Incluye las rutas generadas por el router
    path('api/profile/upload-profile-image/', UserProfileViewSet.as_view({'patch': 'upload_profile_image'}), name='upload_profile_image'),
    path('api/users/', views.get_users, name='get_users'),
    path('api/users/<int:pk>/', views.get_user, name='get_user'),
]