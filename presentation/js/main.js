/* =========================================================
   Cloud Computing avec AWS · Moteur du diaporama (JS pur)
   Navigation, fragments, animations, simulations, vue présentateur
   ========================================================= */
(() => {
  'use strict';

  const stage = document.getElementById('stage');
  const deck = document.getElementById('deck');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const phasebar = document.getElementById('phasebar');
  const pageNum = document.getElementById('pageNum');
  const timerBadge = document.getElementById('timer');
  const overview = document.getElementById('overview');
  const help = document.getElementById('help');

  // Détection du mode présentateur (?speaker=1)
  const params = new URLSearchParams(location.search);
  if (params.get('speaker') === '1') {
    document.body.classList.add('speaker');
  }

  // Synchronisation inter-onglets (fenêtre principale <-> vue présentateur)
  let bc = null;
  try {
    bc = new BroadcastChannel('aws_deck_sync_v1');
  } catch (_) {}

  let curSlide = 0;
  let curStep = 0;
  let syncing = false;

  // Chronomètre 12 min
  let timerRunning = false;
  let elapsedSec = 0;
  let timerInterval = null;

  // Timers / RAF actifs de la slide courante (nettoyés au changement de slide)
  let slideTimers = [];
  let slideRafs = [];

  function later(fn, ms) {
    const id = setTimeout(fn, ms);
    slideTimers.push(id);
    return id;
  }
  function animFrame(fn) {
    const id = requestAnimationFrame(fn);
    slideRafs.push(id);
    return id;
  }
  function clearSlideTasks() {
    slideTimers.forEach(clearTimeout);
    slideRafs.forEach(cancelAnimationFrame);
    slideTimers = [];
    slideRafs = [];
  }

  /* =========================================================
     1 · Mise à l'échelle 1600×900 dans #stage
     ========================================================= */
  function fitDeck() {
    const rect = stage.getBoundingClientRect();
    const scale = Math.min(rect.width / 1600, rect.height / 900);
    deck.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(4)})`;
  }
  window.addEventListener('resize', fitDeck);

  /* =========================================================
     2 · Génération de la slide 6 (IaaS / PaaS / SaaS)
     ========================================================= */
  function buildServiceStack() {
    const host = document.getElementById('svcStack');
    if (!host) return;
    const layers = [
      'Données',
      'Applications',
      'Exécution (Runtime)',
      'Middleware',
      'Système (OS)',
      'Virtualisation',
      'Serveurs',
      'Stockage',
      'Réseau'
    ];
    const cols = [
      { name: 'On-premise', sub: '🍕 Fait maison', youCount: 9, ex: 'Salle serveur interne' },
      { name: 'IaaS', sub: '🍕 Pizza à cuire', youCount: 5, ex: 'Exemple AWS : <b>Amazon EC2</b>' },
      { name: 'PaaS', sub: '🍕 Livraison', youCount: 2, ex: 'Exemple AWS : <b>Elastic Beanstalk · RDS</b>' },
      { name: 'SaaS', sub: '🍕 Restaurant', youCount: 0, ex: 'Exemple AWS : <b>WorkMail · Connect</b>' }
    ];
    host.innerHTML = cols.map((col, idx) => {
      const fragAttr = idx > 0 ? ` class="svc-col frag" data-frag="${idx}"` : ` class="svc-col"`;
      const stackHtml = layers.map((l, i) => {
        const who = i < col.youCount ? 'you' : 'aws';
        return `<div class="layer ${who}">${l}</div>`;
      }).join('');
      return `
        <div${fragAttr}>
          <div class="svc-head"><b>${col.name}</b><span>${col.sub}</span></div>
          ${stackHtml}
          <div class="svc-ex">${col.ex}</div>
        </div>
      `;
    }).join('');
  }

  /* =========================================================
     3 · Indexation des fragments par slide
     ========================================================= */
  function indexFragments() {
    slides.forEach((s) => {
      const frags = Array.from(s.querySelectorAll('.frag'));
      let autoIdx = 1;
      // Si certains ont déjà data-frag, on respecte, sinon on numérote dans l'ordre DOM
      frags.forEach((el) => {
        if (!el.dataset.frag) {
          el.dataset.frag = String(autoIdx++);
        }
      });
      const maxFrag = frags.reduce((m, el) => Math.max(m, parseInt(el.dataset.frag, 10) || 0), 0);
      // Aussi vérifier les déclencheurs data-on="1:edge 2:failover"
      const onEls = Array.from(s.querySelectorAll('[data-on]'));
      let maxOn = 0;
      onEls.forEach((el) => {
        el.dataset.on.split(/\s+/).forEach((pair) => {
          const k = parseInt(pair.split(':')[0], 10);
          if (k > maxOn) maxOn = k;
        });
      });
      s.dataset.maxStep = String(Math.max(maxFrag, maxOn));
    });
  }

  /* =========================================================
     4 · Barre de progression Buyer Journey + Sommaire
     ========================================================= */
  const phases = [
    { id: 'awareness', label: '1 · Awareness · Pourquoi ? (3:00)' },
    { id: 'consideration', label: '2 · Consideration · Comment ça marche ? (4:45)' },
    { id: 'decision', label: '3 · Decision · Passer à l\'action (4:15)' },
    { id: 'annex', label: 'Annexes' }
  ];

  function buildPhasebar() {
    phasebar.innerHTML = phases.map((p) => {
      const count = slides.filter((s) => s.dataset.phase === p.id).length;
      return `
        <div class="ph ph-${p.id}" data-phase="${p.id}" style="flex:${Math.max(count, 1)}">
          <span class="ph-label">${p.label}</span>
          <span class="ph-track"><i class="ph-fill"></i></span>
        </div>
      `;
    }).join('');
  }

  function updatePhasebar() {
    const activeSlide = slides[curSlide];
    const activePhase = activeSlide.dataset.phase;
    let passedPhase = true;

    phases.forEach((p) => {
      const phEl = phasebar.querySelector(`.ph-${p.id}`);
      const fill = phEl.querySelector('.ph-fill');
      const phaseSlides = slides.filter((s) => s.dataset.phase === p.id);

      phEl.classList.remove('current', 'done');
      if (p.id === activePhase) {
        passedPhase = false;
        phEl.classList.add('current');
        const idxInPhase = phaseSlides.indexOf(activeSlide);
        const pct = ((idxInPhase + 1) / phaseSlides.length) * 100;
        fill.style.width = `${pct}%`;
      } else if (passedPhase) {
        phEl.classList.add('done');
        fill.style.width = '100%';
      } else {
        fill.style.width = '0%';
      }
    });
  }

  function buildOverview() {
    const grid = overview.querySelector('.ov-grid');
    grid.innerHTML = slides.map((s, i) => `
      <button class="ov-card ph-${s.dataset.phase}" data-goto="${i}">
        <span class="ov-num">SLIDE ${String(i + 1).padStart(2, '0')} · ${s.dataset.phase.toUpperCase()}</span>
        <b>${s.dataset.title || ''}</b>
        <span class="ov-time">Fin cible : ${s.dataset.end || '12:00'}</span>
      </button>
    `).join('');
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-goto]');
      if (!btn) return;
      overview.classList.remove('open');
      goTo(parseInt(btn.dataset.goto, 10), 0);
    });
  }

  /* =========================================================
     5 · Rendu d'une slide et de son step
     ========================================================= */
  let prevSlideIdx = -1;
  let prevStepIdx = -1;

  function applyStep(slide, step) {
    const frags = slide.querySelectorAll('.frag');
    frags.forEach((el) => {
      const f = parseInt(el.dataset.frag, 10) || 1;
      el.classList.toggle('visible', f <= step);
    });

    // Gestion des attributs data-on="1:edge 2:failover"
    slide.querySelectorAll('[data-on]').forEach((el) => {
      el.dataset.on.split(/\s+/).forEach((pair) => {
        const [kStr, cls] = pair.split(':');
        const k = parseInt(kStr, 10);
        if (cls) el.classList.toggle(cls, step >= k);
      });
    });
  }

  function goTo(slideIdx, stepIdx = 0, broadcast = true) {
    slideIdx = Math.max(0, Math.min(slides.length - 1, slideIdx));
    const targetSlide = slides[slideIdx];
    const maxStep = parseInt(targetSlide.dataset.maxStep, 10) || 0;
    stepIdx = Math.max(0, Math.min(maxStep, stepIdx));

    const slideChanged = slideIdx !== prevSlideIdx;
    const stepChanged = stepIdx !== prevStepIdx;
    curSlide = slideIdx;
    curStep = stepIdx;

    slides.forEach((s, i) => {
      s.classList.toggle('active', i === curSlide);
      s.classList.toggle('past', i < curSlide);
    });

    deck.classList.toggle('is-title', curSlide === 0);
    pageNum.textContent = `${curSlide + 1} / ${slides.length}`;
    updatePhasebar();

    applyStep(targetSlide, curStep);

    // Sommaire
    overview.querySelectorAll('.ov-card').forEach((c, i) => {
      c.classList.toggle('current', i === curSlide);
    });

    if (slideChanged) {
      clearSlideTasks();
      onSlideEnter(targetSlide.id, curStep);
    } else if (stepChanged) {
      onStepChange(targetSlide.id, curStep);
    }

    prevSlideIdx = curSlide;
    prevStepIdx = curStep;

    updateSpeakerPanel();

    // Hash URL (ex: #s9)
    if (history.replaceState) {
      history.replaceState(null, '', `#s${curSlide + 1}`);
    }

    if (broadcast && bc && !syncing) {
      bc.postMessage({ type: 'nav', slide: curSlide, step: curStep });
    }
  }

  function next() {
    const s = slides[curSlide];
    const maxStep = parseInt(s.dataset.maxStep, 10) || 0;
    if (curStep < maxStep) {
      goTo(curSlide, curStep + 1);
    } else if (curSlide < slides.length - 1) {
      goTo(curSlide + 1, 0);
    }
  }

  function prev() {
    if (curStep > 0) {
      goTo(curSlide, curStep - 1);
    } else if (curSlide > 0) {
      const prevS = slides[curSlide - 1];
      const maxStep = parseInt(prevS.dataset.maxStep, 10) || 0;
      goTo(curSlide - 1, maxStep);
    }
  }

  /* =========================================================
     6 · Animations spécifiques par slide
     ========================================================= */
  function onSlideEnter(id, step) {
    if (id === 's1') runTypewriter();
    if (id === 's2') runCrashChart();
    if (id === 's3') runCountersAndBars();
    if (id === 's9') {
      resetArchSim();
      if (step >= 5) runArchSim();
    }
    if (id === 's13') runDemoTerminal();
  }

  function onStepChange(id, step) {
    if (id === 's9') {
      if (step === 5) runArchSim();
      else if (step < 5) resetArchSim();
    }
  }

  /* --- S1 : Machine à écrire --- */
  function runTypewriter() {
    const s1 = document.getElementById('s1');
    const h1 = s1.querySelector('.typewriter');
    const full = h1.dataset.text || '';
    s1.classList.remove('typed');
    h1.innerHTML = '<span class="txt"></span><span class="caret"></span>';
    const txtSpan = h1.querySelector('.txt');
    let i = 0;

    function tick() {
      if (i <= full.length) {
        txtSpan.textContent = full.slice(0, i);
        i++;
        later(tick, i === 1 ? 250 : 42);
      } else {
        s1.classList.add('typed');
      }
    }
    tick();
  }

  /* --- S2 : Courbe de trafic & crash 503 --- */
  function runCrashChart() {
    const s2 = document.getElementById('s2');
    const card = s2.querySelector('.chart-card');
    const canvas = document.getElementById('trafficChart');
    if (!canvas) return;
    card.classList.remove('crashed');

    const dpr = window.devicePixelRatio || 1;
    const W = 880;
    const H = 430;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const pad = { l: 64, r: 28, t: 28, b: 44 };
    const pw = W - pad.l - pad.r;
    const ph = H - pad.t - pad.b;

    // Points (heure -> utilisateurs, max 3200)
    const pts = [
      [0.00, 40],
      [0.12, 48],
      [0.24, 55],
      [0.36, 90],
      [0.44, 240],
      [0.50, 750],
      [0.56, 1750],
      [0.62, 3000] // midi : crash !
    ];
    const maxY = 3300;
    const capY = 500; // capacité serveur physique

    const toX = (u) => pad.l + u * pw;
    const toY = (v) => pad.t + ph - (v / maxY) * ph;

    const start = performance.now();
    const dur = 2100;
    let crashedTriggered = false;

    function drawFrame(now) {
      const t = Math.min(1, (now - start) / dur);
      ctx.clearRect(0, 0, W, H);

      // Grille horizontale
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 1;
      ctx.fillStyle = '#7e92a8';
      ctx.font = '600 13px Inter, sans-serif';
      [0, 1000, 2000, 3000].forEach((val) => {
        const y = toY(val);
        ctx.beginPath();
        ctx.moveTo(pad.l, y);
        ctx.lineTo(W - pad.r, y);
        ctx.stroke();
        ctx.fillText(val.toString(), 14, y + 4);
      });

      // Labels heures
      const hours = [
        [0.0, '09:00'],
        [0.25, '10:30'],
        [0.5, '11:45'],
        [0.62, '12:00'],
        [0.85, '13:00']
      ];
      hours.forEach(([u, lbl]) => {
        ctx.fillText(lbl, toX(u) - 18, H - 14);
      });

      // Ligne capacité serveur
      const yCap = toY(capY);
      ctx.save();
      ctx.strokeStyle = '#ff5d73';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(pad.l, yCap);
      ctx.lineTo(W - pad.r, yCap);
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = '#ff8a9b';
      ctx.font = '700 13px Inter, sans-serif';
      ctx.fillText('Capacité max du serveur physique (500)', pad.l + 12, yCap - 10);

      // Courbe animée jusqu'à uMax = 0.62 * t
      const uMax = 0.62 * t;
      const drawn = [];
      for (let i = 0; i < pts.length; i++) {
        const [u, v] = pts[i];
        if (u <= uMax) {
          drawn.push([toX(u), toY(v)]);
        } else if (i > 0) {
          const [u0, v0] = pts[i - 1];
          const r = (uMax - u0) / (u - u0);
          const uInterp = u0 + r * (u - u0);
          const vInterp = v0 + r * (v - v0);
          drawn.push([toX(uInterp), toY(vInterp)]);
          break;
        }
      }

      if (drawn.length > 1) {
        // Aire sous la courbe
        const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + ph);
        grad.addColorStop(0, 'rgba(255, 93, 115, 0.45)');
        grad.addColorStop(1, 'rgba(255, 153, 0, 0.04)');
        ctx.beginPath();
        ctx.moveTo(drawn[0][0], toY(0));
        drawn.forEach(([x, y]) => ctx.lineTo(x, y));
        ctx.lineTo(drawn[drawn.length - 1][0], toY(0));
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Trait
        ctx.beginPath();
        drawn.forEach(([x, y], idx) => (idx === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
        ctx.strokeStyle = t > 0.72 ? '#ff5d73' : '#ff9900';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Point courant
        const [lx, ly] = drawn[drawn.length - 1];
        ctx.beginPath();
        ctx.arc(lx, ly, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
      }

      if (t >= 1 && !crashedTriggered) {
        crashedTriggered = true;
        card.classList.add('crashed');
      }

      if (t < 1) {
        animFrame(drawFrame);
      }
    }

    animFrame(drawFrame);
  }

  /* --- S3 : Compteurs + barres --- */
  function runCountersAndBars() {
    const s3 = document.getElementById('s3');
    const nums = s3.querySelectorAll('.num[data-count]');
    const dur = 1400;
    const start = performance.now();

    function step(now) {
      const p = Math.min(1, (now - start) / dur);
      const ease = 1 - Math.pow(1 - p, 3);
      nums.forEach((el) => {
        const target = parseFloat(el.dataset.count);
        const dec = parseInt(el.dataset.decimals || '0', 10);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const val = (target * ease).toFixed(dec).replace('.', ',');
        el.textContent = `${prefix}${val}${suffix}`;
      });
      if (p < 1) animFrame(step);
    }
    animFrame(step);

    // Barres de parts de marché
    s3.querySelectorAll('.mbar i').forEach((bar) => {
      bar.style.width = '0%';
      later(() => {
        bar.style.width = `${bar.dataset.v}%`;
      }, 120);
    });
  }

  /* --- S9 : Simulation du pic de midi sur AWS --- */
  function resetArchSim() {
    const arch = document.getElementById('arch');
    const cw = document.getElementById('cwNode');
    if (!arch) return;
    arch.classList.remove('spike');
    if (cw) cw.classList.remove('alarm');
    arch.querySelectorAll('.ec2.extra').forEach((el) => el.classList.remove('on'));

    const clk = document.getElementById('simClock');
    const u = document.getElementById('simUsers');
    const inst = document.getElementById('simInst');
    const cpu = document.getElementById('simCpu');
    const g = document.getElementById('simGauge');
    const st = document.getElementById('simStatus');
    const cost = document.getElementById('simCost');
    if (!clk) return;

    clk.textContent = '11:55';
    u.textContent = '50';
    inst.textContent = '2';
    cpu.textContent = '12 %';
    g.style.width = '12%';
    g.className = '';
    st.className = 'sim-status';
    st.textContent = 'Trafic normal · 2 instances EC2 actives';
    cost.textContent = '0,00 $';
  }

  function runArchSim() {
    clearSlideTasks();
    resetArchSim();

    const arch = document.getElementById('arch');
    const cw = document.getElementById('cwNode');
    const extras = Array.from(arch.querySelectorAll('.ec2.extra'));
    const clk = document.getElementById('simClock');
    const u = document.getElementById('simUsers');
    const inst = document.getElementById('simInst');
    const cpu = document.getElementById('simCpu');
    const g = document.getElementById('simGauge');
    const st = document.getElementById('simStatus');
    const cost = document.getElementById('simCost');

    const keyframes = [
      {
        at: 300,
        clock: '11:58',
        users: '620',
        inst: '2',
        cpu: 58,
        gaugeCls: 'warm',
        statusCls: 'warn',
        status: 'Hausse rapide du trafic à l\'approche de midi…',
        cost: '0,01 $',
        spike: true,
        alarm: false,
        extraCount: 0
      },
      {
        at: 1800,
        clock: '12:00',
        users: '1 950',
        inst: '2',
        cpu: 86,
        gaugeCls: 'hot',
        statusCls: 'alert',
        status: '⚠️ Alarme CloudWatch : CPU > 70 % → déclenchement Auto Scaling',
        cost: '0,02 $',
        spike: true,
        alarm: true,
        extraCount: 0
      },
      {
        at: 3400,
        clock: '12:02',
        users: '3 000',
        inst: '6',
        cpu: 44,
        gaugeCls: '',
        statusCls: 'info',
        status: '🚀 +4 serveurs EC2 lancés automatiquement · charge répartie par l\'ALB',
        cost: '0,06 $',
        spike: true,
        alarm: false,
        extraCount: 4
      },
      {
        at: 5400,
        clock: '12:30',
        users: '2 850',
        inst: '6',
        cpu: 41,
        gaugeCls: '',
        statusCls: 'ok',
        status: '✓ 3 000 étudiants servis sans aucune coupure (0 erreur 503)',
        cost: '0,09 $',
        spike: true,
        alarm: false,
        extraCount: 4
      },
      {
        at: 7400,
        clock: '14:00',
        users: '110',
        inst: '2',
        cpu: 18,
        gaugeCls: '',
        statusCls: 'ok',
        status: '✓ Fin du pic : 4 serveurs éteints automatiquement · on arrête de payer',
        cost: '0,10 $',
        spike: false,
        alarm: false,
        extraCount: 0
      }
    ];

    keyframes.forEach((kf) => {
      later(() => {
        clk.textContent = kf.clock;
        u.textContent = kf.users;
        inst.textContent = kf.inst;
        cpu.textContent = `${kf.cpu} %`;
        g.style.width = `${kf.cpu}%`;
        g.className = kf.gaugeCls;
        st.className = `sim-status ${kf.statusCls}`;
        st.textContent = kf.status;
        cost.textContent = kf.cost;
        arch.classList.toggle('spike', kf.spike);
        cw.classList.toggle('alarm', kf.alarm);
        extras.forEach((el, i) => el.classList.toggle('on', i < kf.extraCount));
      }, kf.at);
    });
  }

  /* --- S13 : Terminal AWS CLI & aperçu navigateur --- */
  function runDemoTerminal() {
    clearSlideTasks();
    const s13 = document.getElementById('s13');
    const body = s13.querySelector('.term-body');
    const browser = s13.querySelector('.browser');
    const urlSpan = s13.querySelector('.br-url span');

    body.innerHTML = '';
    browser.classList.remove('loading', 'loaded');
    urlSpan.textContent = 'en attente…';

    const script = [
      { type: 'cmt', text: '# 1. Créer le bucket S3 dans la région Paris (eu-west-3)', delay: 200 },
      { type: 'cmd', text: 'aws s3 mb s3://campuseats-demo --region eu-west-3', delay: 650 },
      { type: 'out', text: 'make_bucket: campuseats-demo', delay: 1300 },
      { type: 'cmt', text: '# 2. Envoyer les fichiers du site statique de Léa', delay: 1650 },
      { type: 'cmd', text: 'aws s3 sync ./site s3://campuseats-demo', delay: 2100 },
      { type: 'out', text: 'upload: site/index.html to s3://campuseats-demo/index.html\nupload: site/style.css  to s3://campuseats-demo/style.css', delay: 2800 },
      { type: 'cmt', text: '# 3. Activer l\'hébergement web statique', delay: 3200 },
      { type: 'cmd', text: 'aws s3 website s3://campuseats-demo --index-document index.html', delay: 3700, onRun: () => {
        browser.classList.add('loading');
        urlSpan.textContent = 'http://campuseats-demo.s3-website.eu-west-3.amazonaws.com';
      }},
      { type: 'ok', text: '✓ En ligne : http://campuseats-demo.s3-website.eu-west-3.amazonaws.com', delay: 4500, onRun: () => {
        browser.classList.remove('loading');
        browser.classList.add('loaded');
      }}
    ];

    script.forEach((line) => {
      later(() => {
        const div = document.createElement('div');
        div.className = `tl ${line.type}`;
        if (line.type === 'cmd') {
          div.innerHTML = `<span class="ps">$ </span>${line.text}`;
        } else {
          div.textContent = line.text;
        }
        body.appendChild(div);
        if (line.onRun) line.onRun();
      }, line.delay);
    });
  }

  /* =========================================================
     7 · Chronomètre et vue présentateur
     ========================================================= */
  function fmtTime(sec) {
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, '0')}`;
  }

  function parseTime(str) {
    if (!str) return 720;
    const [m, s] = str.split(':').map((n) => parseInt(n, 10) || 0);
    return m * 60 + s;
  }

  function renderTimer() {
    const active = slides[curSlide];
    const targetSec = parseTime(active.dataset.end);
    const diff = elapsedSec - targetSec;

    let cls = 'st-ok';
    if (diff > 25) cls = 'st-late';
    else if (diff > 0) cls = 'st-warn';

    timerBadge.className = `timer-badge ${cls}`;
    timerBadge.textContent = `⏱ ${fmtTime(elapsedSec)} / 12:00 (cible ${active.dataset.end})`;

    const spElapsed = document.getElementById('spElapsed');
    const spDelta = document.getElementById('spDelta');
    if (spElapsed) {
      spElapsed.textContent = fmtTime(elapsedSec);
      spElapsed.className = cls;
    }
    if (spDelta) {
      if (Math.abs(diff) <= 10) {
        spDelta.textContent = '· dans les temps';
        spDelta.className = 'st-ok';
      } else if (diff > 10) {
        spDelta.textContent = `· +${fmtTime(diff)} de retard`;
        spDelta.className = diff > 25 ? 'st-late' : 'st-warn';
      } else {
        spDelta.textContent = `· ${fmtTime(-diff)} d'avance`;
        spDelta.className = 'st-ok';
      }
    }
  }

  function toggleTimer(forceState) {
    timerRunning = typeof forceState === 'boolean' ? forceState : !timerRunning;
    clearInterval(timerInterval);
    if (timerRunning) {
      timerInterval = setInterval(() => {
        elapsedSec++;
        renderTimer();
      }, 1000);
    }
    renderTimer();
  }

  function resetTimer() {
    toggleTimer(false);
    elapsedSec = 0;
    renderTimer();
  }

  function updateSpeakerPanel() {
    const s = slides[curSlide];
    const maxStep = parseInt(s.dataset.maxStep, 10) || 0;
    const nextS = slides[curSlide + 1];

    const spTarget = document.getElementById('spTarget');
    const spPhase = document.getElementById('spPhase');
    const spNum = document.getElementById('spNum');
    const spStep = document.getElementById('spStep');
    const spTitle = document.getElementById('spTitle');
    const spNotes = document.getElementById('spNotes');
    const spNext = document.getElementById('spNext');

    if (!spTitle) return;
    spTarget.textContent = s.dataset.end || '12:00';
    spPhase.textContent = (s.dataset.phase || '').toUpperCase();
    spNum.textContent = `Slide ${curSlide + 1} / ${slides.length}`;
    spStep.textContent = `Animation ${curStep} / ${maxStep}`;
    spTitle.textContent = s.dataset.title || '';
    const notes = s.querySelector('.notes');
    spNotes.innerHTML = notes ? notes.innerHTML : '<p>Aucune note.</p>';
    spNext.textContent = nextS ? `${ curSlide + 2 }. ${nextS.dataset.title}` : 'Fin du diaporama';
    renderTimer();
  }

  function openSpeakerWindow() {
    const url = new URL(location.href);
    url.searchParams.set('speaker', '1');
    window.open(url.toString(), 'aws_speaker', 'width=1100,height=760');
  }

  /* =========================================================
     8 · Événements clavier, clics, plein écran, synchronisation
     ========================================================= */
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ':
        e.preventDefault();
        if (!timerRunning && curSlide === 0 && curStep === 0) toggleTimer(true);
        next();
        break;
      case 'ArrowLeft':
      case 'PageUp':
      case 'Backspace':
        e.preventDefault();
        prev();
        break;
      case 'Home':
        e.preventDefault();
        goTo(0, 0);
        break;
      case 'End':
        e.preventDefault();
        goTo(slides.length - 1, 0);
        break;
      case 'f':
      case 'F':
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.();
        } else {
          document.exitFullscreen?.();
        }
        break;
      case 'o':
      case 'O':
        overview.classList.toggle('open');
        break;
      case 's':
      case 'S':
        if (document.body.classList.contains('speaker')) {
          document.body.classList.remove('speaker');
          fitDeck();
        } else {
          openSpeakerWindow();
        }
        break;
      case 't':
      case 'T':
        document.body.classList.toggle('show-timer');
        if (!timerRunning) toggleTimer(true);
        break;
      case 'p':
      case 'P':
        toggleTimer();
        break;
      case 'r':
      case 'R':
        resetTimer();
        break;
      case 'b':
      case 'B':
      case '.':
        document.body.classList.toggle('blackout');
        break;
      case '?':
      case 'h':
      case 'H':
        help.classList.toggle('open');
        break;
      case 'Escape':
        overview.classList.remove('open');
        help.classList.remove('open');
        document.body.classList.remove('blackout');
        break;
    }
  });

  document.addEventListener('click', (e) => {
    const act = e.target.closest('[data-action]')?.dataset.action;
    if (!act) return;
    if (act === 'next') next();
    if (act === 'prev') prev();
    if (act === 'close') {
      overview.classList.remove('open');
      help.classList.remove('open');
    }
    if (act === 'replay') {
      const id = slides[curSlide].id;
      if (id === 's2') runCrashChart();
      if (id === 's13') runDemoTerminal();
    }
    if (act === 'sim') runArchSim();
    if (act === 'timer') toggleTimer();
    if (act === 'reset') resetTimer();
  });

  if (bc) {
    bc.onmessage = (ev) => {
      if (ev.data?.type === 'nav') {
        syncing = true;
        goTo(ev.data.slide, ev.data.step, false);
        syncing = false;
      }
    };
  }

  /* =========================================================
     9 · Initialisation
     ========================================================= */
  buildServiceStack();
  indexFragments();
  buildPhasebar();
  buildOverview();
  fitDeck();

  const hashMatch = location.hash.match(/^#s(\d+)$/);
  const startSlide = hashMatch ? Math.max(0, parseInt(hashMatch[1], 10) - 1) : 0;
  goTo(startSlide, 0, false);
})();
