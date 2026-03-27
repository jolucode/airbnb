# Airbnb Clone - Ready for Railway Deployment 🚀

[![Status](https://img.shields.io/badge/status-ready%20for%20deploy-brightgreen)]()
[![Stack](https://img.shields.io/badge/stack-MERN%20%7C%20Vite-blue)]()
[![Railway](https://img.shields.io/badge/deploy-railway-purple)]()

## ✅ Estado del Proyecto: LISTO PARA RAILWAY

Tu proyecto ha sido configurado y está listo para desplegarse en Railway.

---

## 📁 Archivos de Configuración Creados

| Archivo | Descripción |
|---------|-------------|
| ✅ `.gitignore` | Excluye node_modules, .env, uploads |
| ✅ `Procfile` | Instrucción de inicio para Railway |
| ✅ `.env.example` | Plantilla de variables de entorno |
| ✅ `DEPLOY_GUIDE.md` | **Guía paso a paso para deploy** |
| ✅ `README_RAILWAY.md` | Documentación técnica |

---

## 🔧 Modificaciones Realizadas

### 1. `server.js` - Rutas de Archivos Estáticos
```javascript
// ANTES (roto en Linux):
app.use('/fotos_departamento', express.static('C:/laragon/www/airbnb/fotos_departamento'));

// AHORA (funciona en cualquier OS):
app.use('/fotos_departamento', express.static(path.join(__dirname, 'fotos_departamento')));
```

### 2. `package.json` - Scripts de Producción
```json
{
  "scripts": {
    "heroku-postbuild": "npm run build"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 3. `.env` - Variables Actualizadas
```env
NODE_ENV=development
JWT_SECRET=airbnb_clone_super_secret_jwt_key_2026_change_in_production_xyz789
```

---

## 🚀 Deploy Rápido en 5 Pasos

### 1️⃣ Sube a GitHub
```bash
git init
git add .
git commit -m "Ready for Railway deploy"
git push origin main
```

### 2️⃣ Conecta Railway
- Ve a https://railway.app
- New Project → Deploy from GitHub
- Selecciona tu repo

### 3️⃣ Configura Variables de Entorno
En Railway > Settings > Variables:
```
NODE_ENV=production
PORT=5000
MONGO_URI=tu_mongodb_uri
JWT_SECRET=tu_secreto_seguro
```

### 4️⃣ MongoDB Atlas IP Whitelist
- Network Access → Add IP Address
- Selecciona "Allow Access from Anywhere" (0.0.0.0/0)

### 5️⃣ ¡Listo!
Railway hará build y deploy automáticamente.

---

## 📋 Comandos Locales

```bash
# Desarrollo (front + back)
npm run dev

# Build de producción
npm run build

# Iniciar servidor
npm start

# Seed de datos
npm run seed
```

---

## ⚠️ Advertencias Importantes

### 1. Imágenes Subidas (Uploads)
**Railway es efímero** - las imágenes se borran en cada deploy.

**Solución recomendada**: Integra Cloudinary
```bash
npm install cloudinary multer-storage-cloudinary
```

### 2. .env No Se Sube
Tu `.env` está en `.gitignore`. Configura las variables en Railway manualmente.

### 3. MongoDB Atlas
Asegúrate de permitir acceso desde cualquier IP (0.0.0.0/0).

---

## 📚 Documentación Completa

- **[DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)** - Guía detallada paso a paso
- **[README_RAILWAY.md](./README_RAILWAY.md)** - Documentación técnica

---

## 🧪 Test Pre-Deploy

Antes de subir, verifica localmente:

```bash
# 1. Build de producción
npm run build

# 2. Iniciar en modo producción
set NODE_ENV=production && npm start

# 3. Verifica que:
#    - Frontend carga desde client/dist
#    - API endpoints responden
#    - Imágenes se ven correctamente
```

---

## 🛠️ Stack Tecnológico

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)

### Frontend
- React 18
- Vite (build tool)
- Tailwind CSS
- React Router DOM
- Axios
- Lucide Icons
- React DatePicker

---

## 📞 Soporte

Si encuentras errores:

1. Revisa los logs en Railway Dashboard
2. Verifica variables de entorno
3. Confirma MongoDB Atlas IP whitelist
4. Lee [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) sección de troubleshooting

---

**¡Tu Airbnb Clone está listo para producción! 🎉**
