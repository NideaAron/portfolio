(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  /* theme: saved choice, default is dark purple */
  root.dataset.theme = localStorage.getItem('theme') || 'dark';
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
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: .15 });
    $$('.reveal').forEach(el => io.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('visible'));
  }

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


  /* lightweight animated particle background; respects reduced-motion settings */
  if (!reduce) {
    const canvas = document.createElement('canvas');
    canvas.id = 'particleCanvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      let width = 0, height = 0, particles = [], raf = 0;
      const colors = ['190, 193, 200', '235, 236, 239', '125, 129, 137'];
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        width = window.innerWidth; height = window.innerHeight;
        canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = Math.min(65, Math.max(22, Math.floor(width / 20)));
        particles = Array.from({length: count}, () => ({
          x: Math.random()*width, y: Math.random()*height,
          vx: (Math.random()-.5)*.32, vy: (Math.random()-.5)*.32,
          r: Math.random()*1.7+.6, c: colors[Math.floor(Math.random()*colors.length)]
        }));
      };
      const draw = () => {
        ctx.clearRect(0, 0, width, height);
        const maxDist = width < 600 ? 85 : 125;
        for (let i=0; i<particles.length; i++) {
          const p=particles[i]; p.x+=p.vx; p.y+=p.vy;
          if(p.x < -5) p.x=width+5; if(p.x > width+5) p.x=-5;
          if(p.y < -5) p.y=height+5; if(p.y > height+5) p.y=-5;
          ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
          ctx.fillStyle=`rgba(${p.c},.7)`; ctx.fill();
          for(let j=i+1;j<particles.length;j++){
            const q=particles[j], dx=p.x-q.x, dy=p.y-q.y, d=Math.hypot(dx,dy);
            if(d<maxDist){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
              ctx.strokeStyle=`rgba(175,179,187,${(1-d/maxDist)*.12})`;ctx.lineWidth=.7;ctx.stroke();}
          }
        }
        raf=requestAnimationFrame(draw);
      };
      resize(); draw();
      addEventListener('resize', resize, {passive:true});
      document.addEventListener('visibilitychange',()=>{
        if(document.hidden){cancelAnimationFrame(raf)} else {cancelAnimationFrame(raf);draw()}
      });
    }
  }
})();
