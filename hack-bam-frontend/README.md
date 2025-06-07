# Museo Preferences App

Una aplicación Next.js para gestionar preferencias de obras de arte en museos y bibliotecas, con análisis de imágenes mediante IA.

## Características

- 🎨 **Análisis de imágenes con IA**: Identifica automáticamente obras de arte y genera tags
- 👤 **Autenticación completa**: Sistema de registro e inicio de sesión
- ❤️ **Gestión de preferencias**: Guarda y organiza tus gustos artísticos
- 📱 **Interfaz responsiva**: Diseño adaptado para móviles y desktop
- 🗄️ **Base de datos PostgreSQL**: Almacenamiento seguro en DigitalOcean Droplet

## Tecnologías

- Next.js 14
- React 18
- NextAuth.js
- Prisma ORM
- PostgreSQL
- TailwindCSS
- Axios
- TensorFlow.js

## Instalación

1. Clona el repositorio:
```bash
git clone <repo-url>
cd museo-preferences-app
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus configuraciones:
```
DATABASE_URL="postgresql://username:password@your-droplet-ip:5432/museo_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

4. Configura la base de datos:
```bash
npx prisma migrate dev
npx prisma generate
```

5. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

## Configuración del Droplet

### 1. Crear Droplet en DigitalOcean

```bash
# Conectar al droplet
ssh root@your-droplet-ip

# Actualizar sistema
apt update && apt upgrade -y

# Instalar PostgreSQL
apt install postgresql postgresql-contrib -y

# Configurar PostgreSQL
sudo -u postgres psql
CREATE DATABASE museo_db;
CREATE USER museo_user WITH ENCRYPTED PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE museo_db TO museo_user;
\q
```

### 2. Configurar firewall y acceso

```bash
# Configurar firewall
ufw allow OpenSSH
ufw allow 5432/tcp
ufw enable

# Editar configuración PostgreSQL
nano /etc/postgresql/14/main/postgresql.conf
# Cambiar: listen_addresses = '*'

nano /etc/postgresql/14/main/pg_hba.conf
# Añadir: host all all 0.0.0.0/0 md5

# Reiniciar PostgreSQL
systemctl restart postgresql
```

## Estructura del Proyecto

```
museo-preferences-app/
├── components/
│   ├── Layout.js          # Layout principal
│   └── CameraCapture.js   # Componente de cámara
├── pages/
│   ├── api/              # API Routes
│   ├── auth/             # Páginas de autenticación
│   ├── index.js          # Página principal
│   ├── dashboard.js      # Dashboard del usuario
│   └── camera.js         # Página de análisis
├── lib/
│   ├── prisma.js         # Cliente Prisma
│   └── auth.js           # Configuración NextAuth
├── prisma/
│   └── schema.prisma     # Esquema de base de datos
└── styles/
    └── globals.css       # Estilos globales
```

## API Endpoints

- `POST /api/auth/signup` - Registro de usuario
- `GET|POST|PUT /api/preferences` - Gestión de preferencias
- `GET|POST /api/artworks` - Gestión de obras
- `POST /api/analyze-image` - Análisis de imágenes

## Uso

1. **Registro**: Crea una cuenta nueva
2. **Análisis**: Sube una foto de una obra de arte
3. **IA**: El sistema identifica automáticamente la obra y genera tags
4. **Preferencias**: Tus gustos se actualizan automáticamente
5. **Dashboard**: Visualiza tus preferencias y estadísticas

## Próximas Características

- [ ] Integración con APIs de museos reales
- [ ] Recomendaciones basadas en preferencias
- [ ] Compartir colecciones con otros usuarios
- [ ] Mapa de museos cercanos
- [ ] Notificaciones de nuevas exposiciones

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request