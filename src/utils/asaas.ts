import axios from 'axios';

const API_KEY = process.env.ASAAS_API_KEY;
const BASE_URL = 'https://www.asaas.com/api/v3';

if (!API_KEY) {
  throw new Error('Asaas API Key não encontrada. Verifique seu .env.local');
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'access_token': API_KEY,
  },
});

/**
 * 🔍 Buscar cliente no Asaas pelo CPF
 */
export const buscarCliente = async (cpf: string) => {
  try {
    const response = await api.get('/customers', {
      params: { cpfCnpj: cpf },
    });

    if (response.data?.data?.length > 0) {
      return response.data.data[0]; // Cliente encontrado
    }

    return null;
  } catch (error: any) {
    console.error('Erro ao buscar cliente no Asaas:', error.response?.data || error.message);
    throw new Error('Erro ao buscar cliente no Asaas.');
  }
};

/**
 * 🧾 Criar cliente no Asaas
 */
export const criarCliente = async ({
  nome,
  cpfCnpj,
  email,
  celular,
}: {
  nome: string;
  cpfCnpj: string;
  email: string;
  celular: string;
}) => {
  try {
    const response = await api.post('/customers', {
      name: nome,
      cpfCnpj,
      email,
      phone: celular,
    });

    return response.data;
  } catch (error: any) {
    console.error('Erro ao criar cliente no Asaas:', error.response?.data || error.message);
    throw new Error('Erro ao criar cliente no Asaas.');
  }
};

/**
 * 💰 Criar cobrança no Asaas
 */
export const criarCobranca = async ({
  customer,
  descricao,
  valor,
  vencimento,
}: {
  customer: string;
  descricao: string;
  valor: number;
  vencimento: string;
}) => {
  try {
    const response = await api.post('/payments', {
      customer,
      billingType: 'PIX',
      value: valor,
      dueDate: vencimento,
      description: descricao,
    });

    return response.data;
  } catch (error: any) {
    console.error('Erro ao criar cobrança no Asaas:', error.response?.data || error.message);
    throw new Error('Erro ao criar cobrança no Asaas.');
  }
};

/**
 * 🔍 Verificar status de pagamento
 */
export const verificarPagamento = async (paymentId: string) => {
  try {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao verificar pagamento:', error.response?.data || error.message);
    throw new Error('Erro ao verificar pagamento no Asaas.');
  }
};