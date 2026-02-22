// Debug do login admin
async function debugLogin() {
  const API_URL = 'http://127.0.0.1:8787';
  
  console.log('🔍 DEBUGANDO LOGIN ADMIN...\n');
  
  try {
    // 1. Fazer login
    console.log('1️⃣ Fazendo login...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@kudimu.ao',
        senha: 'admin123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('📊 Dados do login:', loginData);

    if (!loginData.success) {
      console.error('❌ Login falhou:', loginData.error);
      return;
    }

    const token = loginData.data.token;
    console.log('🎫 Token obtido:', token.substring(0, 20) + '...');

    // 2. Buscar dados do usuário
    console.log('\n2️⃣ Buscando dados do usuário...');
    const userResponse = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const userData = await userResponse.json();
    console.log('👤 Dados completos do usuário:', userData);

    if (userData.success) {
      console.log('\n✅ ANÁLISE DOS DADOS:');
      console.log('📧 Email:', userData.data.email);
      console.log('👤 Nome:', userData.data.nome);
      console.log('🏷️ Tipo de conta:', userData.data.tipo_conta);
      console.log('🎯 É admin?', userData.data.tipo_conta === 'admin');
      
      if (userData.data.tipo_conta === 'admin') {
        console.log('✅ Usuário é admin - deve ver interface administrativa');
      } else {
        console.log('❌ Usuário NÃO é admin - tipo_conta:', userData.data.tipo_conta);
      }
    } else {
      console.error('❌ Erro ao buscar dados:', userData.error);
    }

  } catch (error) {
    console.error('💥 Erro de conexão:', error.message);
  }
}

// Executar debug
debugLogin();