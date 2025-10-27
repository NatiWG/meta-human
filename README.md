# 🔥 Meta.human con Firebase + Autenticación

## ✅ Ya Configurado

- ✅ Firebase conectado a tu proyecto
- ✅ Pantalla de Login/Registro
- ✅ Autenticación con Email/Password
- ✅ Autenticación con Google
- ✅ Código completo de la app (84 preguntas, 12 desafíos, calendario, etc.)

## 🚀 Cómo Deployar

### PASO 1: Habilitar Firestore en Firebase

1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Selecciona tu proyecto `metahuman-d30d8`
3. En el menú izquierdo: **Firestore Database**
4. Click en **"Create database"**
5. Selecciona **"Start in production mode"**
6. Elige región: **us-central1** (o la que prefieras)
7. Click **"Enable"**

### PASO 2: Configurar Reglas de Seguridad

1. En Firestore, ve a la pestaña **"Rules"**
2. Reemplaza todo con esto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

### PASO 3: Habilitar Autenticación

1. En el menú izquierdo: **Authentication**
2. Click en **"Get started"**
3. Habilita **"Email/Password"**:
   - Click en "Email/Password"
   - Toggle ON
   - Save
4. Habilita **"Google"**:
   - Click en "Google"
   - Toggle ON
   - Selecciona un email de soporte
   - Save

### PASO 4: Subir a GitHub

1. Abre GitHub Desktop
2. Repository → Show in Explorer/Finder
3. **BORRA** todo lo que hay
4. Descomprime el ZIP de Firebase
5. Copia TODO de la carpeta `meta-human-firebase`
6. Pégalo en tu repositorio
7. Commit: "Actualizar a versión con Firebase + Login"
8. Push origin

### PASO 5: Deploy en Vercel

- Vercel detectará el cambio automáticamente
- Espera 3-5 minutos (instala Firebase)
- ¡Listo!

## 🎯 Funcionalidades

### Login/Registro
- ✅ Email + Contraseña
- ✅ Google Sign In
- ✅ Validación de errores
- ✅ Loading states

### Sincronización Firebase
- ✅ Datos guardados en Firestore
- ✅ Sync automático cada vez que cambias algo
- ✅ Acceso desde cualquier dispositivo
- ✅ Respaldo seguro

### Todas las Features
- ✅ 84 preguntas filosóficas
- ✅ 12 desafíos IA
- ✅ Calendario funcional
- ✅ Gestión avanzada de tareas
- ✅ Exportar datos
- ✅ Todo lo demás

## 🔐 Seguridad

- Cada usuario solo ve sus datos
- Datos encriptados en Firebase
- Reglas de seguridad configuradas
- No se comparte información entre usuarios

## 📱 Uso

1. Regístrate con email o Google
2. Tus datos se guardan automáticamente
3. Cierra sesión y vuelve desde cualquier lugar
4. Todos tus datos están ahí

## 🆘 Solución de Problemas

**"No puedo crear cuenta"**
→ Verifica que habilitaste Email/Password en Firebase Authentication

**"Error al guardar datos"**
→ Verifica las reglas de Firestore

**"No aparece login con Google"**
→ Habilita Google Sign In en Firebase Authentication

---

**Versión Completa con Firebase + Autenticación**
Tu app personal con datos seguros en la nube ☁️
