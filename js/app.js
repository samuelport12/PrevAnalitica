/* ==========================================
   PrevAnalitica AI - Aplicação Principal
   O "cérebro" que conecta tudo
   ========================================== */

import { N8N_WEBHOOK_URL } from './config.js';
import { initFirebase, isActive, saveToFirestore, setupRealtimeHistory } from './firebase.js';
import { loadTemplate } from './templates.js';

// ==========================================
// ELEMENTOS DOM
// ==========================================
const form = document.getElementById('prevForm');
const btn = document.getElementById('btnGerar');
const output = document.getElementById('resultadoOutput');
const emptyState = document.getElementById('emptyState');
const loadingState = document.getElementById('loadingState');
const toast = document.getElementById('toast');
const historyListEl = document.getElementById('historyList');
const tokenCount = document.getElementById('tokenCount');

// ==========================================
// FUNÇÕES UTILITÁRIAS DE UI
// ==========================================

/**
 * Exibe/oculta estado de carregamento
 */
function setLoading(isLoading) {
    if (isLoading) {
        btn.disabled = true;
        btn.innerHTML = '<i class="ph ph-spinner animate-spin text-lg"></i> Processando...';
        btn.classList.add('opacity-75', 'cursor-not-allowed');
        loadingState.classList.remove('hidden');
    } else {
        btn.disabled = false;
        btn.innerHTML = '<span class="absolute left-0 inset-y-0 flex items-center pl-3"><i class="ph-bold ph-sparkle text-primary-300 group-hover:text-white transition-colors"></i></span> Gerar Análise Jurídica';
        btn.classList.remove('opacity-75', 'cursor-not-allowed');
        loadingState.classList.add('hidden');
    }
}

/**
 * Mostra toast de notificação
 */
function mostrarToast(msg) {
    const toastP = toast.querySelector('p');
    toastP.innerText = msg;
    toast.classList.remove('translate-y-32', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-32', 'opacity-0');
    }, 3000);
}

/**
 * Exibe o resultado na área de output
 */
function exibirResultado(texto) {
    output.value = texto;
    emptyState.classList.add('hidden');
    tokenCount.innerText = `${texto.length} CHARS`;
}

/**
 * Copia texto para área de transferência
 */
function copiarTexto() {
    if (!output.value) return;
    output.select();
    document.execCommand('copy');
    if (navigator.clipboard) navigator.clipboard.writeText(output.value);
    mostrarToast("Texto copiado!");
}

// ==========================================
// GERENCIAMENTO DE HISTÓRICO
// ==========================================

/**
 * Renderiza a lista de histórico
 */
function renderizarHistorico(items) {
    historyListEl.innerHTML = '';

    if (items.length === 0) {
        historyListEl.innerHTML = '<p class="text-center text-gray-500 py-8">Nenhum histórico encontrado.</p>';
        return;
    }

    items.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'p-3 rounded bg-background border border-border hover:border-primary-500/50 cursor-pointer transition-colors group';

        div.onclick = () => {
            exibirResultado(item.text);
            document.getElementById('historyModal').classList.add('hidden');
        };

        div.innerHTML = `
            <div class="flex justify-between items-start mb-1">
                <span class="font-semibold text-sm text-gray-200 group-hover:text-primary-400">${item.client || 'Sem nome'}</span>
                <span class="text-[10px] text-gray-500">${item.dateDisplay || ''}</span>
            </div>
            <div class="text-xs text-gray-400 truncate">${item.type}</div>
        `;
        historyListEl.appendChild(div);
    });
}

// ==========================================
// SUBMISSÃO DO FORMULÁRIO
// ==========================================

async function handleSubmit(e) {
    e.preventDefault();

    if (!N8N_WEBHOOK_URL) {
        alert("ERRO: Configure a URL do n8n no arquivo js/config.js");
        return;
    }

    setLoading(true);
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        // 1. Envia para n8n
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

        const result = await response.json();
        const finalText = result.text || result.output || JSON.stringify(result, null, 2);

        // 2. Exibe Resultado
        exibirResultado(finalText);

        // 3. Salva no Firebase (Se ativo)
        if (isActive()) {
            await saveToFirestore(data, finalText);
        }

        mostrarToast("Análise gerada com sucesso!");

    } catch (error) {
        console.error(error);
        output.value = `Erro: ${error.message}`;
    } finally {
        setLoading(false);
    }
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================

function init() {
    // Event Listeners
    form.addEventListener('submit', handleSubmit);

    // Expor funções globais para onclick no HTML
    window.copiarTexto = copiarTexto;
    window.loadTemplate = loadTemplate;

    // Inicializa Firebase
    initFirebase((user) => {
        setupRealtimeHistory(renderizarHistorico);
    });
}

// Inicia a aplicação
init();
