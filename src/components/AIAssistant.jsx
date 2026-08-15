import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router';
import './AIAssistant.css';

const initialPrompts = [
  { id: 1, label: '✍️ Scrivi risposta formale', prompt: 'Aiutami a scrivere una risposta formale ed elegante a questa email:' },
  { id: 2, label: '⚖️ Bozza sollecito di pagamento', prompt: 'Crea una bozza di sollecito di pagamento per una fattura scaduta:' },
  { id: 3, label: '📄 Riassumi documento', prompt: 'Riassumi i punti chiave e le scadenze del seguente testo:' },
  { id: 4, label: '🛡️ Riassumi clausole polizza', prompt: 'Analizza e riassumi le clausole principali, le franchigie e i massimali di questa polizza:' },
  { id: 5, label: '📅 Pianifica evento in agenda', prompt: 'Estrai la data, l\'ora e l\'oggetto da questo testo per creare un evento in agenda:' }
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedTone, setSelectedTone] = useState('formale');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [insertedId, setInsertedId] = useState(null);
  const [toastText, setToastText] = useState(null);

  const location = useLocation();
  const currentPath = location ? location.pathname : window.location.pathname;

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Messaggio di benvenuto iniziale
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Ciao! Sono **Hub Copilot AI**, il tuo assistente personale per la redazione di mail, sintesi di documenti legali/assicurativi e l'organizzazione dell'agenda.\n\nCome posso aiutarti oggi?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Scroll automatico alla fine della chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  // Mostra notifiche Toast temporanee
  const showToast = (text) => {
    setToastText(text);
    setTimeout(() => {
      setToastText(null);
    }, 2500);
  };

  // Ottieni il nome del contesto di pagina
  const getContextName = () => {
    switch (currentPath) {
      case '/assicurazioni':
        return 'Modulo Assicurazioni';
      case '/studio-legale':
        return 'Studio Legale';
      case '/personale':
        return 'Area Personale';
      case '/mail':
        return 'Mail & PEC';
      default:
        return 'Dashboard Generale';
    }
  };

  // Generazione risposte contestuali simulate
  const generateSmartAIResponse = (userText, path, tone) => {
    const textLower = userText.toLowerCase();
    const isFormal = tone === 'formale';
    const isInformal = tone === 'informale';

    // 1. Contesto Assicurazioni o prompt polizza
    if (path === '/assicurazioni' || textLower.includes('polizza') || textLower.includes('assicurazione') || textLower.includes('sinistro')) {
      if (isFormal) {
        return `📋 **Sintesi Analitica Polizza & Franchigie**\n\n- **Oggetto:** Analisi coperture e termini di franchigia.\n- **Clausola Chiave:** Scoperto pari al 10% con minimo non indennizzabile di € 150,00.\n- **Scadenza Comunicazione:** Entro 3 giorni dall'avvenimento del sinistro mediante raccomandata A/R o PEC.\n\n*Bozza di comunicazione per la compagnia:* "Con la presente si notifica formale apertura sinistro in merito alla polizza in oggetto. Si richiede apertura pratica indennizzo."`;
      } else if (isInformal) {
        return `🛡️ **In sintesi (Polizza):**\n• Franchigia standard: 150€\n• Termine notifica: 3 giorni via PEC\n• Documenti necessari: Foto danno, modulo CAI/Denuncia e fatture riparazione.`;
      } else {
        return `🛡️ **Analisi Pratica Assicurativa**\n\nHo esaminato le clausole della polizza di riferimento. La copertura per danni materiali è attiva. Si consiglia di allegare perizia fotografica ed inviare sollecito alla compagnia assicuratrice previa verifica dello scoperto concordato.`;
      }
    }

    // 2. Contesto Studio Legale o prompt sollecito / legale
    if (path === '/studio-legale' || textLower.includes('sollecito') || textLower.includes('messa in mora') || textLower.includes('fattura') || textLower.includes('rg-')) {
      if (isFormal) {
        return `⚖️ **Bozza Sollecito di Pagamento / Formale Diffida**\n\n**OGGETTO:** Formale messa in mora ex art. 1219 c.c. e sollecito pagamento fattura scaduta.\n\nEgregio/Spettabile Cliente,\ncon la presente vi formalizziamo sollecito per il pagamento della somma di euro da voi dovuta in virtù della prestazione resa.\nQualora il saldo non intervenga entro giorni 7 dalla presente, saremo costretti ad adire le vie legali con aggravio di spese ed interessi di mora.\n\nDistinti saluti.`;
      } else if (isInformal) {
        return `⚖️ **Sollecito rapido:**\n"Gentili Signori, vi ricordiamo il mancato saldo della fattura scaduta. Vi preghiamo di provvedere all'accredito entro 5 giorni. Cordiali saluti."`;
      } else {
        return `⚖️ **Prospetto Pratica Legale**\n\nLa bozza di diffida è pronta per il protocollo. I termini di scadenza e la competenza del Giudice di Pace / Tribunale sono conformi al fascicolo di riferimento. Puoi copiare la bozza ed inviarla direttamente via PEC.`;
      }
    }

    // 3. Contesto Mail & PEC o Scrivi risposta
    if (path === '/mail' || textLower.includes('risposta') || textLower.includes('email') || textLower.includes('mail') || textLower.includes('grazie')) {
      if (isFormal) {
        return `✉️ **Bozza di Risposta Formale Email**\n\nGentile Dottore / Spettabile Società,\n\nIn riscontro alla Sua cortese comunicazione, desidero confermare il recepimento della documentazione trasmessa.\nResto a disposizione per eventuali approfondimenti e colgo l'occasione per porgere i miei più cordiali saluti.\n\n[Firma Digitale / Nome]`;
      } else if (isInformal) {
        return `✉️ **Risposta rapida:**\n"Ciao! Ricevuto tutto, grazie mille. Ti aggiorni a breve sul prosieguo della pratica. Un saluto!"`;
      } else {
        return `✉️ **Risposta Professionale Standard**\n\nGentile Interlocutore,\nGrazie per il messaggio. Abbiamo preso in carico la Sua richiesta ed i nostri uffici provvederanno all'evasione nel più breve tempo possibile.\n\nCordiali saluti.`;
      }
    }

    // 4. Contesto Personale o Agenda
    if (path === '/personale' || textLower.includes('agenda') || textLower.includes('evento') || textLower.includes('promemoria') || textLower.includes('riunione')) {
      return `📅 **Scheda Impegno Registrata per Agenda**\n\n- **Evento:** Riunione di coordinamento / Incontro\n- **Data proposta:** Prossimo lunedì ore 10:00\n- **Note:** Allegare documenti relativi al fascicolo e promemoria notifiche.\n\n*Impegno inseribile automaticamente nella scheda Scadenzario!*`;
    }

    // 5. Risposta generica contestuale basata sul tono
    if (isFormal) {
      return `🤖 **Analisi ed Elaborazione Copilot (Tono Formale/Legale)**\n\nIn riferimento alla Sua richiesta: "${userText}"\n\nAbbiamo elaborato la sintesi ed predisposto le azioni correttive necessarie per la gestione del fascicolo. I dati sono stati verificati secondo le linee guida attive.`;
    } else if (isInformal) {
      return `🤖 **Sintesi Copilot:**\nHo elaborato la tua richiesta ("${userText}"). Tutti i punti chiave sono pronti per l'uso immediato!`;
    } else {
      return `🤖 **Risposta Hub Copilot AI**\n\nHo analizzato il tuo prompt: "${userText}".\n\nEcco il testo suggerito ottimizzato per l'integrazione nel tuo flusso di lavoro. Puoi copiarlo o inserirlo direttamente nella tua mail/bozza.`;
    }
  };

  // Invio messaggio utente
  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputPrompt;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    // Simulazione risposta IA
    setTimeout(() => {
      const aiReplyText = generateSmartAIResponse(text, currentPath, selectedTone);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  // Gestore click scorciatoie rapide
  const handleQuickPromptClick = (item) => {
    // Popola l'input e inserisce il prompt desiderato
    setInputPrompt(item.prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Copia testo negli appunti
  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      showToast('📋 Testo copiato negli appunti!');
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Inserisci nella mail / bozza
  const handleInsertDraft = (id, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setInsertedId(id);
      showToast('✉️ Inserito nella bozza! (Copiato per la mail)');
      setTimeout(() => setInsertedId(null), 2000);
    });
  };

  // Gestione invio con Enter (Shift + Enter va a capo)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* 1. Pulsante Fluttuante Attivatore (Floating Button) */}
      <button
        className="copilot-floating-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Apri Hub Copilot AI"
        aria-label="Apri Hub Copilot AI"
      >
        <i className={`bi ${isOpen ? 'bi-x-lg fs-5' : 'bi-sparkles fs-5'}`}></i>
        <span className="fw-bold fs-6">Hub Copilot</span>
        <span className="badge bg-light text-dark rounded-pill px-2 py-1 small border ms-1 d-none d-sm-inline-block">
          AI
        </span>
      </button>

      {/* 2. Pannello Off-canvas / Card overlay dell'Assistente IA */}
      {isOpen && (
        <div className="copilot-overlay-card">
          {/* Toast Notifica */}
          {toastText && <div className="copilot-toast">{toastText}</div>}

          {/* Header dell'Assistente */}
          <div className="copilot-header">
            <div className="d-flex align-items-center gap-2">
              <div className="copilot-avatar-icon">
                <i className="bi bi-robot fs-5"></i>
              </div>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h6 className="mb-0 fw-bold text-white fs-6">Hub Copilot AI</h6>
                  <span className="badge bg-success bg-opacity-20 text-success border border-success-subtle rounded-pill px-2 py-0 small d-flex align-items-center gap-1">
                    <i className="bi bi-circle-fill" style={{ fontSize: '6px' }}></i> Pronto
                  </span>
                </div>
                <small className="text-secondary opacity-75 d-block" style={{ fontSize: '0.73rem' }}>
                  Contesto: <span className="text-info-subtle fw-semibold">{getContextName()}</span>
                </small>
              </div>
            </div>

            <button
              className="copilot-close-btn"
              onClick={() => setIsOpen(false)}
              title="Chiudi Copilot"
              aria-label="Chiudi assistente"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* 3. Scorciatoie Rapide (Prompt Suggeriti / Quick Actions) */}
          <div className="copilot-quick-actions-bar">
            {initialPrompts.map((item) => (
              <button
                key={item.id}
                className="copilot-quick-btn"
                onClick={() => handleQuickPromptClick(item)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* 4. Area Chat / Conversazione */}
          <div className="copilot-messages-container">
            {messages.map((msg) => (
              <div key={msg.id} className={`copilot-msg-wrapper ${msg.sender}`}>
                <div className="copilot-bubble">
                  {msg.text}
                </div>

                {/* Pulsanti di azione per le risposte dell'IA */}
                {msg.sender === 'ai' && (
                  <div className="copilot-msg-actions">
                    <button
                      className={`copilot-action-btn ${copiedId === msg.id ? 'active' : ''}`}
                      onClick={() => handleCopyText(msg.id, msg.text)}
                      title="Copia negli appunti"
                    >
                      <i className={`bi ${copiedId === msg.id ? 'bi-clipboard-check' : 'bi-clipboard'}`}></i>
                      {copiedId === msg.id ? 'Copiato!' : 'Copia Testo'}
                    </button>

                    <button
                      className={`copilot-action-btn ${insertedId === msg.id ? 'active' : ''}`}
                      onClick={() => handleInsertDraft(msg.id, msg.text)}
                      title="Inserisci nella Mail o Bozza"
                    >
                      <i className={`bi ${insertedId === msg.id ? 'bi-check-lg' : 'bi-envelope-at'}`}></i>
                      {insertedId === msg.id ? 'Inserito!' : 'Inserisci nella Mail/Bozza'}
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Indicatore di caricamento/risposta in corso */}
            {isTyping && (
              <div className="copilot-msg-wrapper ai">
                <div className="copilot-typing">
                  <i className="bi bi-magic me-1 text-purple-subtle"></i>
                  <span className="small me-2 text-purple-subtle" style={{ fontSize: '0.78rem' }}>Elaborazione in corso</span>
                  <div className="copilot-dot"></div>
                  <div className="copilot-dot"></div>
                  <div className="copilot-dot"></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 5. Input Area */}
          <div className="copilot-footer">
            {/* Controlli Tono */}
            <div className="copilot-controls-row">
              <div className="d-flex align-items-center gap-1">
                <i className="bi bi-sliders text-secondary" style={{ fontSize: '0.8rem' }}></i>
                <label className="text-secondary mb-0 fw-semibold" style={{ fontSize: '0.75rem' }}>
                  Tono:
                </label>
              </div>

              <select
                className="copilot-tone-select"
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
              >
                <option value="formale">Formale / Legale</option>
                <option value="professionale">Professionale</option>
                <option value="informale">Informale / Sintetico</option>
              </select>
            </div>

            {/* Input Multiline & Bottone d'invio */}
            <div className="copilot-input-group">
              <textarea
                ref={textareaRef}
                className="copilot-textarea"
                rows={2}
                placeholder="Scrivi un messaggio o incolla il testo..."
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="copilot-send-btn"
                onClick={() => handleSendMessage()}
                disabled={!inputPrompt.trim() || isTyping}
                title="Invia messaggio"
                aria-label="Invia messaggio"
              >
                <i className="bi bi-send-fill"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
