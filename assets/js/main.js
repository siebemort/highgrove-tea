// Highgrove Tea — landingspagina: dagboog die met de scroll meeloopt, video, inschrijfformulier.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------- de dagboog
  const day = document.querySelector('.day');
  const moments = [...document.querySelectorAll('.moment')];
  const sun = document.querySelector('.sun'), halo = document.querySelector('.sun-halo');
  const tEl = document.querySelector('.clock-time'), mEl = document.querySelector('.clock-moment');
  const ANG = [162, 118, 62, 18];
  let cur = 0, target = 0, raf = null;
  const pos = a => { const r = a * Math.PI / 180; return [220 + 200 * Math.cos(r), 220 - 200 * Math.sin(r)]; };
  const angleAt = u => { const i = Math.min(2, Math.floor(u)), f = u - i; return ANG[i] + (ANG[i + 1] - ANG[i]) * f; };
  function draw(u) {
    const [x, y] = pos(angleAt(u));
    for (const el of [sun, halo]) { el.setAttribute('cx', x.toFixed(1)); el.setAttribute('cy', y.toFixed(1)); }
  }
  function tick() {
    cur += (target - cur) * 0.12;
    if (Math.abs(target - cur) < 0.002) cur = target;
    draw(cur);
    raf = cur === target ? null : requestAnimationFrame(tick);
  }
  function activate(i) {
    const m = moments[i];
    day.style.setProperty('--day-bg', m.dataset.bg);
    day.style.setProperty('--sun', m.dataset.sun);
    tEl.textContent = m.dataset.time; mEl.textContent = m.dataset.moment;
    target = i;
    if (reduce) { cur = i; draw(i); return; }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  if (day && moments.length) {
    draw(0);
    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) activate(+e.target.dataset.i);
    }, { rootMargin: '-45% 0px -45% 0px' });
    moments.forEach(m => io.observe(m));
  }

  // ---------------------------------------------------------- video (speelt pas als je erom vraagt of hij in beeld komt)
  const video = document.querySelector('.video-arch video'), vBtn = document.querySelector('.video-toggle');
  if (video && vBtn) {
    const set = playing => { vBtn.textContent = playing ? 'Pauzeer' : 'Speel de dagboog af'; vBtn.setAttribute('aria-pressed', playing); };
    vBtn.addEventListener('click', () => { if (video.paused) { video.play(); set(true); } else { video.pause(); set(false); } });
    if (!reduce) new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { video.play().then(() => set(true)).catch(() => {}); } else if (!video.paused) { video.pause(); set(false); }
    }, { threshold: .5 }).observe(video);
  }

  // ---------------------------------------------------------- inschrijven
  const form = document.getElementById('ml-form');
  if (!form) return;
  const status = document.getElementById('form-status');
  const f = { name: form.querySelector('#f-name'), email: form.querySelector('#f-email'), optin: form.querySelector('#f-optin') };
  const show = (k, bad) => { document.getElementById('e-' + k).hidden = !bad; if (f[k].type !== 'checkbox') f[k].setAttribute('aria-invalid', bad); };
  const okEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

  form.addEventListener('submit', async ev => {
    ev.preventDefault();
    const bad = { name: !f.name.value.trim(), email: !okEmail(f.email.value), optin: !f.optin.checked };
    Object.entries(bad).forEach(([k, v]) => show(k, v));
    const first = Object.keys(bad).find(k => bad[k]);
    if (first) { f[first].focus(); return; }

    const acc = form.dataset.mlAccount, id = form.dataset.mlForm;
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true; status.textContent = 'Even geduld…';
    const name = f.name.value.trim().split(' ')[0];
    try {
      if (acc && id) {
        // MailerLite (nieuwe versie): zelfde endpoint als de officiële embed-code
        await fetch(`https://assets.mailerlite.com/jsonp/${acc}/forms/${id}/subscribe`, { method: 'POST', body: new FormData(form), mode: 'no-cors' });
        status.textContent = `Dank je, ${name}. Check je inbox: je eerste zettip en je welkomstvoordeel zijn onderweg. Zie je niets? Kijk even bij je reclame of spam.`;
      } else {
        status.textContent = `Dank je, ${name}. (Demo: dit formulier is nog niet gekoppeld aan MailerLite, er werd niets verstuurd.)`;
      }
      form.classList.add('is-done');
      status.setAttribute('tabindex', '-1'); status.focus();
    } catch (e) {
      status.textContent = 'Inschrijven lukte niet. Controleer je internetverbinding en probeer het opnieuw.';
      btn.disabled = false;
    }
  });
  for (const k of ['name', 'email']) f[k].addEventListener('input', () => { if (f[k].getAttribute('aria-invalid') === 'true') show(k, k === 'email' ? !okEmail(f.email.value) : !f.name.value.trim()); });
  f.optin.addEventListener('change', () => { if (f.optin.checked) show('optin', false); });
})();
