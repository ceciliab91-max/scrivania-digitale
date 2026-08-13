import React, { useState, useMemo } from 'react';

const initialEventi = [
  { id: 1, titolo: 'Visita Odontoiatrica', data: '2026-08-20', ora: '15:30', categoria: 'Salute', completato: false },
  { id: 2, titolo: 'Compleanno Marco', data: '2026-08-25', ora: '20:00', categoria: 'Personale', completato: false },
  { id: 3, titolo: 'Rinnovo Carta d\'Identità', data: '2026-08-14', ora: '10:00', categoria: 'Burocrazia', completato: true }
];

const initialTask = [
  { id: 1, testo: 'Rinnovare abbonamento palestra', completato: false },
  { id: 2, testo: 'Organizzare valigia per il weekend', completato: true },
  { id: 3, testo: 'Pagare bolletta luce', completato: false }
];

const initialNote = [
  { id: 1, titolo: 'Idea Progetto', testo: 'Aggiungere esportazione PDF alle fatture dello studio', colore: 'bg-warning-subtle' },
  { id: 2, titolo: 'Lista Spesa Rapida', testo: 'Caffè, Carta stampante, Marker neri', colore: 'bg-info-subtle' }
];

const NOMI_MESI = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

const GIORNI_SETTIMANA = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

