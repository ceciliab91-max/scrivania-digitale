import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';

const initialDashboardData = {
  assicurazioni: {
    totali: 3,
    inScadenza: 1,
    prossimaScadenza: { tipo: 'Casa - Generali', data: '2026-08-25', giorniRimanenti: 12 }
  },
  studioLegale: {
    praticheAttive: 2,
    prossimaUdienza: { cliente: 'Rossi Mario', rg: 'RG-1042/2025', data: '2026-09-20', tribunale: 'Milano' }
  },
  personale: {
    taskOggi: 3,
    taskCompletati: 1,
    prossimoEvento: { titolo: 'Visita Odontoiatrica', data: '2026-08-20', ora: '15:30' }
  }
};

const initialTimeline = [
  { id: 1, modulo: 'personale', titolo: 'Rinnovo Carta d\'Identità', data: '2026-08-14', ora: '10:00', icona: 'bi-person-badge text-success', badge: 'Personale', link: '/personale' },
  { id: 2, modulo: 'personale', titolo: 'Visita Odontoiatrica', data: '2026-08-20', ora: '15:30', icona: 'bi-heart-pulse text-danger', badge: 'Salute', link: '/personale' },
  { id: 3, modulo: 'assicurazioni', titolo: 'Scadenza Polizza Casa (Generali)', data: '2026-08-25', ora: '23:59', icona: 'bi-shield-exclamation text-warning', badge: 'Assicurazioni', link: '/assicurazioni' },
  { id: 4, modulo: 'studioLegale', titolo: 'Udienza RG-1042/2025 (Rossi c/ Bianchi)', data: '2026-09-20', ora: '09:30', icona: 'bi-balance-scale text-primary', badge: 'Studio Legale', link: '/studio-legale' }
];

