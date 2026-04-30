// src/lib/copy.ts
// Sistema de cópias curtas e consistentes em PT-BR

// Cópias do Hero conforme especificação
export const HERO_COPY = {
  title: "Check-up digestivo grátis em 2 minutos",
  subtitle: "Relatório personalizado + PDF. Se precisar, fale com um médico em minutos.",
  cta: "Começar agora"
};

// CTAs padronizados conforme especificação
export const CTA_COPY = {
  pass_49: "Liberar todas as triagens – R$ 49 (30 dias)",
  gift_89: "Presentear – R$ 89 (30 dias)",
  products_alloe: "Ver produtos Alloe",
  consult_zapvida: "Falar com médico agora"
};

// Avisos legais
export const LEGAL_COPY = {
  disclaimer: "Conteúdo educativo. Não substitui consulta médica. Procure atendimento nos sinais de alerta.",
  footer: "AlloeHealth é oferecido gratuitamente pela AlloeZil e pela ZapVida."
};

// Mensagens de feedback
export const FEEDBACK_COPY = {
  autosave_success: "Salvo automaticamente",
  autosave_error: "Erro ao salvar. Tente novamente.",
  loading: "Carregando...",
  processing: "Processando...",
  success: "Sucesso!",
  error: "Erro. Tente novamente.",
  required_field: "Campo obrigatório",
  invalid_email: "Email inválido",
  invalid_phone: "Telefone inválido"
};

// Mensagens de triagem
export const TRIAGE_COPY = {
  progress: "Etapa {current}/{total} · {percentage}%",
  continue: "Continuar",
  back: "Voltar",
  finish: "Finalizar",
  saving: "Salvando respostas...",
  completed: "Triagem concluída!"
};

// Mensagens de relatório
export const REPORT_COPY = {
  generating: "Gerando seu relatório personalizado...",
  ready: "Seu relatório está pronto!",
  download_pdf: "Baixar PDF",
  share: "Compartilhar",
  next_steps: "Próximos Passos"
};

// Mensagens de pagamento
export const PAYMENT_COPY = {
  checkout: "Finalizar Pagamento",
  processing: "Processando pagamento...",
  success: "Pagamento realizado com sucesso!",
  error: "Erro no pagamento. Tente novamente.",
  cancelled: "Pagamento cancelado",
  pix: "Pagar com Pix",
  card: "Pagar com Cartão"
};

// Mensagens de presente
export const GIFT_COPY = {
  title: "Presentear com AlloeHealth",
  subtitle: "Um presente que cuida da saúde de quem você ama",
  recipient_name: "Nome do Presenteado",
  recipient_phone: "WhatsApp",
  message: "Mensagem Personalizada",
  send_gift: "Enviar Presente",
  gift_sent: "Presente enviado com sucesso!",
  gift_received: "Você recebeu um presente especial!"
};

// Mensagens de resgate
export const REDEEM_COPY = {
  title: "Resgatar Presente",
  subtitle: "Digite o código do presente que você recebeu",
  code_placeholder: "Digite o código (ex: ABC12345)",
  redeem_button: "Resgatar Presente",
  success: "Presente resgatado com sucesso!",
  error: "Código inválido ou expirado",
  expired: "Este presente expirou"
};

// Mensagens de erro
export const ERROR_COPY = {
  not_found: "Página não encontrada",
  server_error: "Erro interno do servidor",
  network_error: "Erro de conexão",
  timeout: "Tempo esgotado",
  unauthorized: "Acesso não autorizado",
  forbidden: "Acesso negado",
  rate_limit: "Muitas tentativas. Tente novamente em alguns minutos."
};

// Mensagens de sucesso
export const SUCCESS_COPY = {
  data_saved: "Dados salvos com sucesso",
  email_sent: "Email enviado com sucesso",
  password_reset: "Senha redefinida com sucesso",
  account_created: "Conta criada com sucesso",
  subscription_active: "Assinatura ativada com sucesso",
  gift_redeemed: "Presente resgatado com sucesso"
};

// Mensagens de validação
export const VALIDATION_COPY = {
  required: "Este campo é obrigatório",
  min_length: "Mínimo de {min} caracteres",
  max_length: "Máximo de {max} caracteres",
  email_format: "Digite um email válido",
  phone_format: "Digite um telefone válido",
  cpf_format: "Digite um CPF válido",
  age_range: "Idade deve estar entre {min} e {max} anos",
  weight_range: "Peso deve estar entre {min} e {max} kg",
  height_range: "Altura deve estar entre {min} e {max} cm"
};

// Mensagens de acessibilidade
export const ACCESSIBILITY_COPY = {
  skip_to_content: "Pular para o conteúdo principal",
  menu_toggle: "Abrir/fechar menu",
  close_modal: "Fechar modal",
  next_slide: "Próximo slide",
  previous_slide: "Slide anterior",
  play_video: "Reproduzir vídeo",
  pause_video: "Pausar vídeo",
  volume_up: "Aumentar volume",
  volume_down: "Diminuir volume",
  mute: "Silenciar"
};

// Mensagens de carregamento
export const LOADING_COPY = {
  page_loading: "Carregando página...",
  data_loading: "Carregando dados...",
  form_submitting: "Enviando formulário...",
  file_uploading: "Enviando arquivo...",
  report_generating: "Gerando relatório...",
  pdf_generating: "Gerando PDF...",
  payment_processing: "Processando pagamento..."
};

// Função para formatar cópias com variáveis
export function formatCopy(template: string, variables: Record<string, any>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key] || match;
  });
}

// Função para obter cópia por contexto
export function getCopyByContext(context: string, key: string): string {
  const contexts = {
    hero: HERO_COPY,
    cta: CTA_COPY,
    legal: LEGAL_COPY,
    feedback: FEEDBACK_COPY,
    triage: TRIAGE_COPY,
    report: REPORT_COPY,
    payment: PAYMENT_COPY,
    gift: GIFT_COPY,
    redeem: REDEEM_COPY,
    error: ERROR_COPY,
    success: SUCCESS_COPY,
    validation: VALIDATION_COPY,
    accessibility: ACCESSIBILITY_COPY,
    loading: LOADING_COPY
  };
  
  const contextObj = contexts[context as keyof typeof contexts];
  if (!contextObj) return key;
  
  return contextObj[key as keyof typeof contextObj] || key;
}

// Função para obter cópia de erro específica
export function getErrorCopy(errorType: string): string {
  return ERROR_COPY[errorType as keyof typeof ERROR_COPY] || ERROR_COPY.server_error;
}

// Função para obter cópia de validação específica
export function getValidationCopy(validationType: string, variables?: Record<string, any>): string {
  const template = VALIDATION_COPY[validationType as keyof typeof VALIDATION_COPY];
  if (!template) return VALIDATION_COPY.required;
  
  return variables ? formatCopy(template, variables) : template;
}

// Função para obter cópia de feedback específica
export function getFeedbackCopy(feedbackType: string): string {
  return FEEDBACK_COPY[feedbackType as keyof typeof FEEDBACK_COPY] || FEEDBACK_COPY.error;
}

// Função para obter cópia de loading específica
export function getLoadingCopy(loadingType: string): string {
  return LOADING_COPY[loadingType as keyof typeof LOADING_COPY] || LOADING_COPY.page_loading;
}
