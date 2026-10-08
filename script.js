(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  /* theme: saved choice, else system setting */
  const saved = localStorage.getItem('theme');
  root.dataset.theme = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  $('#themeBtn').addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('theme', next);
  });

  /* mobile menu */
  const menuBtn = $('#menuBtn'), links = $('#links');
  const setMenu = open => {
    links.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
  };
  menuBtn.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  $$('#links a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* typing effect in the aron.js editor */
  const lines = [
    [['k', 'const '], ['', 'aron = {']],
    [['', '  program: '], ['s', '"BSIT"'], ['', ',']],
    [['', '  focus: ['], ['s', '"web"'], ['', ', '], ['s', '"databases"'], ['', '],']],
    [['', '  learning: '], ['s', '"always"'], ['', ',']],
    [['', '};']]
  ];
  const out = $('#typed');
  if (reduce) {
    out.innerHTML = lines.map(l => l.map(([c, t]) => `<span class="${c}">${t}</span>`).join('')).join('\n');
  } else {
    let li = 0, si = 0, ci = 0, cur = null;
    const tick = () => {
      if (li >= lines.length) return;
      const [cls, text] = lines[li][si];
      if (ci === 0) {
        cur = document.createElement('span');
        cur.className = cls;
        out.appendChild(cur);
      }
      cur.textContent += text[ci++];
      let delay = 38 + Math.random() * 40;
      if (ci >= text.length) {
        ci = 0; si++;
        if (si >= lines[li].length) {
          li++; si = 0; out.append('\n'); delay = 280;
        }
      }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 900);
  }

  /* scroll reveal */
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: .15 });
  $$('.reveal').forEach(el => io.observe(el));

  /* scroll progress, nav shadow, back-to-top, education line */
  const bar = $('#progress'), nav = $('#nav'), toTop = $('#toTop'), tl = $('.timeline');
  const onScroll = () => {
    const max = root.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
    nav.classList.toggle('scrolled', scrollY > 10);
    toTop.classList.toggle('show', scrollY > 600);
    const r = tl.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * .7 - r.top) / r.height));
    tl.style.setProperty('--tl', p * 100 + '%');
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => scrollTo({ top: 0 }));

  /* active nav link */
  const navLinks = $$('#links a');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section').forEach(s => spy.observe(s));

  /* project filter */
  const cards = $$('.card');
  $$('.chip').forEach(chip => chip.addEventListener('click', () => {
    $$('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const f = chip.dataset.filter;
    cards.forEach(card => {
      const show = f === 'all' || card.dataset.cat.split(' ').includes(f);
      card.classList.toggle('hide', !show);
      if (show) { card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop'); }
    });
  }));

  /* 3D tilt on cards (mouse only) */
  if (!reduce && matchMedia('(hover:hover)').matches) {
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => card.style.transform = '');
    });
  }
})();