export default function Personale() {
  const [eventi, setEventi] = useState(initialEventi);
  const [tasks, setTasks] = useState(initialTask);
  const [note, setNote] = useState(initialNote);

  // Data odierna di riferimento (es. 2026-08-13)
  const todayObj = new Date();
  const todayStr = todayObj.toISOString().split('T')[0];

  // Mese e Anno correnti del calendario
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(7); // 7 = Agosto (0-indexed)
  const [selectedDate, setSelectedDate] = useState('2026-08-20');

  // Input rapido Task
  const [newQuickTask, setNewQuickTask] = useState('');

  // Modali
  const [showEventModal, setShowEventModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  // Form Modale Evento
  const [eventFormData, setEventFormData] = useState({
    titolo: '',
    data: selectedDate,
    ora: '09:00',
    categoria: 'Personale'
  });

  // Form Modale Nota
  const [noteFormData, setNoteFormData] = useState({
    titolo: '',
    testo: '',
    colore: 'bg-warning-subtle'
  });

  // --- LOGICA CALENDARIO ---
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonthIndex, 1);
    // Convertiamo a lunedì primo giorno: (0=Dom -> 6, 1=Lun -> 0, 2=Mar -> 1...)
    const startDayOfWeek = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();

    const daysArr = [];

    // Spazi vuoti iniziali
    for (let i = 0; i < startDayOfWeek; i++) {
      daysArr.push(null);
    }

    // Giorni reali del mese
    for (let d = 1; d <= daysInMonth; d++) {
      const monthStr = String(currentMonthIndex + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const fullDateStr = `${currentYear}-${monthStr}-${dayStr}`;

      const hasEvents = eventi.some((e) => e.data === fullDateStr);
      daysArr.push({ dayNumber: d, dateStr: fullDateStr, hasEvents });
    }

    return daysArr;
  }, [currentYear, currentMonthIndex, eventi]);

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonthIndex((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonthIndex((m) => m + 1);
    }
  };

  // Eventi della data selezionata
  const eventiGiornoSelezionato = useMemo(() => {
    return eventi.filter((e) => e.data === selectedDate);
  }, [eventi, selectedDate]);

  // Gestione Eventi
  const handleToggleEvento = (id) => {
    setEventi((prev) =>
      prev.map((e) => (e.id === id ? { ...e, completato: !e.completato } : e))
    );
  };

  const handleDeleteEvento = (id) => {
    setEventi((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSaveEvento = (e) => {
    e.preventDefault();
    if (!eventFormData.titolo || !eventFormData.data) return;

    const newEv = {
      id: Date.now(),
      titolo: eventFormData.titolo,
      data: eventFormData.data,
      ora: eventFormData.ora || '09:00',
      categoria: eventFormData.categoria,
      completato: false
    };

    setEventi((prev) => [...prev, newEv]);
    setSelectedDate(eventFormData.data);
    setEventFormData({ titolo: '', data: selectedDate, ora: '09:00', categoria: 'Personale' });
    setShowEventModal(false);
  };

  // Gestione Task
  const taskCompletatiCount = useMemo(() => {
    return tasks.filter((t) => t.completato).length;
  }, [tasks]);

  const taskPercentage = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.round((taskCompletatiCount / tasks.length) * 100);
  }, [tasks, taskCompletatiCount]);

  const handleToggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completato: !t.completato } : t))
    );
  };

  const handleAddQuickTask = (e) => {
    e.preventDefault();
    if (!newQuickTask.trim()) return;

    setTasks((prev) => [
      ...prev,
      { id: Date.now(), testo: newQuickTask.trim(), completato: false }
    ]);
    setNewQuickTask('');
  };

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Gestione Note
  const handleSaveNota = (e) => {
    e.preventDefault();
    if (!noteFormData.titolo || !noteFormData.testo) return;

    const newNote = {
      id: Date.now(),
      titolo: noteFormData.titolo,
      testo: noteFormData.testo,
      colore: noteFormData.colore
    };

    setNote((prev) => [newNote, ...prev]);
    setNoteFormData({ titolo: '', testo: '', colore: 'bg-warning-subtle' });
    setShowNoteModal(false);
  };

  const handleDeleteNota = (id) => {
    setNote((prev) => prev.filter((n) => n.id !== id));
  };

  const getCategoriaBadge = (cat) => {
    switch (cat) {
      case 'Salute':
        return 'bg-danger text-white';
      case 'Personale':
        return 'bg-primary text-white';
      case 'Burocrazia':
        return 'bg-warning text-dark';
      case 'Tempo Libero':
        return 'bg-success text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* 1. Header Scrivania */}
      <header className="row align-items-center mb-4 pb-3 border-bottom bg-white p-3 rounded-3 shadow-sm">
        <div className="col-md-7 mb-3 mb-md-0">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-success bg-opacity-10 p-3 rounded-3 text-success">
              <i className="bi bi-person-badge fs-2"></i>
            </div>
            <div>
              <h1 className="h3 mb-1 fw-bold text-dark">Scrivania Personale</h1>
              <p className="text-muted mb-0 small">
                Agenda, impegni, note e checklist personale
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="d-flex flex-wrap gap-2 justify-content-md-end">
            <button
              className="btn btn-primary d-flex align-items-center gap-2 fw-semibold px-3"
              onClick={() => {
                setEventFormData((prev) => ({ ...prev, data: selectedDate }));
                setShowEventModal(true);
              }}
            >
              <i className="bi bi-calendar-plus"></i> + Nuovo Evento
            </button>
            <button
              className="btn btn-outline-dark d-flex align-items-center gap-2 fw-semibold px-3"
              onClick={() => setShowNoteModal(true)}
            >
              <i className="bi bi-sticky"></i> + Nuova Nota
            </button>
          </div>
        </div>
      </header>

      {/* 2. Layout a 2 Colonne */}
      <div className="row g-4">
        {/* COLONNA SINISTRA (60%) - Calendario & Agenda del Giorno */}
        <div className="col-12 col-lg-7">
          {/* Calendario Mensile Interattivo */}
          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
              <h2 className="h5 fw-bold mb-0 text-dark">
                <i className="bi bi-calendar3 me-2 text-primary"></i>
                {NOMI_MESI[currentMonthIndex]} {currentYear}
              </h2>
              <div className="btn-group">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={handlePrevMonth}
                  title="Mese precedente"
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => {
                    setCurrentYear(2026);
                    setCurrentMonthIndex(7);
                    setSelectedDate('2026-08-13');
                  }}
                  title="Oggi"
                >
                  Oggi
                </button>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={handleNextMonth}
                  title="Mese successivo"
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>

            <div className="card-body p-3">
              {/* Intestazione giorni della settimana */}
              <div className="row g-1 text-center fw-bold text-muted small mb-2">
                {GIORNI_SETTIMANA.map((g) => (
                  <div key={g} className="col">
                    {g}
                  </div>
                ))}
              </div>

              {/* Griglia del Mese */}
              <div className="row g-1 text-center">
                {calendarDays.map((item, idx) => {
                  if (!item) {
                    return <div key={`empty-${idx}`} className="col p-2"></div>;
                  }

                  const isSelected = item.dateStr === selectedDate;
                  const isToday = item.dateStr === todayStr;

                  return (
                    <div key={item.dateStr} className="col p-1">
                      <button
                        type="button"
                        className={`btn w-100 p-2 rounded-3 d-flex flex-column align-items-center justify-content-center transition-all ${
                          isSelected
                            ? 'btn-primary text-white shadow-sm fw-bold'
                            : isToday
                            ? 'btn-outline-primary border-2 fw-bold text-dark'
                            : 'btn-light text-dark hover-bg-secondary'
                        }`}
                        style={{ minHeight: '52px', position: 'relative' }}
                        onClick={() => setSelectedDate(item.dateStr)}
                      >
                        <span className="small">{item.dayNumber}</span>
                        {item.hasEvents && (
                          <span
                            className={`rounded-circle mt-1 ${
                              isSelected ? 'bg-white' : 'bg-danger'
                            }`}
                            style={{ width: '6px', height: '6px' }}
                            title="Eventi in programma"
                          ></span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Agenda del Giorno Selezionato */}
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
              <h2 className="h6 fw-bold mb-0 text-dark">
                <i className="bi bi-clock-history me-2 text-primary"></i>
                Agenda del {selectedDate}
              </h2>
              <span className="badge bg-light text-dark border">
                {eventiGiornoSelezionato.length} Impegni
              </span>
            </div>
            <div className="card-body p-3">
              {eventiGiornoSelezionato.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-calendar-check fs-2 d-block mb-2"></i>
                  Nessun impegno in programma per questa data.
                </div>
              ) : (
                <ul className="list-group list-group-flush">
                  {eventiGiornoSelezionato.map((ev) => (
                    <li
                      key={ev.id}
                      className="list-group-item px-0 py-3 d-flex align-items-center justify-content-between border-bottom"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div className="form-check">
                          <input
                            className="form-check-input fs-5"
                            type="checkbox"
                            checked={ev.completato}
                            onChange={() => handleToggleEvento(ev.id)}
                            aria-label={`Segna ${ev.titolo} come svolto`}
                          />
                        </div>
                        <div>
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className={`fw-bold text-dark ${
                                ev.completato ? 'text-decoration-line-through text-muted' : ''
                              }`}
                            >
                              {ev.titolo}
                            </span>
                            <span className={`badge ${getCategoriaBadge(ev.categoria)}`}>
                              {ev.categoria}
                            </span>
                          </div>
                          <small className="text-muted font-monospace">
                            <i className="bi bi-clock me-1"></i> {ev.ora}
                          </small>
                        </div>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger border-0"
                        onClick={() => handleDeleteEvento(ev.id)}
                        title="Elimina Evento"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* COLONNA DESTRA (40%) - Task Manager & Post-it Digitali */}
        <div className="col-12 col-lg-5">
          {/* Task Manager (Checklist) */}
          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-header bg-white py-3 border-bottom">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className="h6 fw-bold mb-0 text-dark">
                  <i className="bi bi-check2-square me-2 text-success"></i>
                  Task Manager & Checklist
                </h2>
                <span className="badge bg-success bg-opacity-10 text-success fw-bold">
                  {taskCompletatiCount} di {tasks.length} svolti
                </span>
              </div>
              {/* Progress Bar */}
              <div className="progress" style={{ height: '8px' }}>
                <div
                  className="progress-bar bg-success transition-all"
                  role="progressbar"
                  style={{ width: `${taskPercentage}%` }}
                  aria-valuenow={taskPercentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>

            <div className="card-body p-3">
              <ul className="list-group list-group-flush mb-3">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="list-group-item px-0 py-2 d-flex align-items-center justify-content-between border-bottom-0"
                  >
                    <div className="form-check d-flex align-items-center gap-2">
                      <input
                        className="form-check-input fs-5"
                        type="checkbox"
                        checked={task.completato}
                        onChange={() => handleToggleTask(task.id)}
                        id={`task-${task.id}`}
                      />
                      <label
                        className={`form-check-label text-dark ${
                          task.completato ? 'text-decoration-line-through text-muted' : ''
                        }`}
                        htmlFor={`task-${task.id}`}
                      >
                        {task.testo}
                      </label>
                    </div>
                    <button
                      className="btn btn-sm btn-link text-danger p-0 border-0"
                      onClick={() => handleDeleteTask(task.id)}
                      title="Elimina Task"
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Form Input Rapido Task */}
              <form onSubmit={handleAddQuickTask} className="input-group">
                <input
                  type="text"
                  className="form-control bg-light"
                  placeholder="Aggiungi una mansione..."
                  value={newQuickTask}
                  onChange={(e) => setNewQuickTask(e.target.value)}
                />
                <button className="btn btn-success fw-semibold" type="submit">
                  <i className="bi bi-plus-lg me-1"></i> Aggiungi
                </button>
              </form>
            </div>
          </div>

          {/* Bacheca Note Rapide (Stile Post-it) */}
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
              <h2 className="h6 fw-bold mb-0 text-dark">
                <i className="bi bi-sticky me-2 text-warning"></i>
                Bacheca Note Rapide
              </h2>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setShowNoteModal(true)}
              >
                + Nuova
              </button>
            </div>
            <div className="card-body p-3">
              {note.length === 0 ? (
                <p className="text-muted small text-center my-3">
                  Nessuna nota presente. Clicca su "+ Nuova" per aggiungere un post-it.
                </p>
              ) : (
                <div className="row g-3">
                  {note.map((n) => (
                    <div key={n.id} className="col-12 col-md-6">
                      <div className={`card h-100 border-0 shadow-sm p-3 rounded-3 ${n.colore}`}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h3 className="h6 fw-bold mb-0 text-dark">{n.titolo}</h3>
                          <button
                            className="btn btn-sm btn-link text-dark p-0 border-0"
                            onClick={() => handleDeleteNota(n.id)}
                            title="Elimina Nota"
                          >
                            <i className="bi bi-trash opacity-75"></i>
                          </button>
                        </div>
                        <p className="small mb-0 text-dark opacity-90">{n.testo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modale Nuovo Evento */}
      {showEventModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-calendar-plus me-2"></i> Nuovo Evento Personale
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowEventModal(false)}
                  aria-label="Chiudi"
                ></button>
              </div>
              <form onSubmit={handleSaveEvento}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Titolo Impegno *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Es. Visita Medica, Riunione..."
                      value={eventFormData.titolo}
                      onChange={(e) => setEventFormData((prev) => ({ ...prev, titolo: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Data *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={eventFormData.data}
                        onChange={(e) => setEventFormData((prev) => ({ ...prev, data: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Ora</label>
                      <input
                        type="time"
                        className="form-control"
                        value={eventFormData.ora}
                        onChange={(e) => setEventFormData((prev) => ({ ...prev, ora: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Categoria</label>
                    <select
                      className="form-select"
                      value={eventFormData.categoria}
                      onChange={(e) => setEventFormData((prev) => ({ ...prev, categoria: e.target.value }))}
                    >
                      <option value="Personale">Personale</option>
                      <option value="Salute">Salute</option>
                      <option value="Burocrazia">Burocrazia</option>
                      <option value="Tempo Libero">Tempo Libero</option>
                      <option value="Lavoro">Lavoro</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEventModal(false)}
                  >
                    Annulla
                  </button>
                  <button type="submit" className="btn btn-primary fw-semibold">
                    <i className="bi bi-check-lg me-1"></i> Salva Evento
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modale Nuova Nota */}
      {showNoteModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-sticky me-2"></i> Nuova Nota Post-it
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowNoteModal(false)}
                  aria-label="Chiudi"
                ></button>
              </div>
              <form onSubmit={handleSaveNota}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Titolo *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Es. Promemoria, Spesa..."
                      value={noteFormData.titolo}
                      onChange={(e) => setNoteFormData((prev) => ({ ...prev, titolo: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Testo / Contenuto *</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Scrivi qui il contenuto della nota..."
                      value={noteFormData.testo}
                      onChange={(e) => setNoteFormData((prev) => ({ ...prev, testo: e.target.value }))}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Colore Post-it</label>
                    <select
                      className="form-select"
                      value={noteFormData.colore}
                      onChange={(e) => setNoteFormData((prev) => ({ ...prev, colore: e.target.value }))}
                    >
                      <option value="bg-warning-subtle">Giallo</option>
                      <option value="bg-info-subtle">Azzurro</option>
                      <option value="bg-danger-subtle">Rosa / Rosso</option>
                      <option value="bg-success-subtle">Verde</option>
                      <option value="bg-primary-subtle">Lilla / Blu</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowNoteModal(false)}
                  >
                    Annulla
                  </button>
                  <button type="submit" className="btn btn-dark fw-semibold">
                    <i className="bi bi-check-lg me-1"></i> Salva Nota
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