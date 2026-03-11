import { useState, useEffect } from 'react';

const theme = {
  bg: '#080808',
  surface: '#111111',
  surfaceHover: '#161616',
  border: '#1e1e1e',
  borderLight: '#2a2a2a',
  accent: '#e8ff47',
  accentDark: '#b8cc2a',
  text: '#f5f5f5',
  textMuted: '#666',
  textDim: '#444',
  easy: { bg: '#0a1628', border: '#1a3a6e', dot: '#4a90d9' },
  tempo: { bg: '#1a0a0a', border: '#6e1a1a', dot: '#d94a4a' },
  intervals: { bg: '#0e0a1a', border: '#4a1a6e', dot: '#8a4ad9' },
  long_run: { bg: '#0a1a0e', border: '#1a6e2a', dot: '#4ad96a' },
  rest: { bg: '#0f0f0f', border: '#222', dot: '#444' },
  race: { bg: '#1a1200', border: '#6e4e00', dot: '#e8a020' },
  tune_up: { bg: '#0a1a1a', border: '#1a5e6e', dot: '#4ac4d9' },
};

const typeLabel = {
  easy: 'Easy Run',
  tempo: 'Tempo',
  intervals: 'Intervals',
  long_run: 'Long Run',
  rest: 'Rest',
  race: 'Race Day',
  tune_up: 'Tune-Up',
};

