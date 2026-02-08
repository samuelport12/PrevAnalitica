/* ==========================================
   PrevAnalitica AI - Configurações
   ==========================================
   
   OPÇÃO 1 (Recomendado - com Vite):
   - Crie um arquivo .env.local na raiz do projeto
   - Preencha as variáveis conforme .env.example
   - As variáveis serão lidas automaticamente
   
   OPÇÃO 2 (Sem build tool):
   - Preencha os valores diretamente abaixo
   - ⚠️ NÃO faça commit deste arquivo com credenciais reais!
   
   ========================================== */

// Função auxiliar para ler variáveis de ambiente (compatível com Vite)
const getEnv = (key, fallback) => {
    // Tenta ler do import.meta.env (Vite)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        return import.meta.env[key] || fallback;
    }
    return fallback;
};

// Link do seu Webhook do n8n (Production URL)
export const N8N_WEBHOOK_URL = getEnv(
    'VITE_N8N_WEBHOOK_URL',
    'https://n8n.meuzapweb.com.br/webhook/27d9d8bb-7411-423b-ae90-5119d3cc09bb'
);

// Configuração do Firebase (Pegue no Console do Firebase > Project Settings)
export const firebaseConfig = {
    apiKey: getEnv('VITE_FIREBASE_API_KEY', 'SUA_API_KEY_AQUI'),
    authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN', 'SEU_PROJETO.firebaseapp.com'),
    projectId: getEnv('VITE_FIREBASE_PROJECT_ID', 'SEU_PROJECT_ID'),
    storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET', 'SEU_PROJETO.appspot.com'),
    messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', 'SEU_SENDER_ID'),
    appId: getEnv('VITE_FIREBASE_APP_ID', 'SEU_APP_ID')
};
