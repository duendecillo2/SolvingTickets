INSTALLED_APPS = [
    # Otras aplicaciones
    'corsheaders',
    # ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # Otros middlewares
]

# Agrega la configuración de CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

# Si deseas permitir todos los orígenes (no recomendado para producción)
CORS_ALLOW_ALL_ORIGINS = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

CSRF_TRUSTED_ORIGINS = ['http://localhost:3000']

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}