export default function Home() {
  const [data] = useState(initialDashboardData);
  const [timeline] = useState(initialTimeline);

  // Formattazione data odierna
  const todayFormatted = useMemo(() => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = new Date(2026, 7, 13).toLocaleDateString('it-IT', options);
    return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  }, []);

  return (
    <div className="container-fluid p-4">
      {/* 1. Header Benvenuto & Data Corrente */}
      <header className="row align-items-center mb-4 pb-3 border-bottom bg-white p-3 rounded-3 shadow-sm">
        <div className="col-md-7 mb-3 mb-md-0">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary bg-opacity-10 p-3 rounded-3 text-primary">
              <i className="bi bi-speedometer2 fs-2"></i>
            </div>
            <div>
              <h1 className="h3 mb-1 fw-bold text-dark">Scrivania Digitale - Hub Gestionale</h1>
              <p className="text-muted mb-0 small">
                <i className="bi bi-calendar-day me-1 text-primary"></i> Oggi è {todayFormatted}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="d-flex flex-wrap gap-2 justify-content-md-end">
            <Link to="/assicurazioni" className="btn btn-outline-primary btn-sm fw-semibold">
              <i className="bi bi-shield-check me-1"></i> Assicurazioni
            </Link>
            <Link to="/studio-legale" className="btn btn-outline-dark btn-sm fw-semibold">
              <i className="bi bi-balance-scale me-1"></i> Studio Legale
            </Link>
            <Link to="/personale" className="btn btn-outline-success btn-sm fw-semibold">
              <i className="bi bi-person-badge me-1"></i> Personale
            </Link>
          </div>
        </div>
      </header>

      {/* 2. KPI / Panoramica Generale (4 Mini-Card Top Bar) */}
      <section className="row g-3 mb-4" aria-label="Panoramica KPI generale">
        <div className="col-12 col-sm-6 col-xl-3">
          <Link to="/assicurazioni" className="text-decoration-none">
            <div className="card border-0 shadow-sm rounded-3 h-100 hover-shadow transition-all border-start border-warning border-4">
              <div className="card-body p-3 d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted text-uppercase fw-semibold small">Polizze in Scadenza</span>
                  <h2 className="h2 fw-bold text-warning mb-0 mt-1">{data.assicurazioni.inScadenza}</h2>
                  <small className="text-muted">Su {data.assicurazioni.totali} polizze totali</small>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning">
                  <i className="bi bi-shield-exclamation fs-3"></i>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <Link to="/studio-legale" className="text-decoration-none">
            <div className="card border-0 shadow-sm rounded-3 h-100 hover-shadow transition-all border-start border-primary border-4">
              <div className="card-body p-3 d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted text-uppercase fw-semibold small">Prossime Udienze</span>
                  <h2 className="h2 fw-bold text-primary mb-0 mt-1">{data.studioLegale.praticheAttive}</h2>
                  <small className="text-muted">Fascicoli attivi in corso</small>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                  <i className="bi bi-briefcase fs-3"></i>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <Link to="/personale" className="text-decoration-none">
            <div className="card border-0 shadow-sm rounded-3 h-100 hover-shadow transition-all border-start border-success border-4">
              <div className="card-body p-3 d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted text-uppercase fw-semibold small">Impegni di Oggi</span>
                  <h2 className="h2 fw-bold text-success mb-0 mt-1">
                    {data.personale.taskCompletati}/{data.personale.taskOggi}
                  </h2>
                  <small className="text-muted">Task completati nella giornata</small>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                  <i className="bi bi-check2-circle fs-3"></i>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 h-100 bg-white">
            <div className="card-body p-3 d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted text-uppercase fw-semibold small">Stato Generale Hub</span>
                <div className="mt-2">
                  <span className="badge bg-warning text-dark px-2 py-2 fs-6 fw-semibold">
                    <i className="bi bi-exclamation-triangle-fill me-1"></i> Attenzione Scadenze
                  </span>
                </div>
                <small className="text-muted d-block mt-1">1 polizza in rinnovo imminente</small>
              </div>
              <div className="bg-secondary bg-opacity-10 p-3 rounded-circle text-dark">
                <i className="bi bi-activity fs-3"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Layout Principale a Griglia (3 Sezioni / Widget) */}
      <div className="row g-4 mb-4">
        {/* Widget 1: In Evidenza & Scadenze Critiche (Card di allerta) */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
              <h2 className="h5 fw-bold mb-0 text-dark">
                <i className="bi bi-bell-fill text-warning me-2"></i>
                In Evidenza & Scadenze Critiche
              </h2>
              <span className="badge bg-danger">Priorità Alta</span>
            </div>

            <div className="card-body p-3">
              <div className="row g-3">
                {/* Critical Item 1: Assicurazioni */}
                <div className="col-12">
                  <div className="p-3 rounded-3 border-start border-warning border-4 bg-warning bg-opacity-10 d-flex flex-wrap justify-content-between align-items-center gap-2">
                    <div className="d-flex align-items-center gap-3">
                      <i className="bi bi-shield-exclamation fs-2 text-warning"></i>
                      <div>
                        <span className="badge bg-warning text-dark mb-1">Scadenza Assicurativa</span>
                        <h3 className="h6 fw-bold mb-0 text-dark">
                          Polizza {data.assicurazioni.prossimaScadenza.tipo}
                        </h3>
                        <small className="text-muted">
                          Scadenza il <strong>{data.assicurazioni.prossimaScadenza.data}</strong> ({data.assicurazioni.prossimaScadenza.giorniRimanenti} giorni rimanenti)
                        </small>
                      </div>
                    </div>
                    <Link to="/assicurazioni" className="btn btn-sm btn-warning text-dark fw-semibold">
                      Vai al modulo <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>

                {/* Critical Item 2: Studio Legale */}
                <div className="col-12">
                  <div className="p-3 rounded-3 border-start border-primary border-4 bg-primary bg-opacity-10 d-flex flex-wrap justify-content-between align-items-center gap-2">
                    <div className="d-flex align-items-center gap-3">
                      <i className="bi bi-balance-scale fs-2 text-primary"></i>
                      <div>
                        <span className="badge bg-primary mb-1">Prossima Udienza</span>
                        <h3 className="h6 fw-bold mb-0 text-dark">
                          Fascicolo {data.studioLegale.prossimaUdienza.rg} - Cliente: {data.studioLegale.prossimaUdienza.cliente}
                        </h3>
                        <small className="text-muted">
                          Udienza il <strong>{data.studioLegale.prossimaUdienza.data}</strong> presso {data.studioLegale.prossimaUdienza.tribunale}
                        </small>
                      </div>
                    </div>
                    <Link to="/studio-legale" className="btn btn-sm btn-primary fw-semibold">
                      Vai al modulo <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>

                {/* Critical Item 3: Personale */}
                <div className="col-12">
                  <div className="p-3 rounded-3 border-start border-success border-4 bg-success bg-opacity-10 d-flex flex-wrap justify-content-between align-items-center gap-2">
                    <div className="d-flex align-items-center gap-3">
                      <i className="bi bi-calendar-event fs-2 text-success"></i>
                      <div>
                        <span className="badge bg-success mb-1">Impegno Personale</span>
                        <h3 className="h6 fw-bold mb-0 text-dark">
                          {data.personale.prossimoEvento.titolo}
                        </h3>
                        <small className="text-muted">
                          In programma il <strong>{data.personale.prossimoEvento.data}</strong> alle ore {data.personale.prossimoEvento.ora}
                        </small>
                      </div>
                    </div>
                    <Link to="/personale" className="btn btn-sm btn-success fw-semibold">
                      Vai al modulo <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Widget 2: Prossimi 7 Giorni (Timeline Aggregata) */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
              <h2 className="h5 fw-bold mb-0 text-dark">
                <i className="bi bi-clock-history text-primary me-2"></i>
                Prossimi 7 Giorni (Timeline)
              </h2>
              <span className="badge bg-light text-dark border">Integrata</span>
            </div>

            <div className="card-body p-3">
              <div className="timeline">
                {timeline.map((item) => (
                  <div key={item.id} className="d-flex align-items-start mb-3 pb-3 border-bottom">
                    <div className="p-2 rounded-3 bg-light border me-3">
                      <i className={`bi ${item.icona} fs-4`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="badge bg-secondary bg-opacity-10 text-dark fw-semibold">
                          {item.badge}
                        </span>
                        <small className="text-muted font-monospace">{item.data} - {item.ora}</small>
                      </div>
                      <h3 className="h6 font-semibold text-dark mb-0">{item.titolo}</h3>
                    </div>
                    <Link to={item.link} className="btn btn-sm btn-link text-decoration-none text-muted">
                      <i className="bi bi-chevron-right fs-6"></i>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Widget 3: Scorciatoie & Moduli (Accesso Rapido) */}
      <section aria-label="Scorciatoie per i moduli operativi">
        <h2 className="h5 fw-bold text-dark mb-3">
          <i className="bi bi-grid-3x3-gap-fill text-primary me-2"></i>
          Moduli Operativi & Accessi Rapidi
        </h2>

        <div className="row g-3">
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm rounded-3 h-100 hover-shadow transition-all bg-white">
              <div className="card-body p-4 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-3 text-primary">
                      <i className="bi bi-shield-check fs-2"></i>
                    </div>
                    <span className="badge bg-primary">3 Polizze</span>
                  </div>
                  <h3 className="h5 fw-bold text-dark mb-2">Scrivania Assicurazioni</h3>
                  <p className="text-muted small mb-4">
                    Gestisci le tue polizze auto, casa, vita e RC professionale con archivio documentale allegato.
                  </p>
                </div>
                <Link to="/assicurazioni" className="btn btn-primary w-100 fw-semibold d-flex align-items-center justify-content-center gap-2">
                  Apri Assicurazioni <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm rounded-3 h-100 hover-shadow transition-all bg-white">
              <div className="card-body p-4 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="bg-dark bg-opacity-10 p-3 rounded-3 text-dark">
                      <i className="bi bi-balance-scale fs-2"></i>
                    </div>
                    <span className="badge bg-dark">2 Pratiche</span>
                  </div>
                  <h3 className="h5 fw-bold text-dark mb-2">Studio Legale</h3>
                  <p className="text-muted small mb-4">
                    Monitora i fascicoli giudiziali, le date delle prossime udienze e i termini di deposito atti.
                  </p>
                </div>
                <Link to="/studio-legale" className="btn btn-dark w-100 fw-semibold d-flex align-items-center justify-content-center gap-2">
                  Apri Studio Legale <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm rounded-3 h-100 hover-shadow transition-all bg-white">
              <div className="card-body p-4 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="bg-success bg-opacity-10 p-3 rounded-3 text-success">
                      <i className="bi bi-person-badge fs-2"></i>
                    </div>
                    <span className="badge bg-success">3 Impegni</span>
                  </div>
                  <h3 className="h5 fw-bold text-dark mb-2">Scrivania Personale</h3>
                  <p className="text-muted small mb-4">
                    Organizza il tuo tempo con il calendario mensile interattivo, checklist di task e note stile post-it.
                  </p>
                </div>
                <Link to="/personale" className="btn btn-success w-100 fw-semibold d-flex align-items-center justify-content-center gap-2">
                  Apri Personale <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}