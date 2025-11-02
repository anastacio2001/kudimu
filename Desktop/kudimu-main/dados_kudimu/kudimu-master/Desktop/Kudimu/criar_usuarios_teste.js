// Criador de usuário admin para teste
const API_URL = 'http://127.0.0.1:8787';

async function criarAdmin() {
  try {
    console.log('🔄 Criando usuário admin...');
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: 'Admin Kudimu',
        email: 'admin@kudimu.ao',
        telefone: '+244900000001',
        senha: 'admin123',
        localizacao: 'Luanda',
        perfil: 'administrador',
        tipo_conta: 'admin'
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Admin criado com sucesso!');
      console.log('📧 Email: admin@kudimu.ao');
      console.log('🔑 Senha: admin123');
      console.log('🎯 Tipo: admin');
    } else {
      console.log('❌ Erro:', data.error || data.message);
    }
  } catch (error) {
    console.error('❌ Erro de conexão:', error.message);
  }
}

async function criarCliente() {
  try {
    console.log('🔄 Criando usuário cliente...');
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: 'João Silva - Empresa XYZ',
        email: 'joao@empresaxyz.ao',
        telefone: '+244900000002',
        senha: 'cliente123',
        localizacao: 'Luanda',
        perfil: 'empresarial',
        tipo_conta: 'cliente'
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Cliente criado com sucesso!');
      console.log('📧 Email: joao@empresaxyz.ao');
      console.log('🔑 Senha: cliente123');
      console.log('🎯 Tipo: cliente');
    } else {
      console.log('❌ Erro:', data.error || data.message);
    }
  } catch (error) {
    console.error('❌ Erro de conexão:', error.message);
  }
}

async function criarUsuario() {
  try {
    console.log('🔄 Criando usuário normal...');
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: 'Maria Santos',
        email: 'maria@gmail.com',
        telefone: '+244900000003',
        senha: 'usuario123',
        localizacao: 'Benguela',
        perfil: 'profissional',
        tipo_conta: 'usuario'
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Usuário criado com sucesso!');
      console.log('📧 Email: maria@gmail.com');
      console.log('🔑 Senha: usuario123');
      console.log('🎯 Tipo: usuario');
    } else {
      console.log('❌ Erro:', data.error || data.message);
    }
  } catch (error) {
    console.error('❌ Erro de conexão:', error.message);
  }
}

// Executar criação dos usuários
async function main() {
  console.log('🚀 Iniciando criação de usuários de teste...\n');
  
  await criarAdmin();
  console.log('');
  await criarCliente();
  console.log('');
  await criarUsuario();
  
  console.log('\n🎉 Processo concluído!');
  console.log('\n📋 RESUMO DAS CREDENCIAIS:');
  console.log('👨‍💼 ADMIN: admin@kudimu.ao / admin123');
  console.log('🏢 CLIENTE: joao@empresaxyz.ao / cliente123');
  console.log('👤 USUÁRIO: maria@gmail.com / usuario123');
}

main();