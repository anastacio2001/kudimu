// Debug do frontend - verificar se está chegando dados corretos
console.log('🔍 DEBUGANDO FRONTEND...');

// Verificar localStorage após login
console.log('📱 Dados no localStorage:');
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user') || '{}'));

// Verificar se AppRouter está detectando admin
const user = JSON.parse(localStorage.getItem('user') || '{}');
console.log('\n🎯 Verificação do Admin:');
console.log('User object:', user);
console.log('tipo_conta:', user.tipo_conta);
console.log('É admin?', user.tipo_conta === 'admin');

// Verificar URL atual
console.log('\n🌐 Estado da navegação:');
console.log('URL atual:', window.location.pathname);
console.log('Deveria estar em /admin/dashboard?', user.tipo_conta === 'admin');

// Simular o que AppRouter faz
console.log('\n⚙️ Lógica do AppRouter:');
const isAdmin = user && user.tipo_conta === 'admin';
console.log('Variável isAdmin:', isAdmin);

if (isAdmin) {
  console.log('✅ Usuário é admin - deveria ver menu administrativo');
} else {
  console.log('❌ Usuário NÃO é admin - vendo interface normal');
  console.log('Motivo: tipo_conta =', user.tipo_conta);
}