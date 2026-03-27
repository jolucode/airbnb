#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🔨 Iniciando build del frontend...');

try {
  // Instalar dependencias del cliente
  console.log('📦 Instalando dependencias del cliente...');
  execSync('npm install --legacy-peer-deps', {
    cwd: path.join(__dirname, 'client'),
    stdio: 'inherit'
  });

  // Ejecutar build de Vite directamente desde node_modules
  console.log('⚙️ Ejecutando Vite build...');
  execSync('node node_modules/vite/bin/vite.js build', {
    cwd: path.join(__dirname, 'client'),
    stdio: 'inherit'
  });

  console.log('✅ Build completado exitosamente!');
} catch (error) {
  console.error('❌ Error durante el build:', error.message);
  process.exit(1);
}
