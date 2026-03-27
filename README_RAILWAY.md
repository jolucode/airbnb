# Airbnb Clone - Railway Deployment

## 🚀 Deploy en Railway

### 1. Conecta tu repositorio a Railway
- Ve a https://railway.app
- Click en "New Project"
- Selecciona "Deploy from GitHub repo"
- Elige tu repositorio

### 2. Variables de Entorno (IMPORTANTÍSIMO)
Configura estas variables en Railway > Settings > Variables:

```
NODE_ENV=production
PORT=5000
MONGO_URI=tu_mongodb_uri
JWT_SECRET=tu_secreto_super_seguro_cambia_esto_2026
```

### 3. Build y Start
Railway automáticamente ejecutará:
- **Build**: `npm run build` (construye el frontend en client/dist)
- **Start**: `npm start` (inicia el servidor Express)

### 4. Imágenes y Archivos Subidos
⚠️ **ADVERTENCIA**: Railway es efímero - los archivos subidos se pierden en cada deploy.

**Soluciones recomendadas:**
1. **Cloudinary** (gratis) - Para almacenar imágenes en la nube
2. **AWS S3** - Para almacenamiento escalable
3. **MongoDB GridFS** - Guardar imágenes en la base de datos

### 5. MongoDB
Este proyecto usa MongoDB Atlas (ya está configurado en MONGO_URI).
Asegúrate de que tu IP whitelist permita acceso desde cualquier lugar (0.0.0.0/0) para producción.

### 6. Seed Inicial
Para cargar datos iniciales, ejecuta en Railway:
```
railway run npm run seed
```

## 📁 Estructura del Proyecto
```
airbnb/
├── server.js          # Backend Express (puerto 5000)
├── client/            # Frontend React + Vite
│   ├── dist/          # Build de producción (auto-generado)
│   └── src/
├── routes/            # API endpoints
├── models/            # Modelos Mongoose
├── middleware/        # Auth JWT
├── uploads/           # Imágenes subidas (efímero en Railway)
└── .env               # Variables locales (NO SUBIR)
```

## 🔧 Comandos Locales
```bash
# Desarrollo (front + back)
npm run dev

# Producción (build + start)
npm run build
npm start

# Seed de datos
npm run seed
```

## 📝 Notas Importantes
- El frontend se sirve desde el backend en producción (`client/dist`)
- Las rutas de imágenes usan paths relativos, no absolutos
- JWT_SECRET debe ser único y seguro en producción
- Las imágenes subidas localmente NO se sincronizan con Railway
