-- Criar clientes baseados nos users existentes tipo 'cliente'
INSERT OR IGNORE INTO clientes (id, user_id, nome, email, saldo_creditos, plano, created_at)
SELECT 
    id as id,
    id as user_id,
    nome,
    email,
    50000 as saldo_creditos,
    'business' as plano,
    data_cadastro as created_at
FROM users 
WHERE tipo_conta = 'cliente';

-- Verificar resultado
SELECT 'Total de clientes criados:' as msg, COUNT(*) as total FROM clientes;
SELECT * FROM clientes;
