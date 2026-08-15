# Hub Personale — Scrivania Digitale Integrata

**Hub Personale** è una Single Page Application (SPA) moderna progettata come **Scrivania Digitale unificata**. L'applicazione permette di gestire in un unico spazio di lavoro più attività: personali e lavorative. Questo progetto è creato per me che gestisco un ufficio legale e un ufficio assicurativo, quindi ci sono due scrivanie digitali: scrivania assicurativa e scrivania studio legal, ho aggiunto la scrivania personale e una sezione relativa alle PECs e mail ordinarie.

---

## Architettura & Stack Tecnologico

L'applicazione è sviluppata con un'architettura modulare e reattiva basata sull'ecosistema React:

* **Core Framework**: [React 19](https://react.dev/)
* **Build Tool & Dev Server**: [Vite 8](https://vitejs.dev/)
* **Routing**: [React Router v8](https://reactrouter.com/) (Navigazione dinamica e layout annidati con `<Outlet />`)
* **UI & Design System**: [Bootstrap 5.3](https://getbootstrap.com/) + [Bootstrap Icons](https://icons.getbootstrap.com/)
* **Linter & Static Analysis**: [Oxlint](https://github.com/oxc-project/oxc)
* **Package Manager**: `pnpm`

---

## Struttura del Progetto

```text
hub-personale/
├── public/                  # Asset statici e favicon
├── src/
│   ├── assets/              # Immagini, icone e risorse grafiche
│   ├── layouts/
│   │   └── MainLayout.jsx   # Layout base con Sidebar responsive e area Outlet
│   ├── pages/
│   │   ├── Home.jsx         # Dashboard principale e centro di controllo KPI
│   │   ├── Assicurazioni.jsx# Scrivania gestione polizze e scadenze
│   │   ├── StudioLegale.jsx # Scrivania gestione fascicoli, RG e udienze
│   │   ├── Personale.jsx    # Agenda, Calendario interattivo, Task e Post-it
│   │   └── Mail.jsx         # Client mail integrato (PEC / Posta Ordinaria)
│   ├── App.jsx              # Configurazione delle rotte e fallback 404
│   ├── main.jsx             # Punto di ingresso dell'applicazione e React Router
│   └── index.css            # Stili globali e personalizzazioni UI
├── package.json             # Dipendenze e script di build
├── vite.config.js           # Configurazione di Vite
└── README.md                # Documentazione del progetto

Moduli dell'Applicazione

1. Dashboard Home (Home.jsx)
Centro di Controllo: Aggregatore in tempo reale delle scadenze imminenti da tutti i moduli.

KPI Top Bar: Contatori sintetici per polizze in scadenza, prossime udienze e task del giorno.

Timeline Unificata: Vista aggregata degli impegni dei prossimi 7 giorni.

2. Scrivania Assicurazioni (Assicurazioni.jsx)
Gestione Polizze: Schede dettagliate con calcolo automatico dei giorni alla scadenza e badge di allerta.

Archivio Documenti: Tabella per la gestione rapida di preventivi, contratti PDF e ricevute di pagamento.

KPI Economici: Monitoraggio del totale dei premi annui e delle scadenze a 30 giorni.

3. Scrivania Studio Legale (StudioLegale.jsx)
Anagrafica Fascicoli: Tracciamento pratiche per Numero R.G., Cliente, Controparte e Autorità Giudiziaria.

Agenda Udienze & Atti: Scadenzario integrato per termini di deposito e date di udienza.

Predisposizione Integrativa: Architettura pronta per la sincronizzazione tramite API verso gestionali legali (es. Netlex).

4. Scrivania Personale (Personale.jsx)
Calendario Interattivo: Griglia mensile con eventi e indicatori visivi per giorno.

Task Manager: Checklist con barra di avanzamento del completamento giornaliero.

Bacheca Post-it: Note rapide colorate per appunti al volo.

5. Client Mail & PEC (Mail.jsx)
Multi-Account: Gestione unificata di posta personale, casella dello studio e indirizzi aziendali.

Filtro PEC: Evidenziazione e gestione dedicata per le notifiche e ricevute di Posta Elettronica Certificata.

Configurazione IMAP/SMTP: Struttura predisposta per il collegamento con server mail esterni.