const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080808; color: #f5f5f5; font-family: 'JetBrains Mono', monospace; -webkit-font-smoothing: antialiased; }
  ::selection { background: #e8ff47; color: #000; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #080808; }
  ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
  input, select { background: #0c0c0c; border: 1px solid #1e1e1e; color: #f5f5f5; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; padding: 0.65rem 0.9rem; border-radius: 4px; width: 100%; outline: none; transition: border-color 0.2s; appearance: none; -webkit-appearance: none; }
  input:focus, select:focus { border-color: #e8ff47; }
  input::placeholder { color: #444; }
  input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  .fade-up { animation: fadeUp 0.4s ease forwards; }
  .btn-primary { background: #e8ff47; color: #000; border: none; padding: 0.7rem 1.6rem; font-family: 'Syne', sans-serif; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; border-radius: 4px; cursor: pointer; transition: background 0.2s, transform 0.1s; }
  .btn-primary:hover { background: #d4eb30; }
  .btn-primary:active { transform: scale(0.98); }
  .btn-primary:disabled { background: #2a2a2a; color: #444; cursor: not-allowed; }
  .btn-ghost { background: transparent; color: #666; border: 1px solid #1e1e1e; padding: 0.7rem 1.6rem; font-family: 'Syne', sans-serif; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 4px; cursor: pointer; transition: all 0.2s; }
  .btn-ghost:hover { border-color: #2a2a2a; color: #f5f5f5; }
  .btn-ghost:disabled { opacity: 0.3; cursor: not-allowed; }
  .btn-tiny { background: transparent; color: #444; border: 1px solid #1e1e1e; padding: 0.3rem 0.8rem; font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase; border-radius: 3px; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
  .btn-tiny:hover { border-color: #e8ff47; color: #e8ff47; }
  .btn-tiny.done { border-color: #2a5a2a; color: #4ad96a; }
  .btn-tiny.done:hover { border-color: #3a3a3a; color: #444; }
  .week-tab { padding: 0.4rem 1rem; font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 3px; cursor: pointer; border: 1px solid #1e1e1e; background: transparent; color: #444; transition: all 0.15s; }
  .week-tab:hover { border-color: #2a2a2a; color: #666; }
  .week-tab.active { border-color: #e8ff47; color: #e8ff47; background: rgba(232,255,71,0.05); }
  .week-tab.complete { border-color: #2a5a2a; color: #4ad96a; }
  .week-tab.complete.active { background: rgba(74,217,106,0.05); }
  .day-card { border-radius: 6px; padding: 1.1rem 1.3rem; margin-bottom: 0.6rem; display: flex; align-items: center; gap: 1rem; transition: all 0.2s; position: relative; overflow: hidden; }
  .field-label { font-size: 0.6rem; letter-spacing: 0.14em; text-transform: uppercase; color: #444; margin-bottom: 0.4rem; font-family: 'Syne', sans-serif; }
  .section-label { font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: #444; font-family: 'Syne', sans-serif; padding-bottom: 0.75rem; border-bottom: 1px solid #1e1e1e; margin-bottom: 1.5rem; }
  .progress-track { height: 2px; background: #1e1e1e; border-radius: 1px; overflow: hidden; margin-bottom: 1.5rem; }
  .progress-fill { height: 100%; background: #e8ff47; border-radius: 1px; transition: width 0.5s cubic-bezier(0.4,0,0.2,1); }
  .stat { font-size: 0.65rem; color: #444; letter-spacing: 0.08em; }
  .stat span { color: #f5f5f5; font-size: 0.85rem; font-weight: 500; display: block; margin-top: 0.1rem; }
`;
document.head.appendChild(style);

export default function App() {
  const [profile, setProfile] = useState({
    name: '', age: '', currentWeeklyKm: '', daysPerWeek: '',
    goalType: '10k', weeksToGoal: '', weight: '', currentPR: '', fitnessLevel: 'beginner',
  });
  const [plan, setPlan] = useState(null);
  const [selectedWeekNumber, setSelectedWeekNumber] = useState(1);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileStatus, setProfileStatus] = useState('');
  const [profileError, setProfileError] = useState('');
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [planStatus, setPlanStatus] = useState('');
  const [planError, setPlanError] = useState('');

  function handleProfileChange(e) {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  }

  async function saveProfile() {
    setSavingProfile(true); setProfileStatus(''); setProfileError('');
    try {
      const response = await fetch('http://localhost:3001/api/profile', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profile.name, age: Number(profile.age), currentWeeklyKm: Number(profile.currentWeeklyKm), daysPerWeek: Number(profile.daysPerWeek), goalType: profile.goalType, weeksToGoal: Number(profile.weeksToGoal), weight: Number(profile.weight), currentPR: profile.currentPR, fitnessLevel: profile.fitnessLevel }),
      });
      const data = await response.json();
      if (!response.ok) { setProfileError(data.message || 'Error saving profile'); return; }
      setProfileStatus('Saved.');
    } catch (err) { setProfileError('Failed to reach backend.'); }
    finally { setSavingProfile(false); }
  }

  async function generatePlan() {
    setLoadingPlan(true); setPlanStatus(''); setPlanError('');
    try {
      const response = await fetch('http://localhost:3001/api/plan/generate', { method: 'POST' });
      const data = await response.json();
      if (!response.ok) { setPlanError(data.message || data.error || 'Error generating plan'); return; }
      setPlan(data.plan); setSelectedWeekNumber(1); setPlanStatus('Plan ready.');
    } catch (err) { setPlanError('Failed to reach backend.'); }
    finally { setLoadingPlan(false); }
  }

  async function fetchPlan() {
    setLoadingPlan(true); setPlanStatus(''); setPlanError('');
    try {
      const response = await fetch('http://localhost:3001/api/plan');
      const data = await response.json();
      if (!response.ok) { setPlanError(data.message || 'Error fetching plan'); return; }
      setPlan(data.plan || data); setSelectedWeekNumber(1); setPlanStatus('Plan loaded.');
    } catch (err) { setPlanError('Failed to reach backend.'); }
    finally { setLoadingPlan(false); }
  }

  function toggleDayStatus(weekNum, dayId) {
    setPlan(prev => {
      if (!prev) return prev;
      return { ...prev, weeks: prev.weeks.map(week => {
        if (week.weekNumber !== weekNum) return week;
        return { ...week, days: week.days.map(day => {
          if (day.id !== dayId) return day;
          const next = (day.status || 'planned').toLowerCase() === 'planned' ? 'done' : 'planned';
          return { ...day, status: next };
        })};
      })};
    });
  }

  const selectedWeek = plan?.weeks?.find(w => w.weekNumber === selectedWeekNumber);
  const doneDays = selectedWeek?.days.filter(d => d.status === 'done').length ?? 0;
  const totalDays = selectedWeek?.days.length ?? 0;
  const progressPct = totalDays > 0 ? (doneDays / totalDays) * 100 : 0;

  const profileFields = [
    { label: 'Name', name: 'name', type: 'text', placeholder: 'Your name' },
    { label: 'Age', name: 'age', type: 'number', placeholder: '—' },
    { label: 'Weekly KM', name: 'currentWeeklyKm', type: 'number', placeholder: '—' },
    { label: 'Days / Week', name: 'daysPerWeek', type: 'number', placeholder: '—' },
    { label: 'Weeks to Race', name: 'weeksToGoal', type: 'number', placeholder: '—' },
    { label: 'Weight (kg)', name: 'weight', type: 'number', placeholder: '—' },
    { label: 'Current PR', name: 'currentPR', type: 'text', placeholder: 'e.g. 48:30' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#080808' }}>
      <header style={{ borderBottom: '1px solid #1e1e1e', padding: '1.5rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 28, height: 28, background: '#e8ff47', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>⚡</div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em' }}>PACE</div>
            <div style={{ fontSize: '0.55rem', color: '#444', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '-1px' }}>AI Running Coach</div>
          </div>
        </div>
        {plan && (
          <div style={{ display: 'flex', gap: '2rem' }}>
            {[{ label: 'Goal', value: plan.goalType?.toUpperCase() }, { label: 'Weeks', value: plan.weeks?.length }].map(s => (
              <div key={s.label} style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.55rem', color: '#444', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{s.label}</div>
                <div style={{ fontSize: '0.9rem', color: '#e8ff47', fontWeight: 600, marginTop: '1px' }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}
      </header>

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '3rem 2rem 6rem' }}>
        <section style={{ marginBottom: '3.5rem' }} className="fade-up">
          <div className="section-label">Profile</div>
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: '1.8rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.2rem', marginBottom: '1.5rem' }}>
              {profileFields.map(f => (
                <div key={f.name}>
                  <div className="field-label">{f.label}</div>
                  <input type={f.type} name={f.name} value={profile[f.name]} onChange={handleProfileChange} placeholder={f.placeholder} />
                </div>
              ))}
              <div>
                <div className="field-label">Goal Race</div>
                <select name="goalType" value={profile.goalType} onChange={handleProfileChange}>
                  {['2k','3k','5k','10k','21.1k','42.2k'].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <div className="field-label">Fitness Level</div>
                <select name="fitnessLevel" value={profile.fitnessLevel} onChange={handleProfileChange}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={saveProfile} disabled={savingProfile}>{savingProfile ? 'Saving...' : 'Save Profile'}</button>
              {profileStatus && <span style={{ fontSize: '0.7rem', color: '#e8ff47', letterSpacing: '0.05em' }}>{profileStatus}</span>}
              {profileError && <span style={{ fontSize: '0.7rem', color: '#e06c6c' }}>{profileError}</span>}
            </div>
          </div>
        </section>

        <section className="fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <div className="section-label">Training Plan</div>
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: '1.5rem 1.8rem', marginBottom: plan ? '1.5rem' : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={generatePlan} disabled={loadingPlan}>{loadingPlan ? 'Generating...' : 'Generate Plan'}</button>
              <button className="btn-ghost" onClick={fetchPlan} disabled={loadingPlan}>Load Saved</button>
              {planStatus && <span style={{ fontSize: '0.7rem', color: '#e8ff47' }}>{planStatus}</span>}
              {planError && <span style={{ fontSize: '0.7rem', color: '#e06c6c' }}>{planError}</span>}
            </div>
            {!plan && !loadingPlan && (
              <p style={{ fontSize: '0.72rem', color: '#444', marginTop: '1rem', lineHeight: 1.6 }}>Save your profile above, then generate your personalized AI training plan.</p>
            )}
          </div>

          {plan?.weeks?.length > 0 && (
            <div className="fade-up">
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {plan.weeks.map(week => {
                  const done = week.days.filter(d => d.status === 'done').length;
                  const complete = done === week.days.length;
                  const active = week.weekNumber === selectedWeekNumber;
                  return (
                    <button key={week.weekNumber} className={`week-tab${active ? ' active' : ''}${complete ? ' complete' : ''}`} onClick={() => setSelectedWeekNumber(week.weekNumber)}>
                      W{week.weekNumber}{complete ? ' ✓' : ''}
                    </button>
                  );
                })}
              </div>

              {selectedWeek && (
                <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: '1.5rem 1.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                    <div>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.2rem' }}>Week {selectedWeek.weekNumber}</div>
                      <div style={{ fontSize: '0.65rem', color: '#444', letterSpacing: '0.08em' }}>{doneDays}/{totalDays} sessions complete</div>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                      {selectedWeek.totalKm && <div className="stat">Total Volume<span>{selectedWeek.totalKm} km</span></div>}
                      <div className="stat">Progress<span style={{ color: '#e8ff47' }}>{Math.round(progressPct)}%</span></div>
                    </div>
                  </div>
                  <div className="progress-track"><div className="progress-fill" style={{ width: `${progressPct}%` }} /></div>

                  {selectedWeek.days.map(day => {
                    const t = theme[day.type] || theme.rest;
                    const done = day.status === 'done';
                    return (
                      <div key={day.id} className="day-card" style={{ background: done ? 'rgba(74,217,106,0.04)' : t.bg, border: `1px solid ${done ? '#2a5a2a' : t.border}` }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: done ? '#4ad96a' : t.dot, borderRadius: '2px 0 0 2px' }} />
                        <div style={{ minWidth: 32, fontSize: '0.65rem', color: '#444', letterSpacing: '0.05em', paddingLeft: '0.5rem' }}>
                          {String(day.dayIndex).padStart(2, '0')}
                        </div>
                        <div style={{ minWidth: 100 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: done ? '#4ad96a' : t.dot, flexShrink: 0 }} />
                            <span style={{ fontSize: '0.7rem', fontFamily: 'Syne, sans-serif', fontWeight: 600, color: done ? '#4ad96a' : '#f5f5f5', letterSpacing: '0.05em' }}>
                              {typeLabel[day.type] || day.type}
                            </span>
                          </div>
                        </div>
                        <div style={{ flex: 1, fontSize: '0.7rem', color: '#666', lineHeight: 1.5 }}>{day.description}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', minWidth: 70 }}>
                          {day.type !== 'rest' && day.distanceKm > 0 && (
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '1rem', fontWeight: 500, color: done ? '#4ad96a' : '#e8ff47' }}>{day.distanceKm}</span>
                              <span style={{ fontSize: '0.6rem', color: '#444', marginLeft: '0.2rem' }}>km</span>
                            </div>
                          )}
                          <button className={`btn-tiny${done ? ' done' : ''}`} onClick={() => toggleDayStatus(selectedWeek.weekNumber, day.id)}>
                            {done ? '✓ Done' : 'Mark Done'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
