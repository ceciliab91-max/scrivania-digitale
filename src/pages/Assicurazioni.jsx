import React, { useState, useMemo } from 'react';

const initialPolizze = [
  { id: 1, tipo: 'Auto', compagnia: 'UnipolSai', numero: 'POL-883920', scadenza: '2026-09-15', premio: 480, stato: 'Attiva' },
  { id: 2, tipo: 'Casa', compagnia: 'Generali', numero: 'POL-102938', scadenza: '2026-08-25', premio: 320, stato: 'In Scadenza' },
  { id: 3, tipo: 'Studio Legale / RC', compagnia: 'Allianz', numero: 'POL-773412', scadenza: '2027-01-10', premio: 1100, stato: 'Attiva' }
];

const initialDocumenti = [
  { id: 1, nome: 'Contratto_Polizza_Auto_2026.pdf', polizza: 'Auto - UnipolSai (POL-883920)', data: '2025-09-15', dimensione: '1.4 MB' },
  { id: 2, nome: 'Ricevuta_Pagamento_Casa.pdf', polizza: 'Casa - Generali (POL-102938)', data: '2025-08-25', dimensione: '650 KB' },
  { id: 3, nome: 'Certificato_RC_Professionale.pdf', polizza: 'Studio Legale / RC - Allianz (POL-773412)', data: '2026-01-10', dimensione: '2.1 MB' }
];

