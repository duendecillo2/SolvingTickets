from django.db import models
from django.contrib.auth.models import User 

class Categoria(models.Model):
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre

class Ticket(models.Model):

    PRIORIDAD_CHOICES = [
        ('B', 'Baja'),
        ('M', 'Media'),
        ('A', 'Alta'),
        ('C', 'Critica'),
    ]

    ESTADO_CHOICES = [
        ('P', 'Pendiente'),
        ('R', 'Respondido'),
        ('C', 'Cerrado'),
    ]

    asunto = models.CharField(max_length = 100)
    mensaje = models.TextField() 
    estado = models.CharField(max_length = 1, choices = ESTADO_CHOICES, default = 'P')
    prioridad = models.CharField(max_length = 1, choices = PRIORIDAD_CHOICES, default = 'M')
    categoria = models.ForeignKey(Categoria, on_delete = models.SET_NULL, null = True, related_name = 'tickets') 
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name = 'tickets_creados') 
    agente = models.ForeignKey(User, on_delete=models.SET_NULL, null = True, blank = True, related_name = 'tickets_asignados') 
    fecha_creacion = models.DateTimeField(auto_now_add = True) 
    fecha_actualizacion = models.DateTimeField(auto_now = True)
    respuesta = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.asunto} - {self.get_estado_display()}" #get_estado_display(): 

        
class UserProfile(models.Model):

    ROLE_CHOICES = [
        ('user', 'Usuario'),
        ('agent', 'Agente'),
    ]

    # Relación uno a uno con el usuario
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")

    # Campo para almacenar la imagen de perfil
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)

    # Otros campos opcionales que puedas necesitar (por ejemplo, biografía)
    bio = models.TextField(null=True, blank=True)

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    
    def __str__(self):
        return f"{self.user.username}'s Profile"
