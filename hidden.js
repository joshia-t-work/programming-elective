// Hidden Test Page Logic
(function(){
  const $ = sel => document.querySelector(sel);
  const startBtn = $('#startBtn');
  const endBtn = $('#endBtn');
  const pauseBtn = $('#pauseBtn');
  const startScreen = $('#startScreen');
  const testScreen = $('#testScreen');
  const afterScreen = $('#afterScreen');
  const stopwatchEl = $('#stopwatch');
  const eventsList = $('#eventsList');
  const exportBtn = $('#exportBtn');
  const exportArea = $('#exportArea');
  const clearHistoryBtn = $('#clearHistoryBtn');
  const showHistoryBtn = $('#showHistoryBtn');
  const finalDurationEl = $('#finalDuration');
  const sessionSummaryEl = $('#sessionSummary');

  const LS_KEY = 'examSessions';
  let sessions = loadSessions();
  let activeSession = getActiveSession();
  let timerInterval = null;
  let paused = false;

  // If resuming an active session, restore UI
  if (activeSession) {
    show(testScreen); hide(startScreen); hide(afterScreen);
    resumeStopwatch();
    // If previously marked away and now visible, close that away segment
    if (activeSession.awayStart && !document.hidden) {
      finalizeAway('resume');
    }
  }

  function newSession(){
    const id = 'S' + Date.now().toString(36);
    return { id, startedAt: Date.now(), endedAt: null, events: [], totalAwayMs:0, awayCount:0, awayStart:null };
  }

  function loadSessions(){
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch(e){ return []; }
  }
  function saveSessions(){
    try { localStorage.setItem(LS_KEY, JSON.stringify(sessions)); } catch(e){}
  }
  function getActiveSession(){ return sessions.find(s=>!s.endedAt) || null; }

  function show(el){ el.classList.add('active'); }
  function hide(el){ el.classList.remove('active'); }

  function formatDuration(ms){
    if (ms < 0) ms = 0;
    const s = Math.floor(ms/1000);
    const m = Math.floor(s/60); const rs = s%60; const h = Math.floor(m/60); const rm = m%60;
    if (h>0) return `${pad(h)}:${pad(rm)}:${pad(rs)}`; return `${pad(m)}:${pad(rs)}`;
  }
  function pad(n){ return n.toString().padStart(2,'0'); }

  function startStopwatch(){
    updateStopwatch();
    timerInterval = setInterval(updateStopwatch,1000);
  }
  function resumeStopwatch(){ startStopwatch(); }
  function stopStopwatch(){ clearInterval(timerInterval); timerInterval = null; updateStopwatch(); }
  function updateStopwatch(){
    if (!activeSession) return;
    const base = Date.now() - activeSession.startedAt - (activeSession._pausedAccum || 0);
    activeSession.liveDurationMs = base;
    stopwatchEl.textContent = formatDuration(base);
  }

  function logEvent(type, extra={}){
    if (!activeSession) return;
    const now = Date.now();
    const elapsed = now - activeSession.startedAt;
    const evt = { t: now, type, el: elapsed, ...extra };
    activeSession.events.push(evt);
    // Persist incrementally
    saveSessions();
    // Update UI only after end screen or during test minimal display? We'll keep minimal; do nothing if test running
    if (afterScreen.classList.contains('active')) renderEvents();
  }

  function beginAway(reason){
    if (!activeSession || activeSession.awayStart) return; // already away
    activeSession.awayStart = Date.now();
    logEvent('away', { code: reason });
    saveSessions();
  }
  function finalizeAway(reason){
    if (!activeSession || !activeSession.awayStart) return;
    const now = Date.now();
    const dur = now - activeSession.awayStart;
    activeSession.totalAwayMs += dur;
    activeSession.awayCount += 1;
    logEvent('back', { code: reason, awayMs: dur });
    activeSession.awayStart = null;
    flashReturn();
    saveSessions();
  }

  function flashReturn(){
    document.body.classList.add('flash-return');
    setTimeout(()=>document.body.classList.remove('flash-return'),600);
  }

  function endSession(){
    if (!activeSession) return;
    if (activeSession.awayStart) finalizeAway('end');
    activeSession.endedAt = Date.now();
    stopStopwatch();
    saveSessions();
    document.body.classList.remove('test-active');
    show(afterScreen); hide(testScreen); hide(startScreen);
    finalDurationEl.textContent = 'Duration: '+ formatDuration(activeSession.endedAt - activeSession.startedAt);
    renderSummary();
    renderEvents();
  }

  function renderSummary(){
    if (!activeSession) return;
    const total = activeSession.totalAwayMs;
    sessionSummaryEl.textContent = `Away segments: ${activeSession.awayCount} • Aggregate away: ${formatDuration(total)} (${total} ms)`;
  }

  function renderEvents(){
    if (!activeSession) return;
    eventsList.innerHTML = '';
    activeSession.events.forEach(e=>{
      const li = document.createElement('li');
      let label = '';
      if (e.type === 'away') label = 'A'; else if (e.type === 'back') label = 'R'; else label = e.type[0] || '?';
      li.innerHTML = `<span class="code">${label}</span><span>${formatTime(e.t)} (+${formatDuration(e.el)})</span>` + (e.awayMs? `<span class="badge">${formatDuration(e.awayMs)}</span>`:'') + (e.code? `<span class="muted" style="font-size:.6rem;">${e.code}</span>`:'');
      eventsList.appendChild(li);
    });
  }
  function formatTime(ts){ const d=new Date(ts); return [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':'); }

  // Visibility / focus tracking
  window.addEventListener('blur', ()=>{ if(!document.hidden) beginAway('blur'); });
  window.addEventListener('focus', ()=> finalizeAway('focus'));
  document.addEventListener('visibilitychange', ()=>{
    if (!activeSession) return;
    if (document.hidden) beginAway('hidden'); else finalizeAway('visible');
  });

  // Prevent context menu & some print/save shortcuts
  document.addEventListener('contextmenu', e=> e.preventDefault());
  document.addEventListener('keydown', e=> {
    if ((e.ctrlKey || e.metaKey) && ['p','s','u'].includes(e.key.toLowerCase())) { e.preventDefault(); }
  });

  // Button handlers
  startBtn?.addEventListener('click', ()=>{
    if (activeSession) return; // already running (resume scenario)
    activeSession = newSession(); sessions.push(activeSession); saveSessions();
    document.body.classList.add('test-active');
    show(testScreen); hide(startScreen); hide(afterScreen);
    logEvent('start');
    startStopwatch();
  });
  endBtn?.addEventListener('click', ()=> endSession());

  exportBtn?.addEventListener('click', ()=>{
    if (!activeSession) return;
    exportArea.style.display = exportArea.style.display==='block' ? 'none':'block';
    if (exportArea.style.display==='block') {
      exportArea.value = JSON.stringify(activeSession, null, 2);
      exportArea.select();
    }
  });

  clearHistoryBtn?.addEventListener('click', ()=>{
    if (!confirm('Delete ALL stored session data?')) return;
    sessions = activeSession && !activeSession.endedAt ? [activeSession] : [];
    // If active session ended, keep none
    if (activeSession && activeSession.endedAt) activeSession = null;
    saveSessions();
    if (afterScreen.classList.contains('active')) renderEvents();
  });

  showHistoryBtn?.addEventListener('click', ()=>{
    // Toggle showing previous sessions raw list
    const others = sessions.filter(s=>!activeSession || s.id !== activeSession.id || s.endedAt);
    exportArea.style.display = exportArea.style.display==='block' ? 'none':'block';
    if (exportArea.style.display==='block') {
      exportArea.value = JSON.stringify(others, null, 2);
    }
  });

  // Auto-mark away if window starts hidden (rare)
  if (activeSession && document.hidden) beginAway('initialHidden');

  // Helper for crash-proof: flush every 5s just in case (even though we save each event)
  setInterval(()=>{ if (activeSession) saveSessions(); }, 5000);

})();
