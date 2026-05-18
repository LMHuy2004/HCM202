// ===== PARTICLES =====
(function() {
  const c = document.getElementById('particles-canvas'), ctx = c.getContext('2d');
  let particles = [];
  function resize() { c.width = innerWidth; c.height = innerHeight; }
  addEventListener('resize', resize); resize();
  class P {
    constructor() { this.reset(); }
    reset() { this.x = Math.random()*c.width; this.y = Math.random()*c.height; this.s = Math.random()*2+0.5; this.sx = (Math.random()-0.5)*0.3; this.sy = (Math.random()-0.5)*0.3; this.o = Math.random()*0.4+0.1; this.h = Math.random()>0.5?30:0; }
    update() { this.x+=this.sx; this.y+=this.sy; if(this.x<0||this.x>c.width||this.y<0||this.y>c.height) this.reset(); }
    draw() { ctx.beginPath(); ctx.arc(this.x,this.y,this.s,0,Math.PI*2); ctx.fillStyle=`hsla(${this.h},60%,70%,${this.o})`; ctx.fill(); }
  }
  for(let i=0;i<60;i++) particles.push(new P());
  (function animate() { ctx.clearRect(0,0,c.width,c.height); particles.forEach(p=>{p.update();p.draw();}); requestAnimationFrame(animate); })();
})();

// ===== NAV =====
const nav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section');
addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 50);
  let cur = '';
  sections.forEach(s => { if (scrollY >= s.offsetTop - 200) cur = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
});

// ===== SCROLL ANIMATIONS =====
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('.fade-in, .timeline-item').forEach(el => obs.observe(el));

// ===== AUTO-SCROLL =====
if (location.hash === '#minigame') {
  setTimeout(() => {
    const el = document.getElementById('minigame');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, 500);
}
