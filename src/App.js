import React, { useState, useEffect } from 'react';
import { Check, Calendar, Send, Users, BookOpen, ChevronDown, ChevronUp, Clock, Sparkles } from 'lucide-react';

function App() {
  const load = (key, def) => {
    try {
      const saved = localStorage.getItem(`meta_${key}`);
      return saved ? JSON.parse(saved) : def;
    } catch { return def; }
  };

  const [day, setDay] = useState(() => load('day', 'lunes'));
  const [tasks, setTasks] = useState(() => load('tasks', {}));
  const [reflections, setReflections] = useState(() => load('reflections', {}));
  const [apps, setApps] = useState(() => load('apps', {}));
  const [contacts, setContacts] = useState(() => load('contacts', {}));
  const [week, setWeek] = useState(() => load('week', 1));
  const [calEvents, setCalEvents] = useState(() => load('calEvents', {}));
  const [showRef, setShowRef] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showData, setShowData] = useState(false);
  const [calText, setCalText] = useState('');

  const days = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

  useEffect(() => { localStorage.setItem('meta_day', JSON.stringify(day)); }, [day]);
  useEffect(() => { localStorage.setItem('meta_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('meta_reflections', JSON.stringify(reflections)); }, [reflections]);
  useEffect(() => { localStorage.setItem('meta_apps', JSON.stringify(apps)); }, [apps]);
  useEffect(() => { localStorage.setItem('meta_contacts', JSON.stringify(contacts)); }, [contacts]);
  useEffect(() => { localStorage.setItem('meta_week', JSON.stringify(week)); }, [week]);
  useEffect(() => { localStorage.setItem('meta_calEvents', JSON.stringify(calEvents)); }, [calEvents]);

  const questions = {
    lunes: { q: "Sócrates: Si la IA puede generar respuestas convincentes, ¿qué significa realmente saber algo?", c: "Solo sé que no sé nada - Sócrates" },
    martes: { q: "Kierkegaard: ¿No es en la angustia de elegir donde nos convertimos en quienes somos?", c: "La angustia es el vértigo de la libertad - Kierkegaard" },
    miércoles: { q: "Heidegger: Cuando la IA optimiza todo, ¿perdemos nuestra capacidad de ser?", c: "La esencia de la técnica no es nada técnico - Heidegger" },
    jueves: { q: "Derrida: ¿Qué pasa cuando los algoritmos replican nuestros prejuicios ocultos?", c: "No hay nada fuera del texto - Derrida" },
    viernes: { q: "Nietzsche: ¿Qué nos hace humanos: superar límites o experimentar la lucha?", c: "Lo que no me mata, me hace más fuerte - Nietzsche" },
    sábado: { q: "Deleuze: ¿Cómo usamos IA para pensar en redes sin simplificar la complejidad?", c: "El rizoma no tiene principio ni fin - Deleuze" },
    domingo: { q: "Lao Tzu: ¿Seguimos el Tao de la sabiduría o el camino fácil de la tecnología?", c: "El camino expresado no es el Camino eterno - Lao Tzu" }
  };

  const schedule = {
    lunes: [
      { time: '8:00-8:30', task: 'Rutina matinal', cat: 'bienestar' },
      { time: '8:30-10:00', task: 'Búsqueda y Postulaciones', cat: 'busqueda' },
      { time: '10:15-12:00', task: 'Job Tracker + Networking', cat: 'networking' },
      { time: '12:00-13:00', task: 'Aprendizaje', cat: 'aprendizaje' }
    ],
    martes: [
      { time: '8:00-8:30', task: 'Rutina matinal', cat: 'bienestar' },
      { time: '8:30-10:00', task: 'Baobabs: Propuesta', cat: 'baobabs' },
      { time: '10:15-12:00', task: 'Baobabs: Clientes', cat: 'baobabs' }
    ],
    miércoles: [
      { time: '8:00-8:30', task: 'Rutina matinal', cat: 'bienestar' },
      { time: '8:30-10:00', task: 'Búsqueda y Postulaciones', cat: 'busqueda' }
    ],
    jueves: [
      { time: '8:00-8:30', task: 'Rutina matinal', cat: 'bienestar' },
      { time: '8:30-10:00', task: 'Baobabs: Estrategia', cat: 'baobabs' }
    ],
    viernes: [
      { time: '8:00-10:00', task: 'Pilates', cat: 'bienestar' },
      { time: '10:15-12:00', task: 'Búsqueda y Postulaciones', cat: 'busqueda' }
    ],
    sábado: [
      { time: '10:00-11:30', task: 'Aprendizaje profundo', cat: 'aprendizaje' },
      { time: '15:00-17:00', task: 'Desafío IA', cat: 'ia' }
    ],
    domingo: [
      { time: '10:30-12:00', task: 'Lectura contemplativa', cat: 'aprendizaje' },
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

  const parseCalendar = () => {
    if (!calText.trim()) return;
    const lines = calText.trim().split('\n');
    const events = [];
    lines.forEach(line => {
      const match = line.match(/(.+?)\s+(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/i);
      if (match) {
        events.push({
          title: match[1].trim(),
          startHour: parseInt(match[2]),
          startMin: parseInt(match[3]),
          endHour: parseInt(match[4]),
          endMin: parseInt(match[5])
        });
      }
    });
    setCalEvents(prev => ({ ...prev, [day]: events }));
    setCalText('');
  };

  const toggle = (d, i) => {
    const key = `${d}-${i}`;
    setTasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getProgress = (d) => {
    const total = schedule[d].length;
    const done = schedule[d].filter((_, i) => tasks[`${d}-${i}`]).length;
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

  const q = questions[day];
  const wp = weekProg();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Meta.human</h1>
              <p className="text-gray-600">Mi plan de crecimiento</p>
            </div>
            <Calendar className="w-12 h-12 text-purple-600" />
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-green-800">💾 Guardado automático</p>
          </div>

          <div className="mb-4">
            <label className="text-sm font-semibold mr-2">Semana:</label>
            <select value={week} onChange={(e) => setWeek(parseInt(e.target.value))} className="px-3 py-2 border-2 rounded-lg">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(w => <option key={w} value={w}>Semana {w}</option>)}
            </select>
          </div>
          
          <div className="bg-purple-100 rounded-xl p-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold">Progreso</span>
              <span className="text-sm font-bold text-purple-700">{wp.pct}%</span>
            </div>
            <div className="w-full bg-white rounded-full h-3">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: `${wp.pct}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Send className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm">Postulaciones</p>
                  <p className="text-2xl font-bold">
                    {Object.values(apps).reduce((t, v) => t + (v ? v.split('\n').filter(l => l.trim()).length : 0), 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-sm">Contactos</p>
                  <p className="text-2xl font-bold">
                    {Object.values(contacts).reduce((t, v) => t + (v ? v.split('\n').filter(l => l.trim()).length : 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="grid grid-cols-7 gap-2">
            {days.map(d => {
              const p = getProgress(d);
              return (
                <button key={d} onClick={() => setDay(d)} className={`p-2 rounded-xl text-xs font-semibold ${day === d ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>
                  <div className="capitalize">{d.slice(0,3)}</div>
                  <div className="mt-1">{p.done}/{p.total}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold mb-4">Postulaciones hoy</h3>
            <textarea
              value={apps[day] || ''}
              onChange={(e) => setApps(prev => ({...prev, [day]: e.target.value}))}
              className="w-full p-3 border-2 rounded-lg"
              rows="3"
              placeholder="Product Manager - Empresa ABC"
            />
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold mb-4">Contactos hoy</h3>
            <textarea
              value={contacts[day] || ''}
              onChange={(e) => setContacts(prev => ({...prev, [day]: e.target.value}))}
              className="w-full p-3 border-2 rounded-lg"
              rows="3"
              placeholder="María López - LinkedIn"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 capitalize">{day}</h2>
          <div className="space-y-3">
            {(calEvents[day] || []).map((evt, i) => (
              <div key={`cal-${i}`} className={`border-2 rounded-xl p-4 ${colors.calendario}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-semibold">{evt.startHour}:{String(evt.startMin).padStart(2,'0')}-{evt.endHour}:{String(evt.endMin).padStart(2,'0')}</span>
                </div>
                <p className="font-medium">{evt.title}</p>
              </div>
            ))}
            {schedule[day].map((item, i) => {
              const done = tasks[`${day}-${i}`];
              return (
                <div key={i} className={`border-2 rounded-xl p-4 ${colors[item.cat]} ${done ? 'opacity-60' : ''}`}>
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggle(day, i)} className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${done ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}>
                      {done && <Check className="w-4 h-4 text-white" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-semibold">{item.time}</span>
                      </div>
                      <p className={done ? 'line-through' : 'font-medium'}>{item.task}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
