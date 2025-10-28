import React, { useState, useEffect } from 'react';
import { Check, Calendar, Send, Users, BookOpen, ChevronDown, ChevronUp, Clock, Sparkles, LogOut, X, AlertCircle } from 'lucide-react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function MainApp({ user, onLogout }) {
  // Estados principales
  const [currentDay, setCurrentDay] = useState('lunes');
  const [completedTasks, setCompletedTasks] = useState({});
  const [dailyReflections, setDailyReflections] = useState({});
  const [applicationCount, setApplicationCount] = useState({});
  const [contacts, setContacts] = useState({});
  const [currentWeek, setCurrentWeek] = useState(1);
  const [calendarEvents, setCalendarEvents] = useState({});
  const [taskAdjustments, setTaskAdjustments] = useState({});
  const [skippedTasks, setSkippedTasks] = useState({});
  const [movedTasks, setMovedTasks] = useState({});
  
  // Estados de UI
  const [showReflection, setShowReflection] = useState(false);
  const [showAIChallenge, setShowAIChallenge] = useState(false);
  const [expandedTaskControls, setExpandedTaskControls] = useState({});
  const [showAllData, setShowAllData] = useState(false);
  const [syncStatus, setSyncStatus] = useState('Sincronizado');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [scheduleAdjustments, setScheduleAdjustments] = useState([]);
  const [calText, setCalText] = useState('');

  const days = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

  const getWeekDayKey = (day, dataKey) => `week${currentWeek}-${day}-${dataKey}`;

  // FIREBASE SYNC
  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      try {
        setSyncStatus('Cargando...');
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCurrentDay(data.currentDay || 'lunes');
          setCompletedTasks(data.completedTasks || {});
          setDailyReflections(data.dailyReflections || {});
          setApplicationCount(data.applicationCount || {});
          setContacts(data.contacts || {});
          setCurrentWeek(data.currentWeek || 1);
          setCalendarEvents(data.calendarEvents || {});
          setTaskAdjustments(data.taskAdjustments || {});
          setSkippedTasks(data.skippedTasks || {});
          setMovedTasks(data.movedTasks || {});
        }
        setDataLoaded(true);
        setSyncStatus('Sincronizado ✓');
      } catch (err) {
        console.error(err);
        setSyncStatus('Error');
      }
    };
    loadData();
  }, [user]);

  useEffect(() => {
    if (!user || !dataLoaded) return;
    const save = async () => {
      try {
        setSyncStatus('Guardando...');
        await setDoc(doc(db, 'users', user.uid), {
          currentDay, completedTasks, dailyReflections, applicationCount, 
          contacts, currentWeek, calendarEvents, taskAdjustments, 
          skippedTasks, movedTasks, lastUpdated: new Date().toISOString()
        });
        setSyncStatus('Sincronizado ✓');
      } catch (err) {
        console.error(err);
        setSyncStatus('Error');
      }
    };
    const timer = setTimeout(save, 1000);
    return () => clearTimeout(timer);
  }, [user, dataLoaded, currentDay, completedTasks, dailyReflections, applicationCount, contacts, currentWeek, calendarEvents, taskAdjustments, skippedTasks, movedTasks]);

  // FUNCIONES
  const removeCalendarEvent = (idx) => {
    const key = getWeekDayKey(currentDay, 'calendar');
    const events = calendarEvents[key] || [];
    setCalendarEvents(prev => ({ ...prev, [key]: events.filter((_, i) => i !== idx) }));
  };

  const adjustTaskDuration = (taskIdx, increase) => {
    const task = schedule[currentDay][taskIdx];
    const key = getWeekDayKey(currentDay, `adjust-${taskIdx}`);
    const adj = taskAdjustments[key];
    const time = adj?.newTime || task.time;
    const match = time.match(/(\\d{1,2}):(\\d{2})-(\\d{1,2}):(\\d{2})/);
    if (!match) return;
    const [_, sh, sm, eh, em] = match.map((v, i) => i > 0 ? parseInt(v) : v);
    const dur = (eh - sh) * 60 + (em - sm);
    const newDur = increase ? Math.min(240, dur + 30) : Math.max(30, dur - 30);
    const newEnd = sh * 60 + sm + newDur;
    const newTime = `${sh}:${String(sm).padStart(2,'0')}-${Math.floor(newEnd/60)}:${String(newEnd%60).padStart(2,'0')}`;
    setTaskAdjustments(prev => ({ ...prev, [key]: { originalTime: task.time, newTime, adjusted: true } }));
  };

  const undoAdjustment = (taskIdx) => {
    const key = getWeekDayKey(currentDay, `adjust-${taskIdx}`);
    setTaskAdjustments(prev => {
      const n = { ...prev };
      delete n[key];
      return n;
    });
  };

  const skipTask = (taskIdx) => {
    const key = getWeekDayKey(currentDay, `skip-${taskIdx}`);
    setSkippedTasks(prev => ({ ...prev, [key]: true }));
  };

  const unskipTask = (taskIdx) => {
    const key = getWeekDayKey(currentDay, `skip-${taskIdx}`);
    setSkippedTasks(prev => {
      const n = { ...prev };
      delete n[key];
      return n;
    });
  };

  const moveTaskToNextDay = (taskIdx) => {
    const dayIdx = days.indexOf(currentDay);
    const nextDay = days[(dayIdx + 1) % days.length];
    const key = getWeekDayKey(currentDay, `move-${taskIdx}`);
    setMovedTasks(prev => ({ ...prev, [key]: { fromDay: currentDay, toDay: nextDay, taskIdx } }));
  };

  const returnMovedTask = (taskIdx, fromDay) => {
    const key = getWeekDayKey(fromDay, `move-${taskIdx}`);
    setMovedTasks(prev => {
      const n = { ...prev };
      delete n[key];
      return n;
    });
  };

  const adjustScheduleForEvents = (events) => {
    const adjustments = [];
    const tasks = schedule[currentDay];
    events.forEach(evt => {
      const eStart = evt.startHour * 60 + evt.startMin;
      const eEnd = evt.endHour * 60 + evt.endMin;
      tasks.forEach((task, idx) => {
        const match = task.time.match(/(\\d{1,2}):(\\d{2})-(\\d{1,2}):(\\d{2})/);
        if (!match) return;
        const [_, tsh, tsm, teh, tem] = match.map((v, i) => i > 0 ? parseInt(v) : v);
        const tStart = tsh * 60 + tsm;
        const tEnd = teh * 60 + tem;
        if (tStart < eEnd && tEnd > eStart) {
          adjustments.push({ taskIdx: idx, taskName: task.task, reason: `Conflicto con ${evt.title}` });
          const key = getWeekDayKey(currentDay, `adjust-${idx}`);
          const newEnd = eStart;
          const newTime = `${tsh}:${String(tsm).padStart(2,'0')}-${Math.floor(newEnd/60)}:${String(newEnd%60).padStart(2,'0')}`;
          setTaskAdjustments(prev => ({ ...prev, [key]: { originalTime: task.time, newTime, adjusted: true, autoAdjusted: true } }));
        }
      });
    });
    setScheduleAdjustments(adjustments);
  };

  const parseCalendar = () => {
    if (!calText.trim()) return;
    const lines = calText.trim().split('\\n');
    const events = [];
    lines.forEach(line => {
      const m = line.match(/(.+?)\\s+(\\d{1,2}):(\\d{2})\\s*-\\s*(\\d{1,2}):(\\d{2})/i);
      if (m) events.push({ title: m[1].trim(), startHour: parseInt(m[2]), startMin: parseInt(m[3]), endHour: parseInt(m[4]), endMin: parseInt(m[5]) });
    });
    const key = getWeekDayKey(currentDay, 'calendar');
    setCalendarEvents(prev => ({ ...prev, [key]: events }));
    adjustScheduleForEvents(events);
    setCalText('');
  };

  const toggle = (d, i) => {
    const key = getWeekDayKey(d, `task-${i}`);
    setCompletedTasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleTaskControls = (taskIdx) => {
    const key = `${currentDay}-${taskIdx}`;
    setExpandedTaskControls(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getProgress = (d) => {
    const total = schedule[d].length;
    const done = schedule[d].filter((_, i) => completedTasks[getWeekDayKey(d, `task-${i}`)]).length;
    return { done, total, pct: Math.round((done / total) * 100) };
  };

  const weekProg = () => {
    let total = 0, done = 0;
    days.forEach(d => {
      const p = getProgress(d);
      total += p.total;
      done += p.done;
    });
    return { done, total, pct: Math.round((done / total) * 100) };
  };

  const getWeekStats = () => {
    let totalApps = 0, totalContacts = 0;
    days.forEach(d => {
      const apps = applicationCount[getWeekDayKey(d, 'apps')];
      const conts = contacts[getWeekDayKey(d, 'contacts')];
      if (apps) totalApps += apps.split('\\n').filter(l => l.trim()).length;
      if (conts) totalContacts += conts.split('\\n').filter(l => l.trim()).length;
    });
    return { totalApps, totalContacts };
  };

  const exportData = () => {
    let csv = "data:text/csv;charset=utf-8,POSTULACIONES\\nSemana,Día,Postulación\\n";
    Object.entries(applicationCount).forEach(([key, apps]) => {
      if (apps?.trim()) apps.split('\\n').filter(l => l.trim()).forEach(app => { csv += `"${key}","${app}"\\n`; });
    });
    csv += "\\n\\nCONTACTOS\\nSemana,Día,Contacto\\n";
    Object.entries(contacts).forEach(([key, conts]) => {
      if (conts?.trim()) conts.split('\\n').filter(l => l.trim()).forEach(cont => { csv += `"${key}","${cont}"\\n`; });
    });
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `meta_human_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // DATOS
  const reflectionPrompts = {
    lunes: { question: "Sócrates: Si la IA puede generar respuestas convincentes, ¿qué significa realmente saber algo?", quote: '"Solo sé que no sé nada" - Sócrates' },
    martes: { question: "Kierkegaard: ¿No es en la angustia de elegir donde nos convertimos en quienes somos?", quote: '"La angustia es el vértigo de la libertad" - Kierkegaard' },
    miércoles: { question: "Heidegger: Cuando la IA optimiza todo, ¿perdemos nuestra capacidad de ser?", quote: '"La esencia de la técnica no es nada técnico" - Heidegger' },
    jueves: { question: "Derrida: ¿Qué pasa cuando los algoritmos replican nuestros prejuicios ocultos?", quote: '"No hay nada fuera del texto" - Derrida' },
    viernes: { question: "Nietzsche: ¿Qué nos hace humanos: superar límites o experimentar la lucha?", quote: '"Lo que no me mata, me hace más fuerte" - Nietzsche' },
    sábado: { question: "Deleuze: ¿Cómo usamos IA para pensar en redes sin simplificar la complejidad?", quote: '"El rizoma no tiene principio ni fin" - Deleuze' },
    domingo: { question: "Lao Tzu: ¿Seguimos el Tao de la sabiduría o el camino fácil de la tecnología?", quote: '"El camino expresado no es el Camino eterno" - Lao Tzu' }
  };

  const aiChallenges = [
    { title: "Entrenamiento de Prompts Avanzado", objective: "Dominar el arte de crear prompts efectivos", steps: ["Elige concepto complejo", "Escribe 3 prompts: vago, específico, detallado", "Compara respuestas de Claude", "Identifica qué genera mejores respuestas", "Documenta tu fórmula"] }
  ];

  const schedule = {
    lunes: [
      { time: '8:00-8:30', task: 'Rutina matinal', cat: 'bienestar' },
      { time: '8:30-10:00', task: 'Búsqueda y Postulaciones', cat: 'busqueda' },
      { time: '10:15-12:00', task: 'Job Tracker + Networking', cat: 'networking' },
      { time: '12:00-13:00', task: 'Aprendizaje', cat: 'aprendizaje' },
      { time: '15:00-16:00', task: 'Lectura', cat: 'aprendizaje' },
      { time: '16:00-17:30', task: 'Escritura Meta.human', cat: 'metahuman' }
    ],
    martes: [
      { time: '8:00-8:30', task: 'Rutina matinal', cat: 'bienestar' },
      { time: '8:30-10:00', task: 'Baobabs: Propuesta', cat: 'baobabs' },
      { time: '10:15-12:00', task: 'Baobabs: Clientes', cat: 'baobabs' },
      { time: '12:00-13:00', task: 'Aprendizaje', cat: 'aprendizaje' }
    ],
    miércoles: [
      { time: '8:00-8:30', task: 'Rutina matinal', cat: 'bienestar' },
      { time: '8:30-10:00', task: 'Búsqueda y Postulaciones', cat: 'busqueda' },
      { time: '10:15-12:00', task: 'Job Tracker + Networking', cat: 'networking' }
    ],
    jueves: [
      { time: '8:00-8:30', task: 'Rutina matinal', cat: 'bienestar' },
      { time: '8:30-10:00', task: 'Baobabs: Estrategia', cat: 'baobabs' },
      { time: '10:15-12:00', task: 'Baobabs: Materiales', cat: 'baobabs' }
    ],
    viernes: [
      { time: '8:00-10:00', task: 'Pilates', cat: 'bienestar' },
      { time: '10:15-12:00', task: 'Búsqueda y Postulaciones', cat: 'busqueda' },
      { time: '12:00-13:00', task: 'Aprendizaje', cat: 'aprendizaje' }
    ],
    sábado: [
      { time: '10:00-11:30', task: 'Aprendizaje profundo', cat: 'aprendizaje' },
      { time: '11:45-13:00', task: 'Lectura filosófica', cat: 'aprendizaje' },
      { time: '15:00-17:00', task: 'Desafío IA', cat: 'ia' }
    ],
    domingo: [
      { time: '10:30-12:00', task: 'Lectura contemplativa', cat: 'aprendizaje' },
      { time: '12:00-13:00', task: 'Escritura libre', cat: 'metahuman' },
      { time: '15:00-16:30', task: 'Planificación semanal', cat: 'planificacion' }
    ]
  };

  const colors = {
    busqueda: 'bg-blue-100 text-blue-800',
    networking: 'bg-purple-100 text-purple-800',
    baobabs: 'bg-green-100 text-green-800',
    aprendizaje: 'bg-amber-100 text-amber-800',
    metahuman: 'bg-pink-100 text-pink-800',
    bienestar: 'bg-teal-100 text-teal-800',
    planificacion: 'bg-indigo-100 text-indigo-800',
    ia: 'bg-cyan-100 text-cyan-800',
    calendario: 'bg-orange-100 text-orange-800'
  };

  const wp = weekProg();
  const weekStats = getWeekStats();
  const q = reflectionPrompts[currentDay];
  const calKey = getWeekDayKey(currentDay, 'calendar');
  const dayEvents = calendarEvents[calKey] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Meta.human</h1>
              <p className="text-gray-600">Hola, {user.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">{syncStatus}</p>
                <p className="text-xs text-green-600">☁️ Firebase</p>
              </div>
              <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800">☁️ Tus datos se sincronizan automáticamente con Firebase</p>
          </div>

          <div className="mb-4">
            <label className="text-sm font-semibold mr-2">Semana:</label>
            <select value={currentWeek} onChange={(e) => setCurrentWeek(parseInt(e.target.value))} className="px-3 py-2 border-2 rounded-lg">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(w => <option key={w} value={w}>Semana {w}</option>)}
            </select>
          </div>
          
          <div className="bg-purple-100 rounded-xl p-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold">Progreso Semanal {currentWeek}</span>
              <span className="text-sm font-bold text-purple-700">{wp.pct}%</span>
            </div>
            <div className="w-full bg-white rounded-full h-3">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: `${wp.pct}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Send className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm">Postulaciones (Semana {currentWeek})</p>
                  <p className="text-2xl font-bold">{weekStats.totalApps}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-sm">Contactos (Semana {currentWeek})</p>
                  <p className="text-2xl font-bold">{weekStats.totalContacts}</p>
                </div>
              </div>
            </div>
          </div>

          <button onClick={exportData} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold">
            📥 Exportar Datos
          </button>
        </div>

        {/* Calendario */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 mb-6">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            Sincronizar Calendario
          </h3>
          <p className="text-sm mb-2">Formato: Evento HH:MM-HH:MM</p>
          <textarea
            value={calText}
            onChange={(e) => setCalText(e.target.value)}
            placeholder="Reunión 14:00-15:00&#10;Dentista 16:30-17:00"
            className="w-full p-3 border-2 rounded-lg mb-3"
            rows="3"
          />
          <button onClick={parseCalendar} className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold">
            📅 Agregar Eventos
          </button>
        </div>

        {/* Notificaciones de ajustes */}
        {scheduleAdjustments.length > 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <h3 className="font-bold text-yellow-900 mb-2">⚠️ Ajustes Automáticos</h3>
                <p className="text-sm text-yellow-800 mb-2">
                  Se ajustaron {scheduleAdjustments.length} tarea(s):
                </p>
                <ul className="space-y-1">
                  {scheduleAdjustments.map((adj, i) => (
                    <li key={i} className="text-sm text-yellow-700">• <strong>{adj.taskName}</strong>: {adj.reason}</li>
                  ))}
                </ul>
                <button onClick={() => setScheduleAdjustments([])} className="mt-3 text-xs bg-yellow-600 text-white px-3 py-1 rounded-full">
                  Entendido
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Days */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="grid grid-cols-7 gap-2">
            {days.map(d => {
              const p = getProgress(d);
              return (
                <button key={d} onClick={() => setCurrentDay(d)} className={`p-2 rounded-xl text-xs font-semibold ${currentDay === d ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>
                  <div className="capitalize">{d.slice(0,3)}</div>
                  <div className="mt-1">{p.done}/{p.total}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input diario */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold mb-4">Postulaciones hoy</h3>
            <textarea
              value={applicationCount[getWeekDayKey(currentDay, 'apps')] || ''}
              onChange={(e) => setApplicationCount(prev => ({...prev, [getWeekDayKey(currentDay, 'apps')]: e.target.value}))}
              className="w-full p-3 border-2 rounded-lg"
              rows="3"
              placeholder="Product Manager - Empresa ABC"
            />
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold mb-4">Contactos hoy</h3>
            <textarea
              value={contacts[getWeekDayKey(currentDay, 'contacts')] || ''}
              onChange={(e) => setContacts(prev => ({...prev, [getWeekDayKey(currentDay, 'contacts')]: e.target.value}))}
              className="w-full p-3 border-2 rounded-lg"
              rows="3"
              placeholder="María López - LinkedIn"
            />
          </div>
        </div>

        {/* Reflexión */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6 mb-6">
          <button onClick={() => setShowReflection(!showReflection)} className="w-full flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Reflexión Filosófica
            </h3>
            {showReflection ? <ChevronUp /> : <ChevronDown />}
          </button>
          {showReflection && (
            <>
              <p className="text-sm italic mb-2">{q.quote}</p>
              <p className="font-medium mb-4">{q.question}</p>
              <textarea
                value={dailyReflections[getWeekDayKey(currentDay, 'reflection')] || ''}
                onChange={(e) => setDailyReflections(prev => ({...prev, [getWeekDayKey(currentDay, 'reflection')]: e.target.value}))}
                className="w-full p-3 border-2 rounded-lg"
                rows="4"
                placeholder="Tu reflexión..."
              />
            </>
          )}
        </div>

        {/* Desafío IA */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-6 mb-6">
          <button onClick={() => setShowAIChallenge(!showAIChallenge)} className="w-full flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Desafío IA Semanal
            </h3>
            {showAIChallenge ? <ChevronUp /> : <ChevronDown />}
          </button>
          {showAIChallenge && aiChallenges[0] && (
            <>
              <h4 className="font-bold mb-2">{aiChallenges[0].title}</h4>
              <p className="text-sm mb-3">Objetivo: {aiChallenges[0].objective}</p>
              <ul className="space-y-2">
                {aiChallenges[0].steps.map((step, i) => (
                  <li key={i} className="text-sm">✓ {step}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 capitalize flex items-center gap-2">
            <Clock className="w-7 h-7 text-purple-600" />
            {currentDay} - Semana {currentWeek}
          </h2>
          <div className="space-y-3">
            {/* Eventos del calendario */}
            {dayEvents.map((evt, i) => (
              <div key={`cal-${i}`} className={`border-2 rounded-xl p-4 ${colors.calendario} ring-2 ring-orange-400`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-semibold">{evt.startHour}:{String(evt.startMin).padStart(2,'0')}-{evt.endHour}:{String(evt.endMin).padStart(2,'0')}</span>
                      <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">📅 Calendario</span>
                    </div>
                    <p className="font-medium">{evt.title}</p>
                  </div>
                  <button onClick={() => removeCalendarEvent(i)} className="ml-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {/* Tareas del día */}
            {schedule[currentDay].map((item, i) => {
              const taskKey = getWeekDayKey(currentDay, `task-${i}`);
              const adjustKey = getWeekDayKey(currentDay, `adjust-${i}`);
              const skipKey = getWeekDayKey(currentDay, `skip-${i}`);
              const moveKey = getWeekDayKey(currentDay, `move-${i}`);
              const done = completedTasks[taskKey];
              const adjustment = taskAdjustments[adjustKey];
              const skipped = skippedTasks[skipKey];
              const moved = movedTasks[moveKey];
              const displayTime = adjustment?.newTime || item.time;
              
              if (moved) return null;
              
              return (
                <div key={i} className={`border-2 rounded-xl p-4 ${colors[item.cat]} ${done ? 'opacity-60' : ''} ${skipped ? 'opacity-40' : ''}`}>
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggle(currentDay, i)} className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${done ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}>
                      {done && <Check className="w-4 h-4 text-white" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-semibold">{displayTime}</span>
                        {adjustment && <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">✂️ Ajustado</span>}
                        {skipped && <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">❌ Cancelado</span>}
                      </div>
                      <p className={`${done || skipped ? 'line-through' : 'font-medium'}`}>{item.task}</p>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        {skipped ? (
                          <button onClick={() => unskipTask(i)} className="text-xs bg-gray-400 text-white px-3 py-1 rounded-full">
                            ↩️ Deshacer
                          </button>
                        ) : adjustment ? (
                          <button onClick={() => undoAdjustment(i)} className="text-xs bg-gray-400 text-white px-3 py-1 rounded-full">
                            ↩️ Restaurar
                          </button>
                        ) : (
                          <>
                            <button onClick={() => toggleTaskControls(i)} className="text-xs text-gray-600 font-semibold mb-2">
                              {expandedTaskControls[`${currentDay}-${i}`] ? '▼' : '▶'} Ajustar
                            </button>
                            
                            {expandedTaskControls[`${currentDay}-${i}`] && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                <button onClick={() => adjustTaskDuration(i, false)} className="text-xs bg-purple-500 text-white px-3 py-1 rounded-full">
                                  ➖ Reducir 30min
                                </button>
                                <button onClick={() => adjustTaskDuration(i, true)} className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">
                                  ➕ Aumentar 30min
                                </button>
                                <button onClick={() => skipTask(i)} className="text-xs bg-red-500 text-white px-3 py-1 rounded-full">
                                  ❌ Cancelar
                                </button>
                                <button onClick={() => moveTaskToNextDay(i)} className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">
                                  ➡️ Mover
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ver todos los datos */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
          <button onClick={() => setShowAllData(!showAllData)} className="w-full flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">📊 Ver Todos los Datos</h3>
            {showAllData ? <ChevronUp /> : <ChevronDown />}
          </button>
          {showAllData && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold mb-2">Postulaciones por día:</h4>
                {days.map(d => {
                  const apps = applicationCount[getWeekDayKey(d, 'apps')];
                  if (!apps) return null;
                  return (
                    <div key={d} className="mb-2">
                      <p className="font-semibold capitalize">{d}:</p>
                      <p className="text-sm whitespace-pre-wrap">{apps}</p>
                    </div>
                  );
                })}
              </div>
              <div>
                <h4 className="font-bold mb-2">Contactos por día:</h4>
                {days.map(d => {
                  const conts = contacts[getWeekDayKey(d, 'contacts')];
                  if (!conts) return null;
                  return (
                    <div key={d} className="mb-2">
                      <p className="font-semibold capitalize">{d}:</p>
                      <p className="text-sm whitespace-pre-wrap">{conts}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default MainApp;
