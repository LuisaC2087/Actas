
# Backend sin bcrypt (modo local)

Este backend está diseñado para entornos locales donde no se necesita encriptación de contraseñas.

## 🚀 Instrucciones

1. Instalar dependencias:
```
npm install express mongoose cors dotenv jsonwebtoken
```

2. Iniciar el backend:
```
node app.js
```

3. Usuario de ejemplo (agregar manualmente en la colección 'usuarios'):
```
{
  "username": "admin",
  "password": "admin123",
  "rol": "admin",
  "nombre_completo": "Administrador General"
}
```
