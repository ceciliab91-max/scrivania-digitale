import React, { useState, useMemo } from 'react';

const initialPratiche = [
  { id: 1, numeroRG: 'RG-1042/2025', cliente: 'Rossi Mario', controparte: 'Bianchi S.r.l.', tribunale: 'Tribunale di Milano', oggetto: 'Risarcimento Danni', stato: 'In corso', prossimaData: '2026-09-20' },
  { id: 2, numeroRG: 'RG-5521/2024', cliente: 'Verdi Elena', controparte: 'Inps', tribunale: 'Corte d\'Appello', oggetto: 'Previdenziale', stato: 'In attesa di sentenza', prossimaData: '2026-10-05' }
];

const initialAgenda = [
  { id: 1, tipo: 'Udienza', data: '2026-09-20', ora: '09:30', fascicolo: 'RG-1042/2025 (Rossi c/ Bianchi)', descrizione: 'Prima comparizione delle parti e discussione istanze istruttorie', priorita: 'Alta' },
  { id: 2, tipo: 'Deposito Atto', data: '2026-09-28', ora: '23:59', fascicolo: 'RG-5521/2024 (Verdi c/ Inps)', descrizione: 'Deposito memoria di replica ex art. 190 c.p.c.', priorita: 'Alta' },
  { id: 3, tipo: 'Incontro Cliente', data: '2026-10-02', ora: '15:00', fascicolo: 'RG-1042/2025 (Rossi Mario)', descrizione: 'Esame bozza perizia tecnica di parte (CTP)', priorita: 'Media' }
];

