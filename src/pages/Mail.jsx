import React, { useState, useMemo } from 'react';

const initialAccountConfig = {
  personale: { attivo: true, email: 'tua.email@personale.it', imapHost: 'imap.gmail.com', imapPort: 993, smtpHost: 'smtp.gmail.com', smtpPort: 465, ssl: true },
  pecStudio: { attivo: false, email: 'studio.legale@pec.it', imapHost: '', imapPort: 993, smtpHost: '', smtpPort: 465, ssl: true },
  assicurazioni: { attivo: false, email: 'info@assicurazioni.it', imapHost: '', imapPort: 993, smtpHost: '', smtpPort: 465, ssl: true }
};

const initialMessages = [
  {
    id: 1,
    account: 'personale',
    mittente: 'Mario Rossi',
    emailMittente: 'mario.rossi@gmail.com',
    destinatario: 'tua.email@personale.it',
    oggetto: 'Conferma appuntamento per progetto Hub',
    estratto: 'Ciao, ti confermo la disponibilità per la riunione di giovedì alle 15:30...',
    corpo: 'Ciao,\n\nti confermo la disponibilità per la riunione di giovedì alle 15:30. Ho preparato i materiali per la revisione della scrivania digitale.\n\nFammi sapere se ti va bene!\n\nUn cordiale saluto,\nMario Rossi',
    data: '10:45',
    cartella: 'inbox',
    letto: false,
    pec: false,
    allegati: []
  },
  {
    id: 2,
    account: 'pecStudio',
    mittente: 'Ministero della Giustizia - Notifiche PEC',
    emailMittente: 'notifiche@pce.giustizia.it',
    destinatario: 'studio.legale@pec.it',
    oggetto: 'NOTIFICA DEPOSITO ATTO - RG 1042/2025',
    estratto: 'Si attesta l avvenuta consegna dell atto processuale relativo al procedimento in oggetto...',
    corpo: 'RICEVUTA DI AVVENUTA CONSEGNA\n\nIl giorno 12/08/2026 alle ore 18:22:10 il messaggio "DEPOSITO_MEMORIA_RG1042.eml" proveniente da "studio.legale@pec.it" e indirizzato a "cancelleria.civile.milano@pec.giustizia.it" è stato consegnato.\n\nIdentificativo messaggio: opec28391.20260812.182210@pec.giustizia.it',
    data: 'Ieri',
    cartella: 'pec',
    letto: true,
    pec: true,
    allegati: ['Ricevuta_Consegna.xml', 'Atto_Firmato.pdf.p7m']
  },
  {
    id: 3,
    account: 'personale',
    mittente: 'Assistenza Generali Assicurazioni',
    emailMittente: 'serviziodocumenti@generali.it',
    destinatario: 'tua.email@personale.it',
    oggetto: 'Documento di Scadenza Polizza Casa N° POL-102938',
    estratto: 'Gentile Cliente, le inviamo in allegato il promemoria relativo al rinnovo della sua polizza casa...',
    corpo: 'Gentile Cliente,\n\nLe ricordiamo che la sua polizza Casa N° POL-102938 scadrà il prossimo 25/08/2026.\nIn allegato trova il prospetto del premio annuo aggiornato (€ 320,00).\n\nCordiali saluti,\nGenerali Assicurazioni',
    data: '11 Ago',
    cartella: 'inbox',
    letto: true,
    pec: false,
    allegati: ['Prospetto_Polizza_Casa_2026.pdf']
  }
];

