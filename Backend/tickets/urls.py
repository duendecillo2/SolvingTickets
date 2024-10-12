from django.urls import path, include
from .views import TicketViewSet, CategoriaViewSet, UserViewSet , login
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'tickets', TicketViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'usuarios', UserViewSet)

urlpatterns = [
    path('api/login/', login, name='login'),
    path('api/', include(router.urls)),  # Incluye las rutas generadas por el router
]
