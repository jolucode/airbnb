const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos - solo si las carpetas existen
const uploadsPath = path.join(__dirname, 'uploads');
const fotosPath = path.join(__dirname, 'fotos_departamento');

if (fs.existsSync(uploadsPath)) {
  app.use('/uploads', express.static(uploadsPath));
  console.log('📁 /uploads directory mounted');
}

if (fs.existsSync(fotosPath)) {
  app.use('/fotos_departamento', express.static(fotosPath));
  console.log('📁 /fotos_departamento directory mounted');
}

// Database Connection (async, no bloquea el inicio)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('⚠️ Server continuing without database (will retry on request)');
  }
};
connectDB();

// Routes
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/properties', require('./routes/properties'));
  app.use('/api/bookings', require('./routes/bookings'));
  console.log('🔌 API routes loaded');
} catch (err) {
  console.error('❌ Error loading routes:', err.message);
}

// Production Build
const distPath = path.join(__dirname, 'client', 'dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  console.log('📦 Serving production build from client/dist');
  
  app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: 'Frontend not found' });
    }
  });
} else if (process.env.NODE_ENV === 'production') {
  console.warn('⚠️ Production mode but client/dist not found');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // No salir del proceso, continuar
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // No salir del proceso, continuar
});
