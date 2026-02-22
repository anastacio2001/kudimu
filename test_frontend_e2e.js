/**
 * KUDIMU INSIGHTS - TESTES END-TO-END FRONTEND
 * Testes automatizados com Puppeteer
 * Data: 13 de Fevereiro de 2026
 */

const puppeteer = require('puppeteer');

const FRONTEND_URL = 'http://localhost:9000';
const API_URL = 'http://127.0.0.1:8787';

// Cores para console
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

let testsPassed = 0;
let testsFailed = 0;

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
    log(`✅ ${message}`, 'green');
    testsPassed++;
}

function error(message) {
    log(`❌ ${message}`, 'red');
    testsFailed++;
}

function info(message) {
    log(`ℹ️  ${message}`, 'yellow');
}

function header(message) {
    log('\n========================================', 'blue');
    log(message, 'blue');
    log('========================================\n', 'blue');
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ========================================
// TESTE 1: Landing Page
// ========================================
async function testLandingPage(browser) {
    header('TESTE 1: LANDING PAGE');
    
    const page = await browser.newPage();
    
    try {
        info('Acessando landing page...');
        await page.goto(FRONTEND_URL, { waitUntil: 'networkidle0' });
        
        const title = await page.title();
        if (title.includes('Kudimu')) {
            success('Landing page carregada');
        } else {
            error('Título da página incorreto');
        }
        
        // Verificar botões
        const loginButton = await page.$('a[href="/login"]');
        const signupButton = await page.$('a[href="/signup"]');
        
        if (loginButton && signupButton) {
            success('Botões de Login e Cadastro presentes');
        } else {
            error('Botões de navegação ausentes');
        }
        
    } catch (err) {
        error(`Erro no teste da landing page: ${err.message}`);
    } finally {
        await page.close();
    }
}

// ========================================
// TESTE 2: Login Respondente
// ========================================
async function testLoginRespondente(browser) {
    header('TESTE 2: LOGIN RESPONDENTE');
    
    const page = await browser.newPage();
    
    try {
        info('Acessando página de login...');
        await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle0' });
        
        info('Preenchendo formulário...');
        await page.type('input[name="email"], input[type="email"]', 'maria@gmail.com');
        await page.type('input[name="senha"], input[name="password"], input[type="password"]', 'usuario123');
        
        info('Clicando em Entrar...');
        await page.click('button[type="submit"]');
        
        await sleep(2000);
        
        const currentUrl = page.url();
        
        if (currentUrl.includes('/campaigns') || currentUrl.includes('/dashboard')) {
            success('Login respondente realizado com sucesso');
            success(`Redirecionado para: ${currentUrl}`);
            return page; // Retornar página logada para próximos testes
        } else {
            error(`Login falhou - URL atual: ${currentUrl}`);
            await page.close();
            return null;
        }
        
    } catch (err) {
        error(`Erro no login respondente: ${err.message}`);
        await page.close();
        return null;
    }
}

// ========================================
// TESTE 3: Visualizar Campanhas
// ========================================
async function testVisualizarCampanhas(page) {
    header('TESTE 3: VISUALIZAR CAMPANHAS');
    
    if (!page) {
        error('Página não disponível (login falhou)');
        return null;
    }
    
    try {
        info('Aguardando carregamento das campanhas...');
        await sleep(2000);
        
        // Verificar se há cards de campanhas
        const campaigns = await page.$$('.campaign-card, [class*="campaign"], [class*="Card"]');
        
        if (campaigns.length > 0) {
            success(`${campaigns.length} campanhas encontradas na página`);
            
            // Clicar na primeira campanha
            info('Clicando na primeira campanha...');
            await campaigns[0].click();
            await sleep(2000);
            
            const currentUrl = page.url();
            if (currentUrl.includes('/questionnaire')) {
                success('Questionário aberto com sucesso');
                return page;
            } else {
                info(`URL após clicar: ${currentUrl}`);
            }
        } else {
            error('Nenhuma campanha encontrada');
        }
        
        return page;
        
    } catch (err) {
        error(`Erro ao visualizar campanhas: ${err.message}`);
        return page;
    }
}

// ========================================
// TESTE 4: Responder Questionário
// ========================================
async function testResponderQuestionario(page) {
    header('TESTE 4: RESPONDER QUESTIONÁRIO');
    
    if (!page) {
        error('Página não disponível');
        return;
    }
    
    try {
        const currentUrl = page.url();
        
        if (!currentUrl.includes('/questionnaire')) {
            info('Não está na página de questionário, pulando...');
            return;
        }
        
        info('Respondendo perguntas...');
        await sleep(1000);
        
        // Tentar clicar em opções de múltipla escolha
        const options = await page.$$('input[type="radio"], button[role="radio"]');
        
        if (options.length > 0) {
            info(`Encontradas ${options.length} opções`);
            await options[0].click();
            await sleep(500);
            success('Primeira pergunta respondida');
        }
        
        // Tentar submeter
        const submitButton = await page.$('button[type="submit"], button:contains("Enviar")');
        
        if (submitButton) {
            info('Tentando submeter respostas...');
            await submitButton.click();
            await sleep(2000);
            
            const finalUrl = page.url();
            if (finalUrl.includes('/confirmation') || finalUrl.includes('/rewards')) {
                success('Respostas submetidas com sucesso!');
            } else {
                info(`URL após submissão: ${finalUrl}`);
            }
        }
        
    } catch (err) {
        error(`Erro ao responder questionário: ${err.message}`);
    }
}

// ========================================
// TESTE 5: Ver Recompensas
// ========================================
async function testVerRecompensas(page) {
    header('TESTE 5: VER RECOMPENSAS');
    
    if (!page) {
        error('Página não disponível');
        return;
    }
    
    try {
        info('Navegando para página de recompensas...');
        await page.goto(`${FRONTEND_URL}/rewards`, { waitUntil: 'networkidle0' });
        await sleep(2000);
        
        // Verificar se a página carregou
        const currentUrl = page.url();
        if (currentUrl.includes('/rewards')) {
            success('Página de recompensas carregada');
            
            // Tentar encontrar o saldo
            const balanceElement = await page.$('[class*="balance"], [class*="saldo"]');
            if (balanceElement) {
                const balance = await page.evaluate(el => el.textContent, balanceElement);
                success(`Saldo exibido: ${balance}`);
            }
        } else {
            error('Não conseguiu acessar página de recompensas');
        }
        
    } catch (err) {
        error(`Erro ao ver recompensas: ${err.message}`);
    } finally {
        await page.close();
    }
}

// ========================================
// TESTE 6: Login Admin
// ========================================
async function testLoginAdmin(browser) {
    header('TESTE 6: LOGIN ADMIN');
    
    const page = await browser.newPage();
    
    try {
        await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle0' });
        
        await page.type('input[name="email"], input[type="email"]', 'admin@kudimu.ao');
        await page.type('input[name="senha"], input[name="password"], input[type="password"]', 'admin123');
        
        await page.click('button[type="submit"]');
        await sleep(2000);
        
        const currentUrl = page.url();
        
        if (currentUrl.includes('/admin')) {
            success('Login admin realizado com sucesso');
            return page;
        } else {
            error(`Login admin falhou - URL: ${currentUrl}`);
            await page.close();
            return null;
        }
        
    } catch (err) {
        error(`Erro no login admin: ${err.message}`);
        await page.close();
        return null;
    }
}

// ========================================
// TESTE 7: Admin - Levantamentos
// ========================================
async function testAdminLevantamentos(page) {
    header('TESTE 7: ADMIN - LEVANTAMENTOS');
    
    if (!page) {
        error('Página admin não disponível');
        return;
    }
    
    try {
        info('Navegando para levantamentos...');
        await page.goto(`${FRONTEND_URL}/admin/withdrawals`, { waitUntil: 'networkidle0' });
        await sleep(2000);
        
        const currentUrl = page.url();
        if (currentUrl.includes('/admin/withdrawals')) {
            success('Página de levantamentos carregada');
            
            // Verificar se há levantamentos
            const withdrawals = await page.$$('tr, [class*="withdrawal"], [class*="row"]');
            info(`Encontrados ${withdrawals.length} elementos na tabela`);
            
        } else {
            error('Não conseguiu acessar levantamentos');
        }
        
    } catch (err) {
        error(`Erro ao acessar levantamentos: ${err.message}`);
    } finally {
        await page.close();
    }
}

// ========================================
// TESTE 8: Login Cliente
// ========================================
async function testLoginCliente(browser) {
    header('TESTE 8: LOGIN CLIENTE');
    
    const page = await browser.newPage();
    
    try {
        await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle0' });
        
        await page.type('input[name="email"], input[type="email"]', 'joao@empresaxyz.ao');
        await page.type('input[name="senha"], input[name="password"], input[type="password"]', 'cliente123');
        
        await page.click('button[type="submit"]');
        await sleep(2000);
        
        const currentUrl = page.url();
        
        if (currentUrl.includes('/client')) {
            success('Login cliente realizado com sucesso');
            return page;
        } else {
            error(`Login cliente falhou - URL: ${currentUrl}`);
            await page.close();
            return null;
        }
        
    } catch (err) {
        error(`Erro no login cliente: ${err.message}`);
        await page.close();
        return null;
    }
}

// ========================================
// TESTE 9: Cliente - Ver Créditos
// ========================================
async function testClienteCreditos(page) {
    header('TESTE 9: CLIENTE - VER CRÉDITOS');
    
    if (!page) {
        error('Página cliente não disponível');
        return;
    }
    
    try {
        info('Navegando para créditos...');
        await page.goto(`${FRONTEND_URL}/client/credits`, { waitUntil: 'networkidle0' });
        await sleep(2000);
        
        const currentUrl = page.url();
        if (currentUrl.includes('/client/credits')) {
            success('Página de créditos carregada');
            
            // Verificar se há planos
            const plans = await page.$$('[class*="plan"], [class*="card"]');
            if (plans.length > 0) {
                success(`${plans.length} planos encontrados`);
            }
        } else {
            error('Não conseguiu acessar créditos');
        }
        
    } catch (err) {
        error(`Erro ao acessar créditos: ${err.message}`);
    } finally {
        await page.close();
    }
}

// ========================================
// MAIN
// ========================================
async function runAllTests() {
    header('KUDIMU INSIGHTS - TESTES E2E FRONTEND');
    
    const browser = await puppeteer.launch({
        headless: true, // Mudar para false para ver o browser
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        // Testes sequenciais
        await testLandingPage(browser);
        
        const respondentPage = await testLoginRespondente(browser);
        await testVisualizarCampanhas(respondentPage);
        await testResponderQuestionario(respondentPage);
        await testVerRecompensas(respondentPage);
        
        const adminPage = await testLoginAdmin(browser);
        await testAdminLevantamentos(adminPage);
        
        const clientPage = await testLoginCliente(browser);
        await testClienteCreditos(clientPage);
        
    } catch (err) {
        error(`Erro geral: ${err.message}`);
    } finally {
        await browser.close();
    }
    
    // Resumo
    header('RESUMO DOS TESTES E2E');
    log(`Total de testes: ${testsPassed + testsFailed}`, 'blue');
    log(`Testes passados: ${testsPassed}`, 'green');
    log(`Testes falhados: ${testsFailed}`, 'red');
    
    const passRate = Math.round((testsPassed / (testsPassed + testsFailed)) * 100);
    log(`Taxa de sucesso: ${passRate}%`, 'yellow');
    
    if (testsFailed === 0) {
        log('\n🎉 TODOS OS TESTES E2E PASSARAM!', 'green');
    } else {
        log('\n⚠️  ALGUNS TESTES FALHARAM', 'red');
    }
}

// Executar
runAllTests().catch(console.error);
