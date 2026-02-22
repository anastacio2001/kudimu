#!/usr/bin/env node

/**
 * Script para gerar VAPID keys para Web Push Notifications
 * Uso: node generateVAPIDKeys.js
 */

const crypto = require('crypto');

function generateVAPIDKeys() {
  // Gera keypair usando ECDH (Elliptic Curve Diffie-Hellman) com curva P-256
  const ecdh = crypto.createECDH('prime256v1');
  ecdh.generateKeys();

  const publicKey = ecdh.getPublicKey();
  const privateKey = ecdh.getPrivateKey();

  // Converte para Base64 URL-safe
  const publicKeyBase64 = urlBase64Encode(publicKey);
  const privateKeyBase64 = urlBase64Encode(privateKey);

  return {
    publicKey: publicKeyBase64,
    privateKey: privateKeyBase64
  };
}

function urlBase64Encode(buffer) {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Gera as keys
const keys = generateVAPIDKeys();

console.log('\n🔑 VAPID Keys geradas com sucesso!\n');
console.log('═══════════════════════════════════════════════════════════\n');
console.log('📋 Copie estas keys para seu projeto:\n');
console.log('Public Key (para frontend):\n');
console.log(keys.publicKey);
console.log('\n');
console.log('Private Key (para backend - MANTENHA SEGURA!):\n');
console.log(keys.privateKey);
console.log('\n═══════════════════════════════════════════════════════════\n');
console.log('📝 Adicione ao wrangler.toml:\n');
console.log('[vars]');
console.log(`VAPID_PUBLIC_KEY = "${keys.publicKey}"`);
console.log(`VAPID_PRIVATE_KEY = "${keys.privateKey}"`);
console.log('\n');
console.log('📝 Atualize no frontend (pushNotifications.js):\n');
console.log(`const VAPID_PUBLIC_KEY = '${keys.publicKey}';`);
console.log('\n═══════════════════════════════════════════════════════════\n');
console.log('⚠️  IMPORTANTE: Não commite a PRIVATE KEY no repositório!\n');
console.log('💡 Use environment variables ou secrets do Cloudflare.\n');
