# 🚀 Guía de Deploy en Railway - Airbnb Clone

## ✅ Archivos Creados/Modificados para Railway

Tu proyecto ya está listo. Se han creado/modificado estos archivos:

| Archivo | Estado | Propósito |
|---------|--------|-----------|
| `server.js` | ✅ Modificado | Rutas de archivos estáticos ahora son relativas |
| `package.json` | ✅ Modificado | Agregados scripts de build y engines |
| `.gitignore` | ✅ Creado | Excluye node_modules, .env, uploads |
| `Procfile` | ✅ Creado | Instrucción de inicio para Railway |
| `.env.example` | ✅ Creado | Plantilla de variables de entorno |
| `README_RAILWAY.md` | ✅ Creado | Documentación completa |

---

## 📋 PASOS PARA SUBIR A RAILWAY

### Paso 1: Sube tu código a GitHub
```bash
# En tu terminal
git init
git add .
git commit -m "Initial commit - ready for Railway"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/airbnb-clone.git
git push -u origin main
```

⚠️ **Importante**: El `.gitignore` excluirá:
- `node_modules/`
- `.env` (tus credenciales reales)
- `uploads/` (imágenes locales)
- `client/dist/` (build de producción)

---

### Paso 2: Configura Railway

1. **Ve a https://railway.app**
2. **Click en "New Project"**
3. **Selecciona "Deploy from GitHub repo"**
4. **Elige tu repositorio `airbnb-clone`**

---

### Paso 3: Variables de Entorno en Railway

En Railway Dashboard > Settings > Variables, agrega:

| Variable | Valor |
|----------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` (o el que Railway asigne) |
| `MONGO_URI` | Tu connection string de MongoDB Atlas |
| `JWT_SECRET` | Un string único y seguro (genera uno nuevo) |

**Ejemplo de JWT_SECRET seguro:**
```
JWT_SECRET=airbnb_prod_$(openssl rand -hex 32)
```

---

### Paso 4: MongoDB Atlas - Configurar IP Whitelist

1. Ve a https://cloud.mongodb.com
2. Network Access > Add IP Address
3. Selecciona **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click en Confirm

⚠️ **Sin esto, Railway no podrá conectar a tu BD**

---

### Paso 5: Deploy Automático

Railway automáticamente:
1. Detectará el `package.json`
2. Ejecutará `npm run build` (construye React en `client/dist`)
3. Ejecutará `npm start` (inicia Express)

**Verás en los logs:**
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

---

### Paso 6: Generar Dominio Público

En Railway > Settings > Domains:
1. Click en **"Generate Domain"**
2. Copia la URL (ej: `airbnb-clone-production.up.railway.app`)
3. ¡Listo! Tu app está en línea 🎉

---

## ⚠️ ADVERTENCIAS IMPORTANTES

### 1. Imágenes Subidas (Uploads)
**Problema**: Railway es efímero - las imágenes se borran en cada deploy.

**Soluciones:**
- **Opción A (Recomendada)**: Usa Cloudinary (gratis hasta 25GB)
- **Opción B**: AWS S3
- **Opción C**: MongoDB GridFS

**Para usar Cloudinary:**
```bash
npm install cloudinary multer-storage-cloudinary
```

---

### 2. Seed de Datos Iniciales

Si quieres cargar departamentos de ejemplo:

**Opción A**: Ejecuta localmente antes de subir
```bash
npm run seed
```

**Opción B**: Usa Railway CLI
```bash
railway run npm run seed
```

---

### 3. .env NO se sube
Tu `.env` local está en `.gitignore` por seguridad.

**En Railway**: Configura las variables manualmente en Settings > Variables

**Localmente**: Mantén tu `.env` actual

---

## 🧪 Verificar que Funciona

### Checklista Pre-Deploy
- [ ] `.env` con variables correctas
- [ ] MongoDB Atlas IP whitelist (0.0.0.0/0)
- [ ] `node_modules` no se sube a GitHub
- [ ] JWT_SECRET es único y seguro
- [ ] Pruebas locales funcionan (`npm run dev`)

### Checklista Post-Deploy
- [ ] Logs de Railway muestran "MongoDB Connected"
- [ ] Logs muestran "Server running on port XXXX"
- [ ] Página carga sin errores
- [ ] API endpoints responden
- [ ] Imágenes de propiedades se ven
- [ ] Login de admin funciona
- [ ] CRUD de departamentos funciona
- [ ] Filtros de búsqueda funcionan

---

## 🔧 Comandos Útiles

### Local
```bash
npm run dev          # Frontend + Backend
npm run build        # Build de producción
npm start            # Inicia servidor
npm run seed         # Carga datos de ejemplo
```

### Railway CLI
```bash
railway login        # Inicia sesión
railway logs         # Ver logs en tiempo real
railway run npm run seed  # Ejecutar seed en Railway
railway open         # Abrir dashboard
```

---

## 🆘 Solución de Problemas

### Error: "MongoDB Connection Error"
- Verifica que `MONGO_URI` esté correcto en Railway
- Verifica IP whitelist en MongoDB Atlas (0.0.0.0/0)

### Error: "Cannot find module"
- Ejecuta `npm install` localmente
- Verifica que `package.json` tenga todas las dependencias

### Error: "Cannot GET /"
- Verifica que `NODE_ENV=production` en Railway
- El build debe generar `client/dist/index.html`

### Imágenes no se ven
- Las rutas deben ser relativas (`/uploads/foto.jpg`)
- Verifica que las imágenes existen en la BD

---

## 📞 Soporte

- Railway Docs: https://docs.railway.app
- MongoDB Atlas Docs: https://www.mongodb.com/docs/atlas
- Express.js: https://expressjs.com

---

**¡Listo! Tu Airbnb Clone está en producción 🎉**
