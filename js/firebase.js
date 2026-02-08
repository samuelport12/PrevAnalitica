/* ==========================================
   PrevAnalitica AI - Lógica do Firebase
   ========================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { firebaseConfig } from './config.js';

// Estado do Firebase
let db = null;
let auth = null;
let user = null;
let isFirebaseActive = false;

/**
 * Inicializa o Firebase e autentica anonimamente
 * @param {Function} onReady - Callback chamado quando o usuário está autenticado
 */
export function initFirebase(onReady) {
    try {
        // Verifica se o usuário preencheu a config
        if (firebaseConfig.apiKey !== "SUA_API_KEY_AQUI") {
            const app = initializeApp(firebaseConfig);
            auth = getAuth(app);
            db = getFirestore(app);

            // Login Anônimo
            signInAnonymously(auth).catch((error) => {
                console.error("Erro no Login Anônimo:", error);
            });

            onAuthStateChanged(auth, (u) => {
                if (u) {
                    user = u;
                    isFirebaseActive = true;
                    console.log("Firebase Conectado. UID:", user.uid);
                    if (onReady) onReady(user);
                }
            });
        } else {
            console.warn("Firebase não configurado. Histórico será desativado ou local.");
            document.getElementById('historyList').innerHTML = '<p class="text-center text-red-400 py-4 text-xs">Configure o Firebase no código para ativar o histórico na nuvem.</p>';
        }
    } catch (e) {
        console.error("Erro ao iniciar Firebase:", e);
    }
}

/**
 * Verifica se o Firebase está ativo
 */
export function isActive() {
    return isFirebaseActive && user !== null;
}

/**
 * Retorna o usuário atual
 */
export function getUser() {
    return user;
}

/**
 * Salva um resultado no Firestore
 * @param {Object} inputData - Dados do formulário
 * @param {string} resultText - Texto da análise gerada
 */
export async function saveToFirestore(inputData, resultText) {
    if (!isActive()) return;

    try {
        const historyRef = collection(db, "users", user.uid, "history");
        await addDoc(historyRef, {
            client: inputData.nome,
            type: inputData.tipo_acao,
            text: resultText,
            createdAt: serverTimestamp(),
            dateDisplay: new Date().toLocaleDateString('pt-BR')
        });
    } catch (e) {
        console.error("Erro ao salvar no Firestore:", e);
    }
}

/**
 * Configura escuta em tempo real do histórico
 * @param {Function} onUpdate - Callback com os itens do histórico
 */
export function setupRealtimeHistory(onUpdate) {
    if (!user || !db) return;

    const q = query(collection(db, "users", user.uid, "history"), orderBy("createdAt", "desc"));

    onSnapshot(q, (snapshot) => {
        const items = [];
        snapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
        });
        if (onUpdate) onUpdate(items);
    });
}
