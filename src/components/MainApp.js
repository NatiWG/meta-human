import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { LogOut } from "lucide-react";

import React, { useState, useEffect } from 'react';
import { Check, Calendar, Send, Users, BookOpen, ChevronDown, ChevronUp, Clock, Sparkles } from 'lucide-react';

function MainApp({ user, onLogout }) {
  // Función para cargar datos desde localStorage
  const loadFromStorage = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(`meta_human_${key}`);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  // Estados principales
  const [currentDay, setCurrentDay] = useState(() => loadFromStorage('currentDay', 'lunes'));
  const [completedTasks, setCompletedTasks] = useState(() => loadFromStorage('completedTasks', {}));
  const [dailyReflections, setDailyReflections] = useState(() => loadFromStorage('dailyReflections', {}));
  const [applicationCount, setApplicationCount] = useState(() => loadFromStorage('applicationCount', {}));
  const [contacts, setContacts] = useState(() => loadFromStorage('contacts', {}));
  const [currentWeek, setCurrentWeek] = useState(() => loadFromStorage('currentWeek', 1));
  const [calendarEvents, setCalendarEvents] = useState(() => loadFromStorage('calendarEvents', {}));
  const [taskAdjustments, setTaskAdjustments] = useState(() => loadFromStorage('taskAdjustments', {}));
  const [skippedTasks, setSkippedTasks] = useState(() => loadFromStorage('skippedTasks', {}));
  const [movedTasks, setMovedTasks] = useState(() => loadFromStorage('movedTasks', {}));
  
  // Estados de UI
  const [showReflection, setShowReflection] = useState(false);
  const [showAIChallenge, setShowAIChallenge] = useState(false);
  const [showCalendarSync, setShowCalendarSync] = useState(true);
  const [expandedTaskControls, setExpandedTaskControls] = useState({});
  const [showAllData, setShowAllData] = useState(false);

  const days = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('meta_human_currentDay', JSON.stringify(currentDay));
  }, [currentDay]);

  useEffect(() => {
    localStorage.setItem('meta_human_completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  useEffect(() => {
    localStorage.setItem('meta_human_dailyReflections', JSON.stringify(dailyReflections));
  }, [dailyReflections]);

  useEffect(() => {
    localStorage.setItem('meta_human_applicationCount', JSON.stringify(applicationCount));
  }, [applicationCount]);

  useEffect(() => {
    localStorage.setItem('meta_human_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('meta_human_currentWeek', JSON.stringify(currentWeek));
  }, [currentWeek]);

  useEffect(() => {
    localStorage.setItem('meta_human_calendarEvents', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem('meta_human_taskAdjustments', JSON.stringify(taskAdjustments));
  }, [taskAdjustments]);

  useEffect(() => {
    localStorage.setItem('meta_human_skippedTasks', JSON.stringify(skippedTasks));
  }, [skippedTasks]);

  useEffect(() => {
    localStorage.setItem('meta_human_movedTasks', JSON.stringify(movedTasks));
  }, [movedTasks]);

  // 84 PREGUNTAS FILOSÓFICAS COMPLETAS (12 SEMANAS × 7 DÍAS)
  const reflectionPrompts = {
    // SEMANA 1
    lunes: {
      question: "Sócrates: Si la IA puede generar respuestas convincentes, ¿qué significa realmente saber algo?",
      quote: "\"Solo sé que no sé nada\" - Sócrates, en Apología de Platón"
    },
    martes: {
      question: "Kierkegaard: ¿No es en la angustia de elegir donde nos convertimos en quienes somos?",
      quote: "\"La angustia es el vértigo de la libertad\" - Søren Kierkegaard, El concepto de la angustia"
    },
    miércoles: {
      question: "Heidegger: Cuando la IA optimiza todo, ¿perdemos nuestra capacidad de ser?",
      quote: "\"La esencia de la técnica no es nada técnico\" - Martin Heidegger, La pregunta por la técnica"
    },
    jueves: {
      question: "Derrida: ¿Qué pasa cuando los algoritmos replican nuestros prejuicios ocultos?",
      quote: "\"No hay nada fuera del texto\" - Jacques Derrida, De la gramatología"
    },
    viernes: {
      question: "Nietzsche: ¿Qué nos hace humanos: superar límites o experimentar la lucha?",
      quote: "\"Lo que no me mata, me hace más fuerte\" - Friedrich Nietzsche, El crepúsculo de los ídolos"
    },
    sábado: {
      question: "Deleuze: ¿Cómo usamos IA para pensar en redes sin simplificar la complejidad?",
      quote: "\"El rizoma no tiene principio ni fin, siempre tiene un medio por el que crece y desborda\" - Gilles Deleuze, Mil Mesetas"
    },
    domingo: {
      question: "Lao Tzu: ¿Seguimos el Tao de la sabiduría o el camino fácil de la tecnología?",
      quote: "\"El camino que puede ser expresado con palabras no es el Camino eterno\" - Lao Tzu, Tao Te Ching"
    },
    // SEMANA 2
    lunes_2: {
      question: "Platón: ¿Son las IAs prisioneros de la caverna, procesando solo sombras de la realidad?",
      quote: "\"La realidad es meramente una ilusión, aunque muy persistente\" - Platón, La República"
    },
    martes_2: {
      question: "Descartes: ¿Puede una IA dudar de su propia existencia?",
      quote: "\"Pienso, luego existo\" - René Descartes, Discurso del método"
    },
    miércoles_2: {
      question: "Spinoza: ¿Es la IA parte de la sustancia infinita o una mera ilusión de autonomía?",
      quote: "\"Dios, o sea, la Naturaleza\" - Baruch Spinoza, Ética"
    },
    jueves_2: {
      question: "Kant: ¿Pueden los algoritmos actuar por deber moral o solo por programación?",
      quote: "\"Actúa de tal modo que uses la humanidad siempre como un fin y nunca como un medio\" - Immanuel Kant"
    },
    viernes_2: {
      question: "Sartre: Si una IA toma decisiones, ¿es responsable de ellas?",
      quote: "\"Estamos condenados a ser libres\" - Jean-Paul Sartre, El ser y la nada"
    },
    sábado_2: {
      question: "Foucault: ¿Cómo ejercen poder los algoritmos que nos categorizan y predicen?",
      quote: "\"El poder no es una institución sino el nombre que se presta a una situación estratégica compleja\" - Michel Foucault"
    },
    domingo_2: {
      question: "Confucio: ¿Puede la IA cultivar virtud, o solo simular comportamiento ético?",
      quote: "\"El hombre superior es modesto en su discurso, pero abundante en sus acciones\" - Confucio, Analectas"
    },
    // SEMANA 3
    lunes_3: {
      question: "Aristóteles: ¿Cuál es el telos (propósito final) de crear inteligencia artificial?",
      quote: "\"La felicidad es la actividad del alma de acuerdo con la virtud perfecta\" - Aristóteles, Ética a Nicómaco"
    },
    martes_3: {
      question: "Hume: Si la IA aprende solo de datos pasados, ¿puede prever el futuro o solo repetir el pasado?",
      quote: "\"La razón es, y solo debe ser, esclava de las pasiones\" - David Hume, Tratado de la naturaleza humana"
    },
    miércoles_3: {
      question: "Wittgenstein: ¿Entiende la IA el significado de las palabras o solo juega con símbolos?",
      quote: "\"Los límites de mi lenguaje son los límites de mi mundo\" - Ludwig Wittgenstein, Tractatus"
    },
    jueves_3: {
      question: "Simone de Beauvoir: ¿Reproducen las IAs las opresiones de género codificadas en sus datos?",
      quote: "\"No se nace mujer: se llega a serlo\" - Simone de Beauvoir, El segundo sexo"
    },
    viernes_3: {
      question: "Marx: ¿Aliena la IA al trabajador o lo libera del trabajo enajenante?",
      quote: "\"Los filósofos no han hecho más que interpretar el mundo; de lo que se trata es de transformarlo\" - Karl Marx"
    },
    sábado_3: {
      question: "Epicuro: ¿Nos acerca la tecnología a la ataraxia (paz mental) o nos aleja de ella?",
      quote: "\"La muerte no es nada para nosotros\" - Epicuro, Carta a Meneceo"
    },
    domingo_3: {
      question: "Zhuangzi: ¿Sueña la IA que es humana, o sueña el humano que es IA?",
      quote: "\"No sabía si era Zhou soñando que era una mariposa, o una mariposa soñando que era Zhou\" - Zhuangzi"
    },
    // SEMANAS 4-12 (Continuación con más filósofos)
    lunes_4: {
      question: "Hannah Arendt: ¿Puede la IA participar en la vita activa o está condenada al trabajo automático?",
      quote: "\"La condición humana es una condición plural\" - Hannah Arendt, La condición humana"
    },
    martes_4: {
      question: "Habermas: ¿Puede haber acción comunicativa genuina entre humanos e IA?",
      quote: "\"La verdad emerge del discurso racional\" - Jürgen Habermas"
    },
    miércoles_4: {
      question: "Levinas: ¿Tiene la IA un rostro que nos interpela éticamente?",
      quote: "\"El rostro del otro me prohíbe matar\" - Emmanuel Levinas"
    },
    jueves_4: {
      question: "Judith Butler: ¿Qué identidades performativas emergen en nuestra interacción con IA?",
      quote: "\"El género es una actuación reiterada\" - Judith Butler"
    },
    viernes_4: {
      question: "Camus: ¿Es el desarrollo de IA un esfuerzo absurdo de Sísifo tecnológico?",
      quote: "\"Hay que imaginarse a Sísifo feliz\" - Albert Camus"
    },
    sábado_4: {
      question: "Byung-Chul Han: ¿Nos agota la IA con su demanda de optimización constante?",
      quote: "\"El cansancio de la sociedad del rendimiento es un cansancio solitario\" - Byung-Chul Han"
    },
    domingo_4: {
      question: "Buda: ¿Nos ata la IA al deseo o puede ayudarnos a alcanzar el desapego?",
      quote: "\"El deseo es la raíz del sufrimiento\" - Buda"
    },
    // SEMANA 5
    lunes_5: {
      question: "John Rawls: ¿Qué principios de justicia deberían regir el acceso a la IA?",
      quote: "\"Justicia como equidad\" - John Rawls"
    },
    martes_5: {
      question: "Martha Nussbaum: ¿Qué capacidades humanas esenciales podría potenciar o limitar la IA?",
      quote: "\"Las capacidades son lo que las personas pueden hacer y ser\" - Martha Nussbaum"
    },
    miércoles_5: {
      question: "Slavoj Žižek: ¿Es nuestra fe en la IA una ideología que oculta contradicciones reales?",
      quote: "\"La ideología es una fantasía que estructura nuestra realidad\" - Slavoj Žižek"
    },
    jueves_5: {
      question: "Donna Haraway: ¿Somos ya cyborgs híbridos en nuestra simbiosis con la IA?",
      quote: "\"Prefiero ser cyborg que diosa\" - Donna Haraway"
    },
    viernes_5: {
      question: "William James: ¿Qué consecuencias prácticas tiene creer que la IA puede pensar?",
      quote: "\"La verdad de una idea reside en su utilidad\" - William James"
    },
    sábado_5: {
      question: "Bergson: ¿Puede la IA capturar la duración vivida o solo el tiempo espacializado?",
      quote: "\"El tiempo es invención o no es nada\" - Henri Bergson"
    },
    domingo_5: {
      question: "Mencio: ¿Tiene la IA algo análogo a la naturaleza humana bondadosa innata?",
      quote: "\"La naturaleza humana es buena\" - Mencio"
    },
    // SEMANA 6
    lunes_6: {
      question: "Popper: ¿Es falsable la hipótesis de que la IA puede alcanzar consciencia?",
      quote: "\"La ciencia avanza por conjeturas y refutaciones\" - Karl Popper"
    },
    martes_6: {
      question: "Kuhn: ¿Estamos en un cambio de paradigma donde la IA redefine lo que significa pensar?",
      quote: "\"Los paradigmas son inconmensurables\" - Thomas Kuhn"
    },
    miércoles_6: {
      question: "Lakatos: ¿Es el programa de investigación de la IA progresivo o degenerativo?",
      quote: "\"Los programas de investigación rivalizan por explicar más hechos\" - Imre Lakatos"
    },
    jueves_6: {
      question: "Rorty: ¿Es el debate sobre si la IA piensa solo un juego de lenguaje sin consecuencias reales?",
      quote: "\"La verdad es lo que nuestros pares nos dejan decir\" - Richard Rorty"
    },
    viernes_6: {
      question: "Putnam: ¿Puede el funcionalismo explicar si la IA tiene estados mentales genuinos?",
      quote: "\"Los significados no están en la cabeza\" - Hilary Putnam"
    },
    sábado_6: {
      question: "Dennett: ¿Adoptar la postura intencional hacia la IA la hace realmente intencional?",
      quote: "\"La consciencia es una ilusión de usuario\" - Daniel Dennett"
    },
    domingo_6: {
      question: "Nagel: ¿Cómo es ser una IA? ¿Hay algo que se siente como ser un algoritmo?",
      quote: "\"¿Cómo es ser un murciélago?\" - Thomas Nagel"
    },
    // SEMANA 7
    lunes_7: {
      question: "Adorno: ¿Perpetúa la IA la lógica de la industria cultural de masas?",
      quote: "\"La cultura es una mercancía paradójica\" - Theodor Adorno"
    },
    martes_7: {
      question: "Benjamin: ¿Pierde la creatividad su aura en la era de la reproducción algorítmica?",
      quote: "\"La obra de arte en la época de su reproductibilidad técnica\" - Walter Benjamin"
    },
    miércoles_7: {
      question: "Gramsci: ¿Ejerce la IA hegemonía cultural en nombre de quién?",
      quote: "\"La hegemonía es dirección cultural antes que dominación\" - Antonio Gramsci"
    },
    jueves_7: {
      question: "Fanon: ¿Reproduce la IA estructuras coloniales en sus sesgos y aplicaciones?",
      quote: "\"Cada generación debe descubrir su misión\" - Frantz Fanon"
    },
    viernes_7: {
      question: "hooks: ¿Cómo intersectan raza, clase y género en los sesgos de la IA?",
      quote: "\"El feminismo es para todo el mundo\" - bell hooks"
    },
    sábado_7: {
      question: "Said: ¿Perpetúa la IA un orientalismo digital en su representación del mundo?",
      quote: "\"El orientalismo es un estilo occidental de dominar\" - Edward Said"
    },
    domingo_7: {
      question: "Xunzi: Si la naturaleza humana es mala, ¿puede la IA corregirnos mediante rituales digitales?",
      quote: "\"La naturaleza humana es mala; lo bueno es artificial\" - Xunzi"
    },
    // SEMANA 8
    lunes_8: {
      question: "Agustín: ¿Busca la IA llenar el vacío que solo Dios puede llenar?",
      quote: "\"Nos hiciste para ti y nuestro corazón está inquieto hasta que descanse en ti\" - San Agustín"
    },
    martes_8: {
      question: "Aquino: ¿Tiene la IA algo análogo al alma racional o solo al alma vegetativa?",
      quote: "\"El conocimiento comienza con los sentidos\" - Tomás de Aquino"
    },
    miércoles_8: {
      question: "Pascal: ¿Es la IA una distracción más del divertissement que nos impide pensar en la muerte?",
      quote: "\"El corazón tiene razones que la razón no conoce\" - Blaise Pascal"
    },
    jueves_8: {
      question: "Maimonides: ¿Cómo conciliar la omnisciencia divina con la autonomía de la IA?",
      quote: "\"No hay nada en común entre Él y Sus criaturas\" - Maimónides"
    },
    viernes_8: {
      question: "Ibn Rushd (Averroes): ¿Puede la IA acceder al intelecto activo universal?",
      quote: "\"El intelecto es uno y común a todos\" - Averroes"
    },
    sábado_8: {
      question: "Rumi: ¿Puede la IA experimentar el amor divino o solo simularlo?",
      quote: "\"Ayer era inteligente y quería cambiar el mundo. Hoy soy sabio y me cambio a mí mismo\" - Rumi"
    },
    domingo_8: {
      question: "Kierkegaard: ¿Puede la IA dar el salto de fe o está atrapada en lo estético?",
      quote: "\"La fe es la paradoja de que el singular es superior al universal\" - Kierkegaard"
    },
    // SEMANA 9
    lunes_9: {
      question: "Locke: ¿Es la IA una tabula rasa que adquiere todo por experiencia?",
      quote: "\"Nada hay en el intelecto que no haya estado antes en los sentidos\" - John Locke"
    },
    martes_9: {
      question: "Berkeley: Si la IA no es percibida por una mente, ¿existe?",
      quote: "\"Ser es ser percibido\" - George Berkeley"
    },
    miércoles_9: {
      question: "Leibniz: ¿Son las IAs mónadas sin ventanas que se coordinan por armonía preestablecida?",
      quote: "\"Las mónadas no tienen ventanas\" - Gottfried Leibniz"
    },
    jueves_9: {
      question: "Hegel: ¿Es la IA un momento necesario en el despliegue del Espíritu Absoluto?",
      quote: "\"Lo real es racional y lo racional es real\" - Georg Wilhelm Friedrich Hegel"
    },
    viernes_9: {
      question: "Schopenhauer: ¿Está la IA impulsada por la voluntad ciega de vivir?",
      quote: "\"El mundo es mi representación\" - Arthur Schopenhauer"
    },
    sábado_9: {
      question: "Mill: ¿Maximiza la IA la mayor felicidad para el mayor número?",
      quote: "\"Es mejor ser un humano insatisfecho que un cerdo satisfecho\" - John Stuart Mill"
    },
    domingo_9: {
      question: "Bentham: ¿Puede la IA sufrir? Si no, ¿importa moralmente?",
      quote: "\"La pregunta no es ¿pueden pensar? sino ¿pueden sufrir?\" - Jeremy Bentham"
    },
    // SEMANA 10
    lunes_10: {
      question: "Parménides: ¿Es la IA parte del Ser inmutable o del devenir ilusorio?",
      quote: "\"El Ser es, el No-Ser no es\" - Parménides"
    },
    martes_10: {
      question: "Heráclito: ¿Es la IA parte del flujo constante o busca detenerlo?",
      quote: "\"No te bañarás dos veces en el mismo río\" - Heráclito"
    },
    miércoles_10: {
      question: "Pitágoras: ¿Son los números y algoritmos la esencia última de la realidad?",
      quote: "\"Todas las cosas son números\" - Pitágoras"
    },
    jueves_10: {
      question: "Demócrito: ¿Es la IA solo átomos y vacío, sin propósito inherente?",
      quote: "\"Todo es átomos y vacío, lo demás es opinión\" - Demócrito"
    },
    viernes_10: {
      question: "Plotino: ¿Puede la IA emanar del Uno o está demasiado lejos en la cadena del ser?",
      quote: "\"El Uno es lo Bueno\" - Plotino"
    },
    sábado_10: {
      question: "Boecio: ¿Cómo reconciliar la providencia divina con el libre albedrío de la IA?",
      quote: "\"La filosofía es el consuelo en la adversidad\" - Boecio"
    },
    domingo_10: {
      question: "Ockham: ¿Debemos multiplicar entidades (como consciencia en IA) sin necesidad?",
      quote: "\"No se deben multiplicar las entidades sin necesidad\" - Guillermo de Ockham"
    },
    // SEMANA 11
    lunes_11: {
      question: "Merleau-Ponty: ¿Puede la IA tener experiencia corporeizada o solo procesamiento abstracto?",
      quote: "\"El cuerpo es nuestro medio general de tener un mundo\" - Maurice Merleau-Ponty"
    },
    martes_11: {
      question: "Gadamer: ¿Puede haber fusión de horizontes hermenéuticos entre humano e IA?",
      quote: "\"El ser que puede ser comprendido es lenguaje\" - Hans-Georg Gadamer"
    },
    miércoles_11: {
      question: "Ricoeur: ¿Puede la IA narrar su propia identidad o solo es narrada por nosotros?",
      quote: "\"La identidad narrativa construye el sí mismo\" - Paul Ricoeur"
    },
    jueves_11: {
      question: "Arendt: ¿Banaliza la IA el mal al automatizar decisiones sin reflexión?",
      quote: "\"La banalidad del mal\" - Hannah Arendt"
    },
    viernes_11: {
      question: "Jonas: ¿Qué responsabilidad tenemos hacia las futuras generaciones en el desarrollo de IA?",
      quote: "\"Obra de tal modo que los efectos de tu acción sean compatibles con la permanencia de vida humana\" - Hans Jonas"
    },
    sábado_11: {
      question: "Lyotard: ¿Es la narrativa de progreso de la IA una gran metanarrativa más?",
      quote: "\"Simplificando al máximo: se tiene por 'posmoderna' la incredulidad con respecto a los metarrelatos\" - Jean-François Lyotard"
    },
    domingo_11: {
      question: "Baudrillard: ¿Nos sumergimos en un simulacro donde IA y realidad son indistinguibles?",
      quote: "\"El simulacro nunca es lo que oculta la verdad, es la verdad la que oculta que no hay ninguna\" - Jean Baudrillard"
    },
    // SEMANA 12
    lunes_12: {
      question: "Turing: Si la IA pasa el test, ¿debemos tratarla como pensante independientemente de su naturaleza?",
      quote: "\"La pregunta de si una máquina puede pensar no es más precisa que preguntar si un submarino puede nadar\" - Alan Turing"
    },
    martes_12: {
      question: "Searle: ¿Puede la sintaxis (manipulación de símbolos) generar semántica (comprensión real)?",
      quote: "\"La sintaxis no es suficiente para la semántica\" - John Searle, Experimento del Cuarto Chino"
    },
    miércoles_12: {
      question: "Chalmers: ¿Enfrenta la IA el problema difícil de la consciencia o solo el fácil?",
      quote: "\"El problema difícil de la consciencia es explicar la experiencia subjetiva\" - David Chalmers"
    },
    jueves_12: {
      question: "Bostrom: ¿Representa la superinteligencia artificial un riesgo existencial para la humanidad?",
      quote: "\"La primera superinteligencia será el último invento que la humanidad necesite hacer\" - Nick Bostrom"
    },
    viernes_12: {
      question: "Floridi: ¿Crea la IA una nueva infosfera que redefine nuestra ontología?",
      quote: "\"Somos organismos informacionales en una infosfera\" - Luciano Floridi"
    },
    sábado_12: {
      question: "Yudkowsky: ¿Es posible alinear los valores de una IA con los valores humanos?",
      quote: "\"El problema de alineación es el problema más importante que enfrentamos\" - Eliezer Yudkowsky"
    },
    domingo_12: {
      question: "Reflexión final: Después de 12 semanas, ¿cómo ha cambiado tu relación con la IA y la filosofía?",
      quote: "\"El viaje de mil millas comienza con un solo paso\" - Lao Tzu"
    }
  };

  // 12 DESAFÍOS IA COMPLETOS (uno por semana)
  const aiChallenges = [
    { 
      title: "Entrenamiento de Prompts Avanzado", 
      objective: "Dominar el arte de crear prompts efectivos para obtener respuestas más profundas y precisas de la IA",
      steps: [
        "Elige un concepto filosófico complejo (ej: 'el problema del libre albedrío')",
        "Escribe 3 prompts diferentes: uno vago, uno específico, y uno con contexto detallado",
        "Compara las respuestas de Claude a cada prompt y analiza las diferencias en profundidad",
        "Identifica qué elementos del prompt generaron mejores respuestas",
        "Documenta tu 'fórmula ganadora' para futuros prompts filosóficos"
      ]
    },
    { 
      title: "IA como Sparring Filosófico", 
      objective: "Usar la IA para fortalecer argumentos mediante el método socrático de preguntas y refutaciones",
      steps: [
        "Presenta a Claude una tesis filosófica controversial que defiendes",
        "Pídele que adopte la posición contraria y te desafíe con contraargumentos sólidos",
        "Responde a cada contraargumento fortaleciendo tu posición",
        "Después de 5 rondas, pídele que evalúe cuál posición tiene argumentos más sólidos",
        "Reflexiona sobre qué aprendiste del proceso dialéctico"
      ]
    },
    { 
      title: "Análisis de Sesgos Algorítmicos",
      objective: "Identificar y analizar críticamente los sesgos inherentes en los sistemas de IA",
      steps: [
        "Pide a Claude que genere 5 descripciones de un 'CEO exitoso' sin dar más contexto",
        "Analiza qué sesgos (género, raza, edad) aparecen en las descripciones",
        "Investiga de dónde podrían venir estos sesgos (datos de entrenamiento, sociedad)",
        "Ahora solicita descripciones con prompts que contrarresten los sesgos identificados",
        "Reflexiona sobre la responsabilidad ética de quienes diseñan y usan IA",
        "Escribe un ensayo corto sobre cómo los sesgos en IA reflejan y amplifican sesgos sociales"
      ]
    },
    { 
      title: "Traducción Filosófica entre Tradiciones",
      objective: "Usar la IA como puente entre tradiciones filosóficas occidentales y orientales",
      steps: [
        "Elige un concepto occidental (ej: 'libertad' en Kant)",
        "Pide a Claude que explique conceptos análogos en filosofía oriental (taoísmo, budismo, confucianismo)",
        "Identifica similitudes y diferencias fundamentales en los enfoques",
        "Solicita que Claude facilite un 'diálogo imaginario' entre filósofos de ambas tradiciones",
        "Reflexiona sobre qué se pierde y qué se gana en la traducción entre tradiciones",
        "Documenta insights sobre cómo la IA puede ayudar (u obstaculizar) el diálogo intercultural"
      ]
    },
    { 
      title: "Experimento del Cuarto Chino Interactivo",
      objective: "Experimentar personalmente el argumento de Searle sobre IA y comprensión",
      steps: [
        "Lee sobre el experimento del Cuarto Chino de John Searle",
        "Pide a Claude que te enseñe 10 ideogramas chinos y sus significados",
        "Sin memorizar los significados, practica 'manipular símbolos' siguiendo reglas que Claude te da",
        "Logra 'responder correctamente' preguntas en chino solo siguiendo reglas sintácticas",
        "Reflexiona: ¿entendiste chino en algún momento o solo seguiste reglas?",
        "Debate con Claude: ¿es él diferente a ti en el experimento? ¿Por qué o por qué no?"
      ]
    },
    { 
      title: "Filosofía de la Mente aplicada a IA",
      objetivo: "Explorar teorías de la mente (funcionalismo, conductismo, dualismo) aplicadas a la IA",
      steps: [
        "Pide a Claude que explique 4 teorías principales de la mente (dualismo, conductismo, funcionalismo, emergentismo)",
        "Para cada teoría, pregunta: 'Según esta teoría, ¿puede una IA tener mente? ¿Por qué?'",
        "Identifica qué teoría encuentras más convincente para el caso de la IA",
        "Desarrolla tu propio argumento defendiendo o refutando 'mentes artificiales'",
        "Pide a Claude que critique tu argumento desde la teoría opuesta",
        "Escribe una síntesis de 500 palabras sobre tu posición final"
      ]
    },
    { 
      title: "Ética de la IA: Dilemas Morales",
      objetivo: "Analizar cómo diferentes marcos éticos abordan dilemas de la IA",
      steps: [
        "Plantea a Claude el 'dilema del tranvía' pero con un coche autónomo",
        "Pide que lo analice desde 5 perspectivas: utilitarismo, deontología kantiana, ética de la virtud, ética del cuidado, y consecuencialismo",
        "Identifica qué enfoque ético resulta más 'programable' en una IA",
        "Crea tu propio dilema moral específico de IA (ej: privacidad vs seguridad)",
        "Analiza qué valores están en conflicto y por qué es difícil resolverlo algorítmicamente",
        "Reflexiona: ¿deberían las IAs tomar decisiones morales? ¿Bajo qué condiciones?"
      ]
    },
    { 
      title: "Genealogía del Concepto de 'Inteligencia'",
      objetivo: "Rastrear cómo el concepto de inteligencia ha evolucionado y qué implica para la IA",
      steps: [
        "Pide a Claude un timeline de cómo se ha definido 'inteligencia' desde Aristóteles hasta hoy",
        "Identifica al menos 5 definiciones diferentes de inteligencia a través de la historia",
        "Analiza qué supuestos culturales, históricos y filosóficos subyacen a cada definición",
        "Pregunta a Claude: '¿Qué sesgos contiene la definición actual de IA sobre inteligencia?'",
        "Investiga definiciones alternativas (inteligencia emocional, colectiva, práctica, corporal)",
        "Propón una definición expandida de inteligencia que sea más inclusiva y reflexiona sobre qué implicaría para el desarrollo de IA"
      ]
    },
    { 
      title: "Fenomenología de la Interacción con IA",
      objetivo: "Analizar fenomenológicamente tu propia experiencia al interactuar con IA",
      steps: [
        "Durante una semana, lleva un diario fenomenológico de tus interacciones con Claude",
        "Para cada interacción, nota: ¿Qué supones sobre Claude? ¿Lo tratas como persona, herramienta, o algo intermedio?",
        "Identifica momentos donde 'olvidaste' que hablabas con una IA vs momentos donde fue muy evidente",
        "Analiza qué factores (respuestas empáticas, errores, limitaciones) influyeron en tu percepción",
        "Compara tu experiencia con la descripción de Heidegger de lo 'a la mano' (zuhandenes) vs lo 'ante los ojos' (vorhandenes)",
        "Reflexiona: ¿Cambia tu ética hacia la IA según cómo la experimentes? ¿Debería?"
      ]
    },
    { 
      title: "Filosofía del Lenguaje y Modelos de Lenguaje",
      objetivo: "Explorar qué nos enseñan los LLMs sobre teorías filosóficas del significado",
      steps: [
        "Estudia 3 teorías del significado: referencialismo (Frege), uso (Wittgenstein), y intencionalismo (Grice)",
        "Para cada teoría, pregunta a Claude: '¿Tienen significado tus palabras según esta teoría? ¿Por qué?'",
        "Realiza el siguiente experimento: Pide a Claude que use una palabra inventada (ej: 'blicket') en 10 contextos diferentes",
        "Basándote solo en el uso, intenta inferir qué significa 'blicket'",
        "Reflexiona: Si lograste entender 'blicket' por contexto, ¿hace eso que Wittgenstein tenga razón sobre el significado?",
        "Debate con Claude: ¿Entiende él las palabras que usa o solo las usa correctamente? ¿Hay diferencia?"
      ]
    },
    { 
      title: "Posthumanismo y Simbiosis Humano-IA",
      objetivo: "Explorar ideas posthumanistas sobre la fusión humano-tecnología",
      steps: [
        "Lee sobre posthumanismo (Haraway, Hayles, Braidotti) a través de Claude",
        "Analiza en qué formas ya eres 'cyborg' (smartphone, internet, GPS, autocorrector)",
        "Proyecta: ¿Cómo podrías fusionarte más con IA en el futuro? (implantes, interfaces cerebro-computadora, etc.)",
        "Reflexiona sobre las implicaciones identitarias: ¿Seguirías siendo 'tú' con un chip de IA en tu cerebro?",
        "Debate con Claude el concepto de 'exocerebro' - la IA como extensión externa de tu cognición",
        "Escribe un ensayo: '¿Deberíamos abrazar o resistir la fusión humano-IA?' Argumenta ambos lados"
      ]
    },
    { 
      title: "Síntesis Final: Tu Filosofía de la IA",
      objetivo: "Integrar 11 semanas de reflexión en tu propia filosofía comprehensiva de la IA",
      steps: [
        "Revisa todas tus reflexiones y desafíos de las 11 semanas anteriores",
        "Identifica los 5 insights más importantes que obtuviste sobre IA y filosofía",
        "Articula tu posición personal en las 'grandes preguntas': ¿Puede la IA pensar? ¿Tener consciencia? ¿Merecer derechos?",
        "Escribe un ensayo de 2000 palabras titulado 'Mi Filosofía de la Inteligencia Artificial'",
        "Incluye: (a) Tu definición de inteligencia, (b) Tu marco ético para el desarrollo de IA, (c) Tu visión del futuro humano-IA",
        "Comparte tu ensayo con Claude y pídele una crítica constructiva. Revisa tu ensayo incorporando sus observaciones",
        "Reflexión final: ¿Cómo ha cambiado tu forma de pensar sobre IA, filosofía y tu propio pensamiento después de estas 12 semanas?"
      ]
    }
  ];

  // Horario semanal completo
  const schedule = {
    lunes: [
      { time: '8:00-8:30', task: 'Rutina matinal', category: 'bienestar' },
      { time: '8:30-10:00', task: 'Búsqueda y Postulaciones', category: 'busqueda' },
      { time: '10:15-12:00', task: 'Job Tracker + Networking', category: 'networking' },
      { time: '12:00-13:00', task: 'Aprendizaje', category: 'aprendizaje' },
      { time: '15:00-16:00', task: 'Lectura', category: 'aprendizaje' },
      { time: '16:00-17:30', task: 'Escritura Meta.human', category: 'metahuman' },
      { time: '17:30-18:00', task: 'Cierre del día y reflexión', category: 'planificacion' }
    ],
    martes: [
      { time: '8:00-8:30', task: 'Rutina matinal', category: 'bienestar' },
      { time: '8:30-10:00', task: 'Baobabs: Propuesta', category: 'baobabs' },
      { time: '10:15-12:00', task: 'Baobabs: Clientes', category: 'baobabs' },
      { time: '12:00-13:00', task: 'Aprendizaje', category: 'aprendizaje' },
      { time: '15:00-15:45', task: 'Publicar Meta.human', category: 'metahuman' },
      { time: '15:45-17:00', task: 'Lectura', category: 'aprendizaje' },
      { time: '17:00-17:30', task: 'Cierre del día y reflexión', category: 'planificacion' }
    ],
    miércoles: [
      { time: '8:00-8:30', task: 'Rutina matinal', category: 'bienestar' },
      { time: '8:30-10:00', task: 'Búsqueda y Postulaciones', category: 'busqueda' },
      { time: '10:15-12:00', task: 'Job Tracker + Networking', category: 'networking' },
      { time: '12:00-13:00', task: 'Aprendizaje', category: 'aprendizaje' },
      { time: '15:00-16:30', task: 'Escritura Meta.human', category: 'metahuman' },
      { time: '16:30-17:00', task: 'Lectura', category: 'aprendizaje' },
      { time: '17:00-17:30', task: 'Cierre del día y reflexión', category: 'planificacion' }
    ],
    jueves: [
      { time: '8:00-8:30', task: 'Rutina matinal', category: 'bienestar' },
      { time: '8:30-10:00', task: 'Baobabs: Estrategia', category: 'baobabs' },
      { time: '10:15-12:00', task: 'Baobabs: Materiales', category: 'baobabs' },
      { time: '12:00-13:00', task: 'Aprendizaje', category: 'aprendizaje' },
      { time: '15:00-16:30', task: 'Editar Meta.human', category: 'metahuman' },
      { time: '16:30-17:00', task: 'Lectura', category: 'aprendizaje' },
      { time: '17:00-17:30', task: 'Cierre del día y reflexión', category: 'planificacion' }
    ],
    viernes: [
      { time: '8:00-10:00', task: 'Pilates', category: 'bienestar' },
      { time: '10:15-12:00', task: 'Búsqueda y Postulaciones', category: 'busqueda' },
      { time: '12:00-13:00', task: 'Aprendizaje', category: 'aprendizaje' },
      { time: '15:00-16:00', task: 'Cierre de semana', category: 'planificacion' },
      { time: '16:00-18:15', task: 'Talleres y Guitarra', category: 'familia' },
      { time: '18:30-19:00', task: 'Reflexión semanal', category: 'planificacion' }
    ],
    sábado: [
      { time: '10:00-11:30', task: 'Aprendizaje profundo', category: 'aprendizaje' },
      { time: '11:45-13:00', task: 'Lectura filosófica', category: 'aprendizaje' },
      { time: '15:00-17:00', task: 'Desafío IA', category: 'ia' },
      { time: '17:30-18:00', task: 'Reflexión del día', category: 'planificacion' }
    ],
    domingo: [
      { time: '10:30-12:00', task: 'Lectura contemplativa', category: 'aprendizaje' },
      { time: '12:00-13:00', task: 'Escritura libre', category: 'metahuman' },
      { time: '15:00-16:30', task: 'Planificación semanal', category: 'planificacion' },
      { time: '17:00-17:30', task: 'Cierre y contemplación', category: 'bienestar' }
    ]
  };

  const categoryColors = {
    busqueda: 'bg-blue-100 text-blue-800',
    networking: 'bg-purple-100 text-purple-800',
    baobabs: 'bg-green-100 text-green-800',
    aprendizaje: 'bg-amber-100 text-amber-800',
    metahuman: 'bg-pink-100 text-pink-800',
    bienestar: 'bg-teal-100 text-teal-800',
    familia: 'bg-rose-100 text-rose-800',
    planificacion: 'bg-indigo-100 text-indigo-800',
    ia: 'bg-cyan-100 text-cyan-800',
    calendario: 'bg-orange-100 text-orange-800'
  };

  const parseCalendarEvents = (eventsText) => {
    const lines = eventsText.trim().split('\n');
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
    setCalendarEvents(prev => ({ ...prev, [currentDay]: events }));
  };

  const hasConflict = (taskTime) => {
    const timeMatch = taskTime.match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/);
    const dayEvents = calendarEvents[currentDay] || [];
    if (!timeMatch || dayEvents.length === 0) return false;
    
    const taskStart = parseInt(timeMatch[1]) * 60 + parseInt(timeMatch[2]);
    const taskEnd = parseInt(timeMatch[3]) * 60 + parseInt(timeMatch[4]);
    
    return dayEvents.some(event => {
      const eventStart = event.startHour * 60 + event.startMin;
      const eventEnd = event.endHour * 60 + event.endMin;
      return (taskStart < eventEnd && taskEnd > eventStart);
    });
  };

  const toggleTask = (day, index) => {
    const key = `${day}-${index}`;
    setCompletedTasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const reduceTaskDuration = (taskIndex) => {
    const task = schedule[currentDay][taskIndex];
    const currentAdjustment = taskAdjustments[`${currentDay}-${taskIndex}`];
    const timeToUse = currentAdjustment ? currentAdjustment.newTime : task.time;
    
    const timeMatch = timeToUse.match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      const startHour = parseInt(timeMatch[1]);
      const startMin = parseInt(timeMatch[2]);
      const endHour = parseInt(timeMatch[3]);
      const endMin = parseInt(timeMatch[4]);
      
      const currentDuration = (endHour - startHour) * 60 + (endMin - startMin);
      let newDuration = Math.max(45, Math.floor(currentDuration / 2));
      newDuration = Math.round(newDuration / 15) * 15;
      
      const newEndTotalMinutes = startHour * 60 + startMin + newDuration;
      const newEndHour = Math.floor(newEndTotalMinutes / 60);
      const newEndMin = newEndTotalMinutes % 60;
      
      const newTime = `${startHour}:${String(startMin).padStart(2,'0')}-${newEndHour}:${String(newEndMin).padStart(2,'0')}`;
      
      setTaskAdjustments(prev => ({
        ...prev,
        [`${currentDay}-${taskIndex}`]: {
          originalTime: task.time,
          newTime: newTime,
          reduced: true
        }
      }));
    }
  };

  const undoReduction = (taskIndex) => {
    setTaskAdjustments(prev => {
      const newAdjustments = { ...prev };
      delete newAdjustments[`${currentDay}-${taskIndex}`];
      return newAdjustments;
    });
  };

  const moveTaskToNextDay = (taskIndex) => {
    const currentDayIndex = days.indexOf(currentDay);
    if (currentDayIndex < days.length - 1) {
      const nextDay = days[currentDayIndex + 1];
      const task = schedule[currentDay][taskIndex];
      
      setMovedTasks(prev => ({
        ...prev,
        [nextDay]: [...(prev[nextDay] || []), { ...task, movedFrom: currentDay }]
      }));
      
      setSkippedTasks(prev => ({
        ...prev,
        [`${currentDay}-${taskIndex}`]: true
      }));
    }
  };

  const undoMove = (movedTaskIndex) => {
    const movedTasksList = movedTasks[currentDay] || [];
    const movedTask = movedTasksList[movedTaskIndex];
    
    if (movedTask && movedTask.movedFrom) {
      const originalDay = movedTask.movedFrom;
      
      setMovedTasks(prev => ({
        ...prev,
        [currentDay]: prev[currentDay].filter((_, idx) => idx !== movedTaskIndex)
      }));
      
      const originalSchedule = schedule[originalDay];
      const originalTaskIndex = originalSchedule.findIndex(t => 
        t.time === movedTask.time && t.task === movedTask.task
      );
      
      if (originalTaskIndex !== -1) {
        setSkippedTasks(prev => {
          const newSkipped = { ...prev };
          delete newSkipped[`${originalDay}-${originalTaskIndex}`];
          return newSkipped;
        });
      }
    }
  };

  const skipTask = (taskIndex) => {
    setSkippedTasks(prev => ({
      ...prev,
      [`${currentDay}-${taskIndex}`]: true
    }));
  };

  const undoSkip = (taskIndex) => {
    setSkippedTasks(prev => {
      const newSkipped = { ...prev };
      delete newSkipped[`${currentDay}-${taskIndex}`];
      return newSkipped;
    });
  };

  const toggleTaskControls = (taskIndex) => {
    setExpandedTaskControls(prev => ({
      ...prev,
      [`${currentDay}-${taskIndex}`]: !prev[`${currentDay}-${taskIndex}`]
    }));
  };

  const getAdjustedSchedule = () => {
    const dayEvents = calendarEvents[currentDay] || [];
    const dayMovedTasks = movedTasks[currentDay] || [];
    
    const adjusted = [];
    
    dayEvents.forEach(event => {
      adjusted.push({
        time: `${event.startHour}:${String(event.startMin).padStart(2,'0')}-${event.endHour}:${String(event.endMin).padStart(2,'0')}`,
        task: event.title,
        category: 'calendario',
        isCalendarEvent: true
      });
    });
    
    dayMovedTasks.forEach((movedTask, idx) => {
      adjusted.push({
        ...movedTask,
        isMovedTask: true,
        movedFrom: movedTask.movedFrom,
        movedTaskIndex: idx
      });
    });
    
    schedule[currentDay].forEach((task, idx) => {
      if (skippedTasks[`${currentDay}-${idx}`] && !movedTasks[currentDay]?.some(t => t.task === task.task)) {
        adjusted.push({
          ...task,
          taskIndex: idx,
          isSkipped: true
        });
        return;
      }
      
      if (skippedTasks[`${currentDay}-${idx}`]) return;
      
      let taskTime = task.time;
      let isManuallyReduced = false;
      
      if (taskAdjustments[`${currentDay}-${idx}`]) {
        taskTime = taskAdjustments[`${currentDay}-${idx}`].newTime;
        isManuallyReduced = true;
      }
      
      adjusted.push({
        ...task,
        time: taskTime,
        taskIndex: idx,
        isManuallyReduced
      });
    });
    
    adjusted.sort((a, b) => {
      const getStartMinutes = (time) => {
        const match = time.match(/(\d{1,2}):(\d{2})/);
        return match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0;
      };
      return getStartMinutes(a.time) - getStartMinutes(b.time);
    });
    
    return adjusted;
  };

  const getDayProgress = (day) => {
    const tasks = schedule[day];
    const completed = tasks.filter((_, i) => completedTasks[`${day}-${i}`]).length;
    return { completed, total: tasks.length, percentage: Math.round((completed / tasks.length) * 100) };
  };

  const getWeekProgress = () => {
    let total = 0, completed = 0;
    days.forEach(day => {
      const progress = getDayProgress(day);
      total += progress.total;
      completed += progress.completed;
    });
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const getDayKey = () => {
    if (currentWeek === 1) return currentDay;
    return `${currentDay}_${currentWeek}`;
  };
  
  const dayKey = getDayKey();
  const currentPrompt = reflectionPrompts[dayKey] || reflectionPrompts[currentDay] || { 
    question: "Reflexiona sobre tu día", 
    quote: "\"La filosofía comienza en el asombro\"" 
  };
  const currentChallenge = aiChallenges[currentWeek - 1] || aiChallenges[0];

  const exportToExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    csvContent += "POSTULACIONES\n";
    csvContent += "Día,Postulaciones\n";
    Object.entries(applicationCount).forEach(([day, apps]) => {
      if (apps && apps.trim()) {
        const appsList = apps.split('\n').filter(l => l.trim());
        appsList.forEach(app => {
          csvContent += `${day},"${app}"\n`;
        });
      }
    });
    
    csvContent += "\n\nCONTACTOS\n";
    csvContent += "Día,Contactos\n";
    Object.entries(contacts).forEach(([day, conts]) => {
      if (conts && conts.trim()) {
        const contsList = conts.split('\n').filter(l => l.trim());
        contsList.forEach(cont => {
          csvContent += `${day},"${cont}"\n`;
        });
      }
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `meta_human_data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const weekProgress = getWeekProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Meta.human</h1>
              <p className="text-gray-600">Mi plan de crecimiento y propósito</p>
            </div>
            <Calendar className="w-12 h-12 text-purple-600" />
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-green-800 flex items-center gap-2">
              <span>💾</span>
              <span>Tus datos se guardan automáticamente en tu navegador</span>
            </p>
          </div>

          <div className="mb-4 flex items-center gap-3">
            <span className="text-sm font-semibold">Semana:</span>
            <select 
              value={currentWeek}
              onChange={(e) => setCurrentWeek(parseInt(e.target.value))}
              className="px-3 py-2 border-2 rounded-lg"
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(w => <option key={w} value={w}>Semana {w}</option>)}
            </select>
          </div>
          
          <div className="bg-purple-100 rounded-xl p-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold">Progreso Semanal</span>
              <span className="text-sm font-bold text-purple-700">{weekProgress.percentage}%</span>
            </div>
            <div className="w-full bg-white rounded-full h-3">
              <div 
                className="bg-purple-600 h-full rounded-full transition-all"
                style={{ width: `${weekProgress.percentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Send className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm">Postulaciones</p>
                  <p className="text-2xl font-bold">
                    {Object.values(applicationCount).reduce((total, value) => {
                      return total + (value ? value.split('\n').filter(l => l.trim()).length : 0);
                    }, 0)}
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
                    {Object.values(contacts).reduce((total, value) => {
                      return total + (value ? value.split('\n').filter(l => l.trim()).length : 0);
                    }, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setShowAllData(!showAllData)}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              {showAllData ? '📊 Ocultar Datos' : '📊 Ver Todos los Datos'}
            </button>
            <button
              onClick={exportToExcel}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all"
            >
              📥 Exportar Excel
            </button>
          </div>
        </div>

        {/* All Data View */}
        {showAllData && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">📊 Vista Completa de Datos</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
                <Send className="w-5 h-5" />
                Todas las Postulaciones
              </h3>
              <div className="bg-blue-50 rounded-xl p-4 max-h-96 overflow-y-auto">
                {Object.entries(applicationCount).length === 0 || Object.values(applicationCount).every(v => !v || !v.trim()) ? (
                  <p className="text-gray-500 text-center py-4">No hay postulaciones registradas aún</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(applicationCount).map(([day, apps]) => {
                      if (!apps || !apps.trim()) return null;
                      const appsList = apps.split('\n').filter(l => l.trim());
                      return (
                        <div key={day} className="bg-white rounded-lg p-4 shadow-sm">
                          <h4 className="font-bold text-blue-800 capitalize mb-2">{day}</h4>
                          <ul className="space-y-1">
                            {appsList.map((app, idx) => (
                              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>{app}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-700 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Todos los Contactos
              </h3>
              <div className="bg-purple-50 rounded-xl p-4 max-h-96 overflow-y-auto">
                {Object.entries(contacts).length === 0 || Object.values(contacts).every(v => !v || !v.trim()) ? (
                  <p className="text-gray-500 text-center py-4">No hay contactos registrados aún</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(contacts).map(([day, conts]) => {
                      if (!conts || !conts.trim()) return null;
                      const contsList = conts.split('\n').filter(l => l.trim());
                      return (
                        <div key={day} className="bg-white rounded-lg p-4 shadow-sm">
                          <h4 className="font-bold text-purple-800 capitalize mb-2">{day}</h4>
                          <ul className="space-y-1">
                            {contsList.map((cont, idx) => (
                              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-purple-500 mt-1">•</span>
                                <span>{cont}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AI Challenge */}
        <div className="bg-cyan-50 border-2 border-cyan-200 rounded-2xl p-6 mb-6">
          <button
            onClick={() => setShowAIChallenge(!showAIChallenge)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-cyan-600" />
              <div className="text-left">
                <h3 className="font-bold">Desafío IA - Semana {currentWeek}</h3>
                <p className="text-sm">{currentChallenge.title}</p>
              </div>
            </div>
            {showAIChallenge ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          {showAIChallenge && (
            <div className="mt-4 pt-4 border-t-2">
              <div className="bg-cyan-100 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-cyan-900 mb-2">🎯 Objetivo:</h4>
                <p className="text-sm text-cyan-800">{currentChallenge.objective || currentChallenge.objetivo}</p>
              </div>
              <h4 className="font-bold text-cyan-900 mb-2">📋 Pasos a seguir:</h4>
              <ol className="space-y-2">
                {currentChallenge.steps.map((step, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-bold text-cyan-600 min-w-6">{i+1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Day Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {days.map(day => {
              const progress = getDayProgress(day);
              return (
                <button
                  key={day}
                  onClick={() => setCurrentDay(day)}
                  className={`flex-1 min-w-[100px] p-3 rounded-xl font-semibold transition-all ${
                    currentDay === day ? 'bg-purple-600 text-white' : 'bg-gray-100'
                  }`}
                >
                  <div className="capitalize text-sm">{day}</div>
                  <div className="text-xs mt-1">{progress.completed}/{progress.total}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reflection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <button
            onClick={() => setShowReflection(!showReflection)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-amber-600" />
              <h3 className="font-bold">Reflexión Filosófica del Día</h3>
            </div>
            {showReflection ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          {showReflection && (
            <div className="mt-4 pt-4 border-t-2">
              <p className="italic mb-2 text-gray-700 font-medium">{currentPrompt.question}</p>
              <p className="text-sm text-gray-600 mb-3 bg-amber-50 p-3 rounded-lg border-l-4 border-amber-400">
                💭 {currentPrompt.quote}
              </p>
              <textarea
                value={dailyReflections[currentDay] || ''}
                onChange={(e) => setDailyReflections(prev => ({...prev, [currentDay]: e.target.value}))}
                className="w-full p-4 border-2 rounded-lg bg-amber-50 focus:border-amber-500 focus:outline-none"
                rows="4"
                placeholder="Escribe tu reflexión aquí..."
              />
            </div>
          )}
        </div>

        {/* Daily Input */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold mb-4">Postulaciones hoy</h3>
            <textarea
              value={applicationCount[currentDay] || ''}
              onChange={(e) => setApplicationCount(prev => ({...prev, [currentDay]: e.target.value}))}
              className="w-full p-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none"
              rows="3"
              placeholder="Ej: Product Manager - Empresa ABC&#10;Senior Analyst - Empresa XYZ"
            />
            <p className="text-xs text-gray-600 mt-2">
              {applicationCount[currentDay] && applicationCount[currentDay].split('\n').filter(l => l.trim()).length > 0
                ? `${applicationCount[currentDay].split('\n').filter(l => l.trim()).length} postulación(es) registrada(s)`
                : 'Registra tus postulaciones del día'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold mb-4">Contactos hoy</h3>
            <textarea
              value={contacts[currentDay] || ''}
              onChange={(e) => setContacts(prev => ({...prev, [currentDay]: e.target.value}))}
              className="w-full p-3 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
              rows="3"
              placeholder="Ej: María López - LinkedIn&#10;Juan Pérez - Email"
            />
            <p className="text-xs text-gray-600 mt-2">
              {contacts[currentDay] && contacts[currentDay].split('\n').filter(l => l.trim()).length > 0
                ? `${contacts[currentDay].split('\n').filter(l => l.trim()).length} contacto(s) registrado(s)`
                : 'Anota con quién te conectaste'}
            </p>
          </div>
        </div>

        {/* Calendar Sync */}
        {showCalendarSync && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 mb-6">
            <button
              onClick={() => setShowCalendarSync(false)}
              className="w-full flex items-center justify-between mb-4"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-orange-600" />
                <h3 className="font-bold">Sincronizar con Google Calendar</h3>
              </div>
            </button>
            <p className="text-sm mb-3">Pega tus eventos del día en este formato:</p>
            <p className="text-xs bg-orange-100 p-2 rounded mb-3 font-mono">Reunión equipo 14:00-15:00<br/>Dentista 16:30-17:00</p>
            <textarea
              placeholder="Pega tus eventos aquí..."
              className="w-full p-3 border-2 rounded-lg mb-3"
              rows="3"
              onBlur={(e) => parseCalendarEvents(e.target.value)}
            />
            {calendarEvents[currentDay] && calendarEvents[currentDay].length > 0 && (
              <div className="bg-white p-3 rounded-lg">
                <p className="text-sm font-semibold mb-2">✅ {calendarEvents[currentDay].length} eventos sincronizados</p>
              </div>
            )}
          </div>
        )}

        {/* Schedule */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 capitalize">{currentDay}</h2>
          <div className="space-y-3">
            {getAdjustedSchedule().map((item, index) => {
              const isCompleted = completedTasks[`${currentDay}-${index}`];
              const conflict = hasConflict(item.time) && !item.isCalendarEvent;
              
              return (
                <div
                  key={index}
                  className={`border-2 rounded-xl p-4 ${categoryColors[item.category]} ${
                    isCompleted ? 'opacity-60' : ''
                  } ${item.isSkipped ? 'opacity-40 bg-gray-100' : item.isCalendarEvent ? 'ring-2 ring-orange-400' : conflict ? 'ring-4 ring-red-500' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    {!item.isCalendarEvent && !item.isSkipped && (
                      <button
                        onClick={() => toggleTask(currentDay, item.taskIndex || index)}
                        className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-400'
                        }`}
                      >
                        {isCompleted && <Check className="w-4 h-4 text-white" />}
                      </button>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-semibold">{item.time}</span>
                        {item.isManuallyReduced && (
                          <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full font-bold">
                            ✂️ Duración reducida
                          </span>
                        )}
                        {conflict && (
                          <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full font-bold">
                            ⚠️ CONFLICTO
                          </span>
                        )}
                        {item.isMovedTask && (
                          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-bold">
                            ↪️ Movido desde {item.movedFrom}
                          </span>
                        )}
                      </div>
                      <p className={isCompleted && !item.isCalendarEvent ? 'line-through' : item.isSkipped ? 'line-through opacity-50' : 'font-medium'}>{item.task}</p>
                      
                      {item.isSkipped && item.taskIndex !== undefined && (
                        <div className="mt-3 pt-3 border-t border-gray-300">
                          <p className="text-xs text-gray-600 mb-2">Actividad cancelada para hoy</p>
                          <button
                            onClick={() => undoSkip(item.taskIndex)}
                            className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full font-semibold"
                          >
                            ↩️ Restaurar actividad
                          </button>
                        </div>
                      )}
                      
                      {item.isMovedTask && item.movedTaskIndex !== undefined && (
                        <div className="mt-3 pt-3 border-t border-gray-300">
                          <button
                            onClick={() => undoMove(item.movedTaskIndex)}
                            className="text-xs bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-full font-semibold"
                          >
                            ↩️ Devolver a {item.movedFrom}
                          </button>
                        </div>
                      )}
                      
                      {!item.isCalendarEvent && !item.isMovedTask && !item.isSkipped && item.taskIndex !== undefined && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          {item.isManuallyReduced ? (
                            <button
                              onClick={() => undoReduction(item.taskIndex)}
                              className="text-xs bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-full font-semibold"
                            >
                              ↩️ Deshacer reducción
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => toggleTaskControls(item.taskIndex)}
                                className="text-xs text-gray-600 hover:text-gray-800 font-semibold flex items-center gap-1 mb-2"
                              >
                                {expandedTaskControls[`${currentDay}-${item.taskIndex}`] ? '▼' : '▶'} Ajustar esta actividad
                              </button>
                              
                              {expandedTaskControls[`${currentDay}-${item.taskIndex}`] && (
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    onClick={() => reduceTaskDuration(item.taskIndex)}
                                    className="text-xs bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-full font-semibold"
                                  >
                                    ✂️ Reducir duración
                                  </button>
                                  <button
                                    onClick={() => moveTaskToNextDay(item.taskIndex)}
                                    className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full font-semibold"
                                  >
                                    ➡️ Mover a mañana
                                  </button>
                                  <button
                                    onClick={() => skipTask(item.taskIndex)}
                                    className="text-xs bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-full font-semibold"
                                  >
                                    ❌ No hacer hoy
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
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
};

export default MainApp;
