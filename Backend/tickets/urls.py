from django.urls import path, include
from .views import TicketViewSet, CategoriaViewSet, UserRegisterView  # Importar UserRegisterView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'tickets', TicketViewSet)
router.register(r'categorias', CategoriaViewSet)

urlpatterns = [
    path('api/register/', UserRegisterView.as_view(), name='register'),  # Ruta para registro
    path('api/', include(router.urls)),  # Incluye las rutas generadas por el router
]
