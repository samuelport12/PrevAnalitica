/* ==========================================
   PrevAnalitica AI - Modelos de Preenchimento
   ========================================== */

// Templates pré-definidos para preenchimento rápido do formulário
export const templates = {
    'bpc_deficiente': {
        tipo: 'Concessão de BPC Deficiente',
        nome: 'João da Silva',
        idade: 45,
        nb: '123.456.789-0',
        cids: 'G40 (Epilepsia)',
        contexto: 'Mora com mãe idosa. Renda baixa.'
    },
    'bpc_idoso': {
        tipo: 'Restabelecimento de BPC/LOAS',
        nome: 'Maria Oliveira',
        idade: 67,
        nb: '876.543.210-9',
        cids: 'M54 (Dorsalgia)',
        contexto: 'Benefício cessado indevidamente.'
    }
};

/**
 * Carrega um template no formulário
 * @param {string} type - Tipo do template (bpc_deficiente, bpc_idoso, etc.)
 */
export function loadTemplate(type) {
    const t = templates[type];
    if (t) {
        document.getElementById('inputTipo').value = t.tipo;
        document.getElementById('inputNome').value = t.nome;
        document.getElementById('inputIdade').value = t.idade;
        document.getElementById('inputNb').value = t.nb;
        document.getElementById('inputCids').value = t.cids;
        document.getElementById('inputContexto').value = t.contexto;
        document.getElementById('modelsModal').classList.add('hidden');
    }
}