export default function Assicurazioni() {
  const [polizze, setPolizze] = useState(initialPolizze);
  const [documenti, setDocumenti] = useState(initialDocumenti);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('polizze');
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    tipo: 'Auto',
    compagnia: '',
    numero: '',
    scadenza: '',
    premio: '',
    stato: 'Attiva'
  });

  // Filtro ricerca polizze
  const filteredPolizze = useMemo(() => {
    return polizze.filter((p) =>
      p.compagnia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [polizze, searchTerm]);

  // Calcolo KPI
  const polizzeAttiveCount = useMemo(() => {
    return polizze.filter((p) => p.stato === 'Attiva').length;
  }, [polizze]);

  const scadenzeImminentiCount = useMemo(() => {
    const today = new Date();
    const targetDate = new Date();
    targetDate.setDate(today.getDate() + 30);

    return polizze.filter((p) => {
      if (p.stato === 'In Scadenza') return true;
      const d = new Date(p.scadenza);
      return d >= today && d <= targetDate;
    }).length;
  }, [polizze]);

  const totalePremiAnnuo = useMemo(() => {
    return polizze.reduce((acc, curr) => acc + Number(curr.premio || 0), 0);
  }, [polizze]);

  // Gestione form modale
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPolizza = (e) => {
    e.preventDefault();
    if (!formData.compagnia || !formData.numero || !formData.scadenza) return;

    const newEntry = {
      id: Date.now(),
      tipo: formData.tipo,
      compagnia: formData.compagnia,
      numero: formData.numero,
      scadenza: formData.scadenza,
      premio: Number(formData.premio) || 0,
      stato: formData.stato
    };

    setPolizze((prev) => [newEntry, ...prev]);

    // Aggiunge anche un documento fittizio correlato
    setDocumenti((prev) => [
      {
        id: Date.now() + 1,
        nome: `Contratto_${formData.tipo}_${formData.numero}.pdf`,
        polizza: `${formData.tipo} - ${formData.compagnia} (${formData.numero})`,
        data: new Date().toISOString().split('T')[0],
        dimensione: '1.2 MB'
      },
      ...prev
    ]);

    setFormData({
      tipo: 'Auto',
      compagnia: '',
      numero: '',
      scadenza: '',
      premio: '',
      stato: 'Attiva'
    });
    setShowModal(false);
  };

  const handleDeletePolizza = (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa polizza?')) {
      setPolizze((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo.toLowerCase()) {
      case 'auto':
        return 'bi-car-front-fill text-primary';
      case 'casa':
        return 'bi-house-heart-fill text-danger';
      case 'studio legale / rc':
      case 'rc':
        return 'bi-shield-lock-fill text-warning';
      default:
        return 'bi-file-earmark-check-fill text-info';
    }
  };

  const getBadgeClass = (stato) => {
    switch (stato) {
      case 'Attiva':
        return 'bg-success';
      case 'In Scadenza':
        return 'bg-warning text-dark';
      case 'Scaduta':
        return 'bg-danger';
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
            <div className="bg-primary bg-opacity-10 p-3 rounded-3 text-primary">
              <i className="bi bi-shield-check fs-2"></i>
            </div>
            <div>
              <h1 className="h3 mb-1 fw-bold text-dark">Scrivania Assicurativa</h1>
              <p className="text-muted mb-0 small">
                Gestione polizze, scadenze e archivio documentale
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
                placeholder="Cerca compagnia, N°..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Cerca polizza"
              />
            </div>
            <button
              className="btn btn-primary d-flex align-items-center gap-2 fw-semibold px-3 text-nowrap"
              onClick={() => setShowModal(true)}
            >
              <i className="bi bi-plus-lg"></i> Nuova Polizza
            </button>
          </div>
        </div>
      </header>

      {/* KPI Top Bar */}
      <section className="row g-3 mb-4" aria-label="Indicatori di prestazione">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body d-flex align-items-center justify-content-between p-3">
              <div>
                <span className="text-muted text-uppercase fw-semibold small">Polizze Attive</span>
                <h2 className="h2 fw-bold text-dark mb-0 mt-1">{polizzeAttiveCount}</h2>
                <small className="text-muted">Su {polizze.length} totali in archivio</small>
              </div>
              <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                <i className="bi bi-check-circle-fill fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className={`card border-0 shadow-sm rounded-3 h-100 ${scadenzeImminentiCount > 0 ? 'border-start border-warning border-4' : ''}`}>
            <div className="card-body d-flex align-items-center justify-content-between p-3">
              <div>
                <span className="text-muted text-uppercase fw-semibold small">Scadenze Imminenti</span>
                <h2 className={`h2 fw-bold mb-0 mt-1 ${scadenzeImminentiCount > 0 ? 'text-warning' : 'text-dark'}`}>
                  {scadenzeImminentiCount}
                </h2>
                <small className={scadenzeImminentiCount > 0 ? 'text-warning fw-semibold' : 'text-muted'}>
                  {scadenzeImminentiCount > 0 ? 'Richiedono attenzione (< 30 gg)' : 'Nessuna scadenza a breve'}
                </small>
              </div>
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning">
                <i className="bi bi-exclamation-triangle-fill fs-3"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body d-flex align-items-center justify-content-between p-3">
              <div>
                <span className="text-muted text-uppercase fw-semibold small">Totale Premi Annui</span>
                <h2 className="h2 fw-bold text-dark mb-0 mt-1">
                  € {totalePremiAnnuo.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </h2>
                <small className="text-muted">Importo globale preventivato</small>
              </div>
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                <i className="bi bi-currency-euro fs-3"></i>
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
              className={`nav-link fw-semibold px-4 py-2 ${activeTab === 'polizze' ? 'active text-primary border-primary border-bottom-0' : 'text-secondary'}`}
              onClick={() => setActiveTab('polizze')}
              type="button"
              role="tab"
            >
              <i className="bi bi-grid-fill me-2"></i> Polizze & Bacheca Scadenze
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link fw-semibold px-4 py-2 ${activeTab === 'archivio' ? 'active text-primary border-primary border-bottom-0' : 'text-secondary'}`}
              onClick={() => setActiveTab('archivio')}
              type="button"
              role="tab"
            >
              <i className="bi bi-folder-fill me-2"></i> Archivio Documentale ({documenti.length})
            </button>
          </li>
        </ul>

        {/* Tab 1: Polizze & Bacheca Scadenze */}
        {activeTab === 'polizze' && (
          <div>
            {filteredPolizze.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                Nessuna polizza trovata per il filtro applicato.
              </div>
            ) : (
              <div className="row g-3">
                {filteredPolizze.map((polizza) => (
                  <div key={polizza.id} className="col-12 col-md-6 col-lg-4">
                    <article className="card h-100 border shadow-sm hover-shadow transition-all">
                      <div className="card-body d-flex flex-column justify-content-between p-3">
                        <div>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <span className="badge bg-light text-dark border px-2 py-1">
                              <i className={`bi ${getTipoIcon(polizza.tipo)} me-1`}></i>
                              {polizza.tipo}
                            </span>
                            <span className={`badge ${getBadgeClass(polizza.stato)}`}>
                              {polizza.stato}
                            </span>
                          </div>
                          <h2 className="h5 font-bold card-title text-dark mb-1">{polizza.compagnia}</h2>
                          <p className="text-muted small font-monospace mb-3">N° {polizza.numero}</p>

                          <div className="bg-light p-2 rounded mb-3">
                            <div className="d-flex justify-content-between small mb-1">
                              <span className="text-muted">Scadenza:</span>
                              <span className="fw-semibold text-dark">
                                <i className="bi bi-calendar-event me-1 text-primary"></i>
                                {polizza.scadenza}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between small">
                              <span className="text-muted">Premio Annuo:</span>
                              <span className="fw-bold text-success">
                                € {Number(polizza.premio).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => alert(`Dettagli polizza ${polizza.numero}\nCompagnia: ${polizza.compagnia}\nScadenza: ${polizza.scadenza}`)}
                          >
                            <i className="bi bi-info-circle me-1"></i> Dettagli
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeletePolizza(polizza.id)}
                            title="Elimina Polizza"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Archivio Documentale */}
        {activeTab === 'archivio' && (
          <div className="table-responsive">
            <table className="table table-hover align-middle border rounded">
              <thead className="table-light">
                <tr>
                  <th scope="col">Documento</th>
                  <th scope="col">Polizza Associata</th>
                  <th scope="col">Data Caricamento</th>
                  <th scope="col">Dimensione</th>
                  <th scope="col" className="text-end">Azione</th>
                </tr>
              </thead>
              <tbody>
                {documenti.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-file-earmark-pdf-fill fs-4 text-danger"></i>
                        <span className="fw-semibold text-dark">{doc.nome}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">{doc.polizza}</span>
                    </td>
                    <td className="text-muted small">{doc.data}</td>
                    <td className="text-muted small">{doc.dimensione}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => alert(`Download simulato del file: ${doc.nome}`)}
                      >
                        <i className="bi bi-download me-1"></i> Scarica
                      </button>
                      <button
                        className="btn btn-sm btn-light border"
                        onClick={() => alert(`Anteprima simulata di: ${doc.nome}`)}
                      >
                        <i className="bi bi-eye me-1"></i> Visualizza
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modale Inserimento Polizza */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-shield-plus me-2"></i> Nuova Polizza Assicurativa
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                  aria-label="Chiudi"
                ></button>
              </div>
              <form onSubmit={handleAddPolizza}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Tipo Polizza</label>
                    <select
                      name="tipo"
                      className="form-select"
                      value={formData.tipo}
                      onChange={handleInputChange}
                    >
                      <option value="Auto">Auto</option>
                      <option value="Casa">Casa</option>
                      <option value="Studio Legale / RC">Studio Legale / RC</option>
                      <option value="Vita">Vita</option>
                      <option value="Infortuni">Infortuni</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Compagnia Assicurativa *</label>
                    <input
                      type="text"
                      name="compagnia"
                      className="form-control"
                      placeholder="Es. Generali, UnipolSai, Allianz..."
                      value={formData.compagnia}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Numero Polizza *</label>
                      <input
                        type="text"
                        name="numero"
                        className="form-control"
                        placeholder="Es. POL-99201"
                        value={formData.numero}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Data Scadenza *</label>
                      <input
                        type="date"
                        name="scadenza"
                        className="form-control"
                        value={formData.scadenza}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Premio Annuo (€)</label>
                      <input
                        type="number"
                        name="premio"
                        className="form-control"
                        placeholder="Es. 450"
                        value={formData.premio}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Stato</label>
                      <select
                        name="stato"
                        className="form-select"
                        value={formData.stato}
                        onChange={handleInputChange}
                      >
                        <option value="Attiva">Attiva</option>
                        <option value="In Scadenza">In Scadenza</option>
                        <option value="Scaduta">Scaduta</option>
                      </select>
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
                  <button type="submit" className="btn btn-primary fw-semibold">
                    <i className="bi bi-check-lg me-1"></i> Salva Polizza
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