export default function StudioLegale() {
  const [pratiche, setPratiche] = useState(initialPratiche);
  const [agenda, setAgenda] = useState(initialAgenda);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('pratiche');
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    numeroRG: '',
    cliente: '',
    controparte: '',
    tribunale: 'Tribunale di Milano',
    oggetto: '',
    stato: 'In corso',
    prossimaData: ''
  });

  // Filtro ricerca pratiche
  const filteredPratiche = useMemo(() => {
    return pratiche.filter((p) =>
      p.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.numeroRG.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.controparte.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.oggetto.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pratiche, searchTerm]);

  // Calcolo KPI
  const praticheAttiveCount = useMemo(() => {
    return pratiche.filter((p) => p.stato === 'In corso').length;
  }, [pratiche]);

  const prossimeUdienzeCount = useMemo(() => {
    return agenda.filter((a) => a.tipo === 'Udienza').length;
  }, [agenda]);

  const attiDaDepositareCount = useMemo(() => {
    return agenda.filter((a) => a.tipo === 'Deposito Atto' || a.priorita === 'Alta').length;
  }, [agenda]);

  // Gestione form modale
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFascicolo = (e) => {
    e.preventDefault();
    if (!formData.numeroRG || !formData.cliente || !formData.controparte) return;

    const newPratica = {
      id: Date.now(),
      numeroRG: formData.numeroRG,
      cliente: formData.cliente,
      controparte: formData.controparte,
      tribunale: formData.tribunale,
      oggetto: formData.oggetto || 'Generico',
      stato: formData.stato,
      prossimaData: formData.prossimaData || 'Da definire'
    };

    setPratiche((prev) => [newPratica, ...prev]);

    // Se inserita una prossima data, aggiunge un promemoria in agenda
    if (formData.prossimaData) {
      setAgenda((prev) => [
        {
          id: Date.now() + 1,
          tipo: 'Udienza',
          data: formData.prossimaData,
          ora: '09:00',
          fascicolo: `${formData.numeroRG} (${formData.cliente} c/ ${formData.controparte})`,
          descrizione: `Udienza programmata per ${formData.oggetto}`,
          priorita: 'Alta'
        },
        ...prev
      ]);
    }

    setFormData({
      numeroRG: '',
      cliente: '',
      controparte: '',
      tribunale: 'Tribunale di Milano',
      oggetto: '',
      stato: 'In corso',
      prossimaData: ''
    });
    setShowModal(false);
  };

  const handleDeletePratica = (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo fascicolo?')) {
      setPratiche((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const getStatoBadge = (stato) => {
    switch (stato) {
      case 'In corso':
        return 'bg-primary';
      case 'In attesa di sentenza':
        return 'bg-warning text-dark';
      case 'Archiviato':
        return 'bg-secondary';
      default:
        return 'bg-light text-dark border';
    }
  };

  const getPrioritaBadge = (priorita) => {
    switch (priorita) {
      case 'Alta':
        return 'bg-danger';
      case 'Media':
        return 'bg-warning text-dark';
      case 'Bassa':
        return 'bg-info text-dark';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* Header Scrivania */}
      <header className="row align-items-center mb-4 pb-3 border-bottom bg-white p-3 rounded-3 shadow-sm">
        <div className="col-md-6 mb-3 mb-md-0">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-dark bg-opacity-10 p-3 rounded-3 text-dark">
              <i className="bi bi-balance-scale fs-2"></i>
            </div>
            <div>
              <h1 className="h3 mb-1 fw-bold text-dark">Scrivania Studio Legale</h1>
              <p className="text-muted mb-0 small">
                Fascicoli fisici/digitali, udienze e scadenzario atti
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex flex-wrap flex-sm-nowrap gap-2 justify-content-md-end">
            <div className="input-group" style={{ maxWidth: '300px' }}>
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 bg-light"
                placeholder="Cerca cliente, R.G., controparte..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Cerca fascicolo"
              />
            </div>
            <button
              className="btn btn-dark d-flex align-items-center gap-2 fw-semibold px-3 text-nowrap"
              onClick={() => setShowModal(true)}
            >
              <i className="bi bi-plus-lg"></i> Nuovo Fascicolo
            </button>
          </div>
        </div>
      </header>

      {/* KPI Top Bar */}
      <section className="row g-3 mb-4" aria-label="Indicatori di prestazione studio">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body d-flex align-items-center justify-content-between p-3">
              <div>
                <span className="text-muted text-uppercase fw-semibold small">Pratiche Attive</span>
                <h2 className="h2 fw-bold text-dark mb-0 mt-1">{praticheAttiveCount}</h2>
                <small className="text-muted">Fascicoli in corso di lavorazione</small>
              </div>
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                <i className="bi bi-folder-symlink-fill fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body d-flex align-items-center justify-content-between p-3">
              <div>
                <span className="text-muted text-uppercase fw-semibold small">Prossime Udienze</span>
                <h2 className="h2 fw-bold text-dark mb-0 mt-1">{prossimeUdienzeCount}</h2>
                <small className="text-muted">Comparizioni e discussioni fissate</small>
              </div>
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning">
                <i className="bi bi-calendar-check-fill fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body d-flex align-items-center justify-content-between p-3">
              <div>
                <span className="text-muted text-uppercase fw-semibold small">Atti da Depositare</span>
                <h2 className="h2 fw-bold text-danger mb-0 mt-1">{attiDaDepositareCount}</h2>
                <small className="text-danger fw-semibold">Memorie e termini perentori</small>
              </div>
              <div className="bg-danger bg-opacity-10 p-3 rounded-circle text-danger">
                <i className="bi bi-file-earmark-arrow-up-fill fs-3"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sistema a Schede (Tab System) */}
      <section className="bg-white rounded-3 shadow-sm p-3 p-md-4">
        <ul className="nav nav-tabs border-bottom mb-4" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link fw-semibold px-4 py-2 ${activeTab === 'pratiche' ? 'active text-dark border-dark border-bottom-0' : 'text-secondary'}`}
              onClick={() => setActiveTab('pratiche')}
              type="button"
              role="tab"
            >
              <i className="bi bi-briefcase-fill me-2"></i> Fascicoli & Pratiche ({filteredPratiche.length})
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link fw-semibold px-4 py-2 ${activeTab === 'agenda' ? 'active text-dark border-dark border-bottom-0' : 'text-secondary'}`}
              onClick={() => setActiveTab('agenda')}
              type="button"
              role="tab"
            >
              <i className="bi bi-clock-history me-2"></i> Agenda & Scadenzario ({agenda.length})
            </button>
          </li>
        </ul>

        {/* Tab 1: Fascicoli & Pratiche */}
        {activeTab === 'pratiche' && (
          <div className="table-responsive">
            {filteredPratiche.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-search fs-1 d-block mb-2"></i>
                Nessun fascicolo trovato per i criteri inseriti.
              </div>
            ) : (
              <table className="table table-hover align-middle border rounded">
                <thead className="table-light">
                  <tr>
                    <th scope="col">N° R.G. / Fascicolo</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">Controparte</th>
                    <th scope="col">Autorità / Giudice</th>
                    <th scope="col">Oggetto</th>
                    <th scope="col">Stato</th>
                    <th scope="col">Prossima Data</th>
                    <th scope="col" className="text-end">Azione</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPratiche.map((pratica) => (
                    <tr key={pratica.id}>
                      <td>
                        <span className="fw-bold font-monospace text-primary">{pratica.numeroRG}</span>
                      </td>
                      <td className="fw-semibold text-dark">{pratica.cliente}</td>
                      <td className="text-muted">{pratica.controparte}</td>
                      <td className="small text-muted">{pratica.tribunale}</td>
                      <td>
                        <span className="badge bg-light text-dark border">{pratica.oggetto}</span>
                      </td>
                      <td>
                        <span className={`badge ${getStatoBadge(pratica.stato)}`}>
                          {pratica.stato}
                        </span>
                      </td>
                      <td className="small font-monospace">
                        <i className="bi bi-calendar-event me-1 text-primary"></i>
                        {pratica.prossimaData}
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => alert(`Dettagli Fascicolo ${pratica.numeroRG}\nCliente: ${pratica.cliente}\nTribunale: ${pratica.tribunale}`)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeletePratica(pratica.id)}
                          title="Elimina Fascicolo"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 2: Agenda & Scadenzario */}
        {activeTab === 'agenda' && (
          <div className="row g-3">
            {agenda.map((item) => (
              <div key={item.id} className="col-12">
                <div className={`card border-0 border-start border-4 shadow-sm p-3 ${item.priorita === 'Alta' ? 'border-danger' : 'border-primary'}`}>
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                    <div className="d-flex align-items-center gap-3">
                      <div className="text-center px-3 py-2 bg-light rounded-3 border">
                        <span className="d-block small text-uppercase text-muted fw-bold">Data</span>
                        <span className="fw-bold text-dark fs-6">{item.data}</span>
                        <span className="d-block badge bg-dark text-white mt-1">{item.ora}</span>
                      </div>
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="badge bg-dark">{item.tipo}</span>
                          <span className={`badge ${getPrioritaBadge(item.priorita)}`}>
                            Priorità {item.priorita}
                          </span>
                        </div>
                        <h3 className="h6 font-semibold mb-1 text-dark">{item.fascicolo}</h3>
                        <p className="text-muted small mb-0">{item.descrizione}</p>
                      </div>
                    </div>

                    <div>
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => alert(`Adempimento completato per ${item.fascicolo}`)}
                      >
                        <i className="bi bi-check2-circle me-1"></i> Segna Completato
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modale Inserimento Fascicolo */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-folder-plus me-2"></i> Nuovo Fascicolo Legale
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                  aria-label="Chiudi"
                ></button>
              </div>
              <form onSubmit={handleAddFascicolo}>
                <div className="modal-body p-4">
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Numero R.G. *</label>
                      <input
                        type="text"
                        name="numeroRG"
                        className="form-control"
                        placeholder="Es. RG-2041/2026"
                        value={formData.numeroRG}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Autorità / Giudice</label>
                      <input
                        type="text"
                        name="tribunale"
                        className="form-control"
                        placeholder="Es. Tribunale di Milano"
                        value={formData.tribunale}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Cliente *</label>
                      <input
                        type="text"
                        name="cliente"
                        className="form-control"
                        placeholder="Nome Cognome / Società"
                        value={formData.cliente}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Controparte *</label>
                      <input
                        type="text"
                        name="controparte"
                        className="form-control"
                        placeholder="Nome Cognome / Ente"
                        value={formData.controparte}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Oggetto / Materia</label>
                    <input
                      type="text"
                      name="oggetto"
                      className="form-control"
                      placeholder="Es. Risarcimento Danni, Contrattuale, Lavoro..."
                      value={formData.oggetto}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Stato Pratica</label>
                      <select
                        name="stato"
                        className="form-select"
                        value={formData.stato}
                        onChange={handleInputChange}
                      >
                        <option value="In corso">In corso</option>
                        <option value="In attesa di sentenza">In attesa di sentenza</option>
                        <option value="Archiviato">Archiviato</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Prossima Data Udienza / Atto</label>
                      <input
                        type="date"
                        name="prossimaData"
                        className="form-control"
                        value={formData.prossimaData}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Annulla
                  </button>
                  <button type="submit" className="btn btn-dark fw-semibold">
                    <i className="bi bi-check-lg me-1"></i> Registra Fascicolo
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