export default function Mail() {
  const [accountConfig, setAccountConfig] = useState(initialAccountConfig);
  const [messages, setMessages] = useState(initialMessages);
  const [selectedAccountFilter, setSelectedAccountFilter] = useState('tutti');
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [filterType, setFilterType] = useState('tutti');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState(1);

  // Modali
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Form Composizione
  const [composeForm, setComposeForm] = useState({
    accountSender: 'personale',
    destinatario: '',
    oggetto: '',
    corpo: '',
    isPec: false
  });

  // Form Configurazione IMAP
  const [configForm, setConfigForm] = useState({
    accountKey: 'personale',
    email: accountConfig.personale.email,
    imapHost: accountConfig.personale.imapHost,
    imapPort: accountConfig.personale.imapPort,
    smtpHost: accountConfig.personale.smtpHost,
    smtpPort: accountConfig.personale.smtpPort,
    ssl: accountConfig.personale.ssl
  });

  // Messaggi filtrati per cartella, account, tab e ricerca
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      // Filtro Account
      if (selectedAccountFilter !== 'tutti' && msg.account !== selectedAccountFilter) return false;

      // Filtro Cartella
      if (activeFolder === 'pec' && !msg.pec) return false;
      if (activeFolder !== 'pec' && msg.cartella !== activeFolder) return false;

      // Tab Filtro
      if (filterType === 'nonLetti' && msg.letto) return false;
      if (filterType === 'pec' && !msg.pec) return false;
      if (filterType === 'allegati' && (!msg.allegati || msg.allegati.length === 0)) return false;

      // Ricerca
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchMittente = msg.mittente.toLowerCase().includes(query);
        const matchOggetto = msg.oggetto.toLowerCase().includes(query);
        const matchCorpo = msg.estratto.toLowerCase().includes(query);
        if (!matchMittente && !matchOggetto && !matchCorpo) return false;
      }

      return true;
    });
  }, [messages, selectedAccountFilter, activeFolder, filterType, searchTerm]);

  // Messaggio attualmente selezionato per l'anteprima
  const selectedMessage = useMemo(() => {
    return messages.find((m) => m.id === selectedMessageId) || filteredMessages[0] || null;
  }, [messages, selectedMessageId, filteredMessages]);

  // Calcolo non letti per cartella
  const unreadInboxCount = useMemo(() => {
    return messages.filter((m) => m.cartella === 'inbox' && !m.letto).length;
  }, [messages]);

  const unreadPecCount = useMemo(() => {
    return messages.filter((m) => m.pec && !m.letto).length;
  }, [messages]);

  // Seleziona un messaggio e segnalo come letto
  const handleSelectMessage = (msg) => {
    setSelectedMessageId(msg.id);
    if (!msg.letto) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, letto: true } : m))
      );
    }
  };

  const handleToggleReadStatus = (id) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, letto: !m.letto } : m))
    );
  };

  const handleDeleteMessage = (id) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, cartella: 'trash' } : m))
    );
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!composeForm.destinatario || !composeForm.oggetto) return;

    const newMsg = {
      id: Date.now(),
      account: composeForm.accountSender,
      mittente: accountConfig[composeForm.accountSender]?.email || 'Tu',
      emailMittente: accountConfig[composeForm.accountSender]?.email || 'tu@domain.it',
      destinatario: composeForm.destinatario,
      oggetto: composeForm.oggetto,
      estratto: composeForm.corpo.slice(0, 80) + '...',
      corpo: composeForm.corpo,
      data: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cartella: 'sent',
      letto: true,
      pec: composeForm.isPec,
      allegati: []
    };

    setMessages((prev) => [newMsg, ...prev]);
    setComposeForm({ accountSender: 'personale', destinatario: '', oggetto: '', corpo: '', isPec: false });
    setShowComposeModal(false);
    alert('Messaggio inviato con successo!');
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setAccountConfig((prev) => ({
      ...prev,
      [configForm.accountKey]: {
        ...prev[configForm.accountKey],
        attivo: true,
        email: configForm.email,
        imapHost: configForm.imapHost,
        imapPort: Number(configForm.imapPort),
        smtpHost: configForm.smtpHost,
        smtpPort: Number(configForm.smtpPort),
        ssl: configForm.ssl
      }
    }));
    setShowConfigModal(false);
    alert(`Configurazione per ${configForm.email} salvata e attivata!`);
  };

  return (
    <div className="container-fluid p-3 p-md-4">
      {/* Header Pagina */}
      <header className="row align-items-center mb-3 pb-2 border-bottom bg-white p-3 rounded-3 shadow-sm">
        <div className="col-md-6">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary bg-opacity-10 p-3 rounded-3 text-primary">
              <i className="bi bi-envelope-paper-heart fs-2"></i>
            </div>
            <div>
              <h1 className="h3 mb-1 fw-bold text-dark">Scrivania Mail & PEC</h1>
              <p className="text-muted mb-0 small">
                Client di posta integrato per caselle personali e PEC professionali
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6 text-md-end mt-2 mt-md-0">
          <button
            className="btn btn-outline-secondary me-2 fw-semibold"
            onClick={() => setShowConfigModal(true)}
          >
            <i className="bi bi-gear me-1"></i> Impostazioni IMAP/SMTP
          </button>
          <button
            className="btn btn-primary fw-semibold"
            onClick={() => setShowComposeModal(true)}
          >
            <i className="bi bi-plus-lg me-1"></i> Scrivi Mail
          </button>
        </div>
      </header>

      {/* Client Mail a 3 Colonne */}
      <div className="row g-3">
        {/* COLONNA 1 (25%): Sidebar Cartelle & Account */}
        <div className="col-12 col-lg-3">
          <div className="card border-0 shadow-sm rounded-3 h-100 bg-white">
            <div className="card-body p-3">
              {/* Selettore Account */}
              <div className="mb-4">
                <label className="form-label text-muted uppercase fw-bold small mb-2">
                  Seleziona Casella Mail
                </label>
                <div className="list-group list-group-flush">
                  <button
                    className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between rounded-2 mb-1 border-0 ${selectedAccountFilter === 'tutti' ? 'bg-primary text-white font-semibold' : ''}`}
                    onClick={() => setSelectedAccountFilter('tutti')}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-layers-fill"></i>
                      <span>Tutte le caselle</span>
                    </div>
                  </button>

                  {/* Account 1: Personale */}
                  <button
                    className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between rounded-2 mb-1 border-0 ${selectedAccountFilter === 'personale' ? 'bg-primary text-white font-semibold' : ''}`}
                    onClick={() => setSelectedAccountFilter('personale')}
                  >
                    <div className="d-flex align-items-center gap-2 text-truncate">
                      <i className="bi bi-person-fill"></i>
                      <span className="text-truncate">Personale</span>
                    </div>
                    <span className={`badge ${accountConfig.personale.attivo ? (selectedAccountFilter === 'personale' ? 'bg-white text-primary' : 'bg-success') : 'bg-secondary'}`}>
                      {accountConfig.personale.attivo ? 'Attivo' : 'Offline'}
                    </span>
                  </button>

                  {/* Account 2: PEC Studio */}
                  <button
                    className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between rounded-2 mb-1 border-0 ${selectedAccountFilter === 'pecStudio' ? 'bg-primary text-white font-semibold' : ''}`}
                    onClick={() => setSelectedAccountFilter('pecStudio')}
                  >
                    <div className="d-flex align-items-center gap-2 text-truncate">
                      <i className="bi bi-shield-check text-warning"></i>
                      <span className="text-truncate">PEC Studio Legale</span>
                    </div>
                    <span className={`badge ${accountConfig.pecStudio.attivo ? 'bg-success' : 'bg-secondary'}`}>
                      {accountConfig.pecStudio.attivo ? 'Attivo' : 'Disconnesso'}
                    </span>
                  </button>

                  {/* Account 3: Assicurazioni */}
                  <button
                    className={`list-group-item list-group-item-action d-flex align-items-center justify-content-between rounded-2 mb-1 border-0 ${selectedAccountFilter === 'assicurazioni' ? 'bg-primary text-white font-semibold' : ''}`}
                    onClick={() => setSelectedAccountFilter('assicurazioni')}
                  >
                    <div className="d-flex align-items-center gap-2 text-truncate">
                      <i className="bi bi-building"></i>
                      <span className="text-truncate">Assicurazioni</span>
                    </div>
                    <span className={`badge ${accountConfig.assicurazioni.attivo ? 'bg-success' : 'bg-secondary'}`}>
                      {accountConfig.assicurazioni.attivo ? 'Attivo' : 'Disconnesso'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Cartelle */}
              <div>
                <label className="form-label text-muted uppercase fw-bold small mb-2">
                  Cartelle
                </label>
                <div className="nav flex-column nav-pills gap-1">
                  <button
                    className={`nav-link text-start d-flex align-items-center justify-content-between ${activeFolder === 'inbox' ? 'active' : 'text-dark'}`}
                    onClick={() => setActiveFolder('inbox')}
                  >
                    <div>
                      <i className="bi bi-inbox-fill me-2"></i> In Arrivo
                    </div>
                    {unreadInboxCount > 0 && (
                      <span className="badge bg-danger rounded-pill">{unreadInboxCount}</span>
                    )}
                  </button>

                  <button
                    className={`nav-link text-start d-flex align-items-center justify-content-between ${activeFolder === 'pec' ? 'active' : 'text-dark'}`}
                    onClick={() => setActiveFolder('pec')}
                  >
                    <div>
                      <i className="bi bi-shield-check me-2 text-success"></i> PEC Ricevute
                    </div>
                    {unreadPecCount > 0 && (
                      <span className="badge bg-success rounded-pill">{unreadPecCount}</span>
                    )}
                  </button>

                  <button
                    className={`nav-link text-start d-flex align-items-center justify-content-between ${activeFolder === 'sent' ? 'active' : 'text-dark'}`}
                    onClick={() => setActiveFolder('sent')}
                  >
                    <div>
                      <i className="bi bi-send-fill me-2"></i> Inviati
                    </div>
                  </button>

                  <button
                    className={`nav-link text-start d-flex align-items-center justify-content-between ${activeFolder === 'drafts' ? 'active' : 'text-dark'}`}
                    onClick={() => setActiveFolder('drafts')}
                  >
                    <div>
                      <i className="bi bi-file-earmark-text me-2"></i> Bozze
                    </div>
                  </button>

                  <button
                    className={`nav-link text-start d-flex align-items-center justify-content-between ${activeFolder === 'trash' ? 'active' : 'text-dark'}`}
                    onClick={() => setActiveFolder('trash')}
                  >
                    <div>
                      <i className="bi bi-trash-fill me-2"></i> Cestino
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLONNA 2 (35%): Lista Messaggi */}
        <div className="col-12 col-md-5 col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 h-100 bg-white d-flex flex-column">
            {/* Ricerca e Filtri */}
            <div className="card-header bg-white p-3 border-bottom">
              <div className="input-group mb-2">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 bg-light"
                  placeholder="Cerca mail o mittente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Tabs di Filtro */}
              <div className="btn-group w-100" role="group">
                <button
                  className={`btn btn-sm ${filterType === 'tutti' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setFilterType('tutti')}
                >
                  Tutti
                </button>
                <button
                  className={`btn btn-sm ${filterType === 'nonLetti' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setFilterType('nonLetti')}
                >
                  Non Letti
                </button>
                <button
                  className={`btn btn-sm ${filterType === 'pec' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setFilterType('pec')}
                >
                  Solo PEC
                </button>
              </div>
            </div>

            {/* Lista Messaggi */}
            <div className="card-body p-2 overflow-auto" style={{ maxHeight: '600px' }}>
              {filteredMessages.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-envelope-open fs-2 d-block mb-2"></i>
                  Nessuna mail trovata in questa cartella.
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {filteredMessages.map((msg) => {
                    const isSelected = selectedMessage && selectedMessage.id === msg.id;

                    return (
                      <button
                        key={msg.id}
                        className={`list-group-item list-group-item-action text-start p-3 rounded-3 mb-2 border transition-all ${isSelected ? 'border-primary bg-primary bg-opacity-10' : 'bg-white'}`}
                        onClick={() => handleSelectMessage(msg)}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <div className="d-flex align-items-center gap-2 text-truncate">
                            {!msg.letto && (
                              <span className="badge bg-primary rounded-circle p-1" title="Non letto"> </span>
                            )}
                            <span className={`fw-bold text-truncate ${!msg.letto ? 'text-dark fs-6' : 'text-secondary'}`}>
                              {msg.mittente}
                            </span>
                          </div>
                          <small className="text-muted font-monospace">{msg.data}</small>
                        </div>

                        <div className={`mb-1 text-truncate ${!msg.letto ? 'fw-bold text-dark' : 'text-dark'}`}>
                          {msg.oggetto}
                        </div>

                        <p className="text-muted small mb-2 text-truncate">{msg.estratto}</p>

                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-1">
                            {msg.pec && (
                              <span className="badge bg-success">
                                <i className="bi bi-shield-check me-1"></i> PEC
                              </span>
                            )}
                            {msg.allegati && msg.allegati.length > 0 && (
                              <span className="badge bg-light text-dark border">
                                <i className="bi bi-paperclip me-1"></i> {msg.allegati.length}
                              </span>
                            )}
                          </div>
                          <span className="badge bg-secondary bg-opacity-10 text-dark small">
                            {msg.account === 'personale' ? 'Personale' : msg.account === 'pecStudio' ? 'PEC Studio' : 'Assicurazioni'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COLONNA 3 (40%): Anteprima Messaggio */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-3 h-100 bg-white">
            {selectedMessage ? (
              <div className="card-body p-4 d-flex flex-column justify-content-between">
                <div>
                  {/* Header Anteprima */}
                  <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-3">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="h5 fw-bold mb-0 text-dark">{selectedMessage.oggetto}</span>
                        {selectedMessage.pec && (
                          <span className="badge bg-success">
                            <i className="bi bi-shield-check me-1"></i> Valore Legale PEC
                          </span>
                        )}
                      </div>
                      <div className="small text-muted mb-1">
                        Da: <strong>{selectedMessage.mittente}</strong> &lt;{selectedMessage.emailMittente}&gt;
                      </div>
                      <div className="small text-muted">
                        A: <span>{selectedMessage.destinatario}</span> &bull; <span className="font-monospace">{selectedMessage.data}</span>
                      </div>
                    </div>

                    {/* Azioni Rapide */}
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleToggleReadStatus(selectedMessage.id)}
                        title={selectedMessage.letto ? 'Segna come non letto' : 'Segna come letto'}
                      >
                        <i className={`bi ${selectedMessage.letto ? 'bi-envelope' : 'bi-envelope-open'}`}></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                        title="Elimina Mail"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>

                  {/* Corpo della Mail */}
                  <div className="bg-light p-3 rounded-3 mb-4 text-dark font-sans style-preserve-line" style={{ whiteSpace: 'pre-line' }}>
                    {selectedMessage.corpo}
                  </div>

                  {/* Box Allegati */}
                  {selectedMessage.allegati && selectedMessage.allegati.length > 0 && (
                    <div className="border-top pt-3">
                      <h4 className="h6 fw-bold text-dark mb-2">
                        <i className="bi bi-paperclip text-primary me-1"></i>
                        Allegati ({selectedMessage.allegati.length})
                      </h4>
                      <div className="d-flex flex-wrap gap-2">
                        {selectedMessage.allegati.map((att, i) => (
                          <div key={i} className="p-2 border rounded bg-white d-flex align-items-center gap-2">
                            <i className="bi bi-file-earmark-arrow-down text-primary fs-5"></i>
                            <span className="small font-monospace">{att}</span>
                            <button
                              className="btn btn-sm btn-light border ms-2"
                              onClick={() => alert(`Download allegato: ${att}`)}
                            >
                              <i className="bi bi-download"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Azioni Risposta */}
                <div className="border-top pt-3 mt-4 d-flex gap-2">
                  <button
                    className="btn btn-primary fw-semibold"
                    onClick={() => {
                      setComposeForm({
                        accountSender: selectedMessage.account,
                        destinatario: selectedMessage.emailMittente,
                        oggetto: `Re: ${selectedMessage.oggetto}`,
                        corpo: `\n\n--- Messaggio Originale ---\nDa: ${selectedMessage.mittente}\n${selectedMessage.corpo}`,
                        isPec: selectedMessage.pec
                      });
                      setShowComposeModal(true);
                    }}
                  >
                    <i className="bi bi-reply me-1"></i> Rispondi
                  </button>
                  <button
                    className="btn btn-outline-secondary fw-semibold"
                    onClick={() => {
                      setComposeForm({
                        accountSender: selectedMessage.account,
                        destinatario: '',
                        oggetto: `Fwd: ${selectedMessage.oggetto}`,
                        corpo: `\n\n--- Messaggio Inoltrato ---\nDa: ${selectedMessage.mittente}\n${selectedMessage.corpo}`,
                        isPec: selectedMessage.pec
                      });
                      setShowComposeModal(true);
                    }}
                  >
                    <i className="bi bi-forward me-1"></i> Inoltra
                  </button>
                </div>
              </div>
            ) : (
              <div className="card-body p-5 text-center text-muted">
                <i className="bi bi-cursor fs-1 d-block mb-3"></i>
                Seleziona un messaggio dalla lista per vederne l'anteprima completa.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modale Scrivi Mail */}
      {showComposeModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-send me-2"></i> Composizione Nuovo Messaggio
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowComposeModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSendEmail}>
                <div className="modal-body p-4">
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Da (Casella di Invio)</label>
                      <select
                        className="form-select"
                        value={composeForm.accountSender}
                        onChange={(e) => setComposeForm((prev) => ({ ...prev, accountSender: e.target.value }))}
                      >
                        <option value="personale">Personale ({accountConfig.personale.email})</option>
                        <option value="pecStudio">PEC Studio ({accountConfig.pecStudio.email})</option>
                        <option value="assicurazioni">Assicurazioni ({accountConfig.assicurazioni.email})</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">A (Destinatario) *</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="destinatario@domain.it"
                        value={composeForm.destinatario}
                        onChange={(e) => setComposeForm((prev) => ({ ...prev, destinatario: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Oggetto *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Oggetto del messaggio"
                      value={composeForm.oggetto}
                      onChange={(e) => setComposeForm((prev) => ({ ...prev, oggetto: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Corpo del Messaggio</label>
                    <textarea
                      className="form-control"
                      rows="6"
                      placeholder="Scrivi qui il testo della mail..."
                      value={composeForm.corpo}
                      onChange={(e) => setComposeForm((prev) => ({ ...prev, corpo: e.target.value }))}
                    ></textarea>
                  </div>

                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="pecCheck"
                      checked={composeForm.isPec}
                      onChange={(e) => setComposeForm((prev) => ({ ...prev, isPec: e.target.checked }))}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="pecCheck">
                      Invia con ricevuta di consegna a Valore Legale (PEC)
                    </label>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowComposeModal(false)}
                  >
                    Annulla
                  </button>
                  <button type="submit" className="btn btn-primary fw-semibold px-4">
                    <i className="bi bi-send me-1"></i> Invia Messaggio
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modale Impostazioni Connessione IMAP/SMTP */}
      {showConfigModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-gear me-2"></i> Configurazione IMAP / SMTP
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowConfigModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSaveConfig}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Seleziona Account da Configurare</label>
                    <select
                      className="form-select"
                      value={configForm.accountKey}
                      onChange={(e) => {
                        const key = e.target.value;
                        const conf = accountConfig[key];
                        setConfigForm({
                          accountKey: key,
                          email: conf.email,
                          imapHost: conf.imapHost,
                          imapPort: conf.imapPort,
                          smtpHost: conf.smtpHost || '',
                          smtpPort: conf.smtpPort || 465,
                          ssl: conf.ssl
                        });
                      }}
                    >
                      <option value="personale">Posta Personale</option>
                      <option value="pecStudio">PEC Studio Legale</option>
                      <option value="assicurazioni">Assicurazioni Info</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Indirizzo Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={configForm.email}
                      onChange={(e) => setConfigForm((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-8">
                      <label className="form-label fw-semibold">Server IMAP Host *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Es. imap.gmail.com o imap.pec.it"
                        value={configForm.imapHost}
                        onChange={(e) => setConfigForm((prev) => ({ ...prev, imapHost: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Porta IMAP</label>
                      <input
                        type="number"
                        className="form-control"
                        value={configForm.imapPort}
                        onChange={(e) => setConfigForm((prev) => ({ ...prev, imapPort: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-8">
                      <label className="form-label fw-semibold">Server SMTP Host</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Es. smtp.gmail.com"
                        value={configForm.smtpHost}
                        onChange={(e) => setConfigForm((prev) => ({ ...prev, smtpHost: e.target.value }))}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Porta SMTP</label>
                      <input
                        type="number"
                        className="form-control"
                        value={configForm.smtpPort}
                        onChange={(e) => setConfigForm((prev) => ({ ...prev, smtpPort: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="form-check form-switch mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="sslCheck"
                      checked={configForm.ssl}
                      onChange={(e) => setConfigForm((prev) => ({ ...prev, ssl: e.target.checked }))}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="sslCheck">
                      Utilizza crittografia SSL / TLS sicura
                    </label>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowConfigModal(false)}
                  >
                    Annulla
                  </button>
                  <button type="submit" className="btn btn-dark fw-semibold">
                    <i className="bi bi-check-lg me-1"></i> Salva e Connetti Casella
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
