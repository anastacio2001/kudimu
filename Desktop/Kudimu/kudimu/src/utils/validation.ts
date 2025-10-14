/**
 * Validações para Kudimu Insights
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Valida email
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { valid: false, error: 'Email é obrigatório' };
  }
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Email inválido' };
  }
  return { valid: true };
}

/**
 * Valida senha
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { valid: false, error: 'Senha é obrigatória' };
  }
  if (password.length < 6) {
    return { valid: false, error: 'Senha deve ter no mínimo 6 caracteres' };
  }
  return { valid: true };
}

/**
 * Valida telefone (formato angolano)
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone) {
    return { valid: true }; // Telefone é opcional
  }
  const phoneRegex = /^(\+244)?[9][0-9]{8}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return { valid: false, error: 'Telefone inválido (formato: +244 9XX XXX XXX)' };
  }
  return { valid: true };
}

/**
 * Valida nome
 */
export function validateName(name: string): ValidationResult {
  if (!name || name.trim().length < 2) {
    return { valid: false, error: 'Nome deve ter no mínimo 2 caracteres' };
  }
  return { valid: true };
}

/**
 * Valida localização (províncias angolanas)
 */
export function validateLocation(location: string): ValidationResult {
  const provincias = [
    'Luanda', 'Benguela', 'Huíla', 'Huambo', 'Namibe', 'Cabinda',
    'Cuanza Norte', 'Cuanza Sul', 'Cunene', 'Cuando Cubango',
    'Bié', 'Moxico', 'Lunda Norte', 'Lunda Sul', 'Malanje',
    'Uíge', 'Zaire', 'Bengo'
  ];
  
  if (!location) {
    return { valid: true }; // Localização é opcional
  }
  
  return { valid: true }; // Aceita qualquer valor por enquanto
}

/**
 * Valida reputação
 */
export function validateReputation(reputation: number): boolean {
  return reputation >= 0 && reputation <= 1000;
}

/**
 * Valida status de campanha
 */
export function validateCampaignStatus(status: string): boolean {
  const validStatus = ['pendente', 'ativa', 'encerrada', 'em_validacao'];
  return validStatus.includes(status);
}

/**
 * Valida tipo de pergunta
 */
export function validateQuestionType(type: string): boolean {
  const validTypes = ['multipla_escolha', 'texto_livre', 'escala', 'sim_nao', 'geo'];
  return validTypes.includes(type);
}

/**
 * Sanitiza input de texto
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  return text.trim().replace(/<script>/gi, '').replace(/<\/script>/gi, '');
}

/**
 * Valida JSON
 */
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}
