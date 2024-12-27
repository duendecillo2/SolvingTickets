from django.contrib import admin
from .models import Categoria, UserProfile, Ticket

admin.site.register(Categoria)
admin.site.register(UserProfile)
admin.site.register(Ticket)
