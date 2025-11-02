# 🚀 Kudimu - Deploy Guide

## Cloudflare Pages Setup

### Quick Deploy Steps:

1. **Fork/Clone este repositório**
2. **Acesse [Cloudflare Dashboard](https://dash.cloudflare.com)**
3. **Vá em Workers & Pages → Create → Pages → Connect to Git**
4. **Selecione: `anastacio2001/kudimu`**

### Build Settings:
```
Framework preset: None
Build command: npm run build
Build output directory: dados_kudimu/kudimu-master/Desktop/Kudimu/dist
Root directory: dados_kudimu/kudimu-master/Desktop/Kudimu
```

### Environment Variables:
```
NODE_VERSION=18
NPM_VERSION=latest
```

### 🔧 Local Development:
```bash
cd dados_kudimu/kudimu-master/Desktop/Kudimu
npm install
npm run dev     # Development server
npm run build   # Production build
npm run deploy  # Deploy to Cloudflare
```

### 🌐 Live URLs:
- **Production**: `https://kudimu.pages.dev`
- **Preview**: `https://[commit-hash].kudimu.pages.dev`

### 📱 Features Deployed:
- ✅ Landing Page responsiva
- ✅ Sistema de autenticação
- ✅ Dashboard administrativo
- ✅ Campanhas de marketing
- ✅ Sistema de reputação
- ✅ Integração com IA
- ✅ Notificações push
- ✅ PWA (Progressive Web App)

### 🔄 Auto-Deploy:
Cada push para `master` faz deploy automático!