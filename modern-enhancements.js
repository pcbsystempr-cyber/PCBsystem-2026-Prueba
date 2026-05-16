/* ==========================================================
   MODERN ENHANCEMENTS — PCB Pablo Colón Berdecia
   - Scroll progress
   - Reveal animations on scroll
   - Stat counter
   - FAQ accordion
   - Card spotlight (cursor-following light)
   - 3D tilt for hero cards
   - Back-to-top
   - Header parallax shift on scroll
   - Floating orbs injection
   - Hero wave & badges injection
   - Footer enrichment
   ========================================================== */
(function () {
  'use strict';

  // Helper: query with default empty NodeList
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const $  = (sel, root = document) => root.querySelector(sel);

  // ============== 1. SCROLL PROGRESS BAR ==============
  function initScrollProgress() {
    if (document.querySelector('.pcb-scroll-progress')) return;
    const bar = document.createElement('div');
    bar.className = 'pcb-scroll-progress';
    document.body.appendChild(bar);

    let ticking = false;
    function update() {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      bar.style.width = pct + '%';
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  // ============== 2. FLOATING ORBS INSIDE HERO ==============
  function initOrbs() {
    const hero = $('.hero');
    if (!hero || $('.pcb-orb-container', hero)) return;
    const container = document.createElement('div');
    container.className = 'pcb-orb-container';
    container.setAttribute('aria-hidden', 'true');
    container.innerHTML = `
      <div class="pcb-orb pcb-orb-1"></div>
      <div class="pcb-orb pcb-orb-2"></div>
      <div class="pcb-orb pcb-orb-3"></div>
    `;
    hero.appendChild(container);
  }

  // ============== 3. HERO ENHANCEMENTS ==============
  function initHero() {
    const hero = $('.hero .hero-content-centered');
    if (!hero) return;

    // Inject badges if not present
    if (!$('.hero-badges', hero)) {
      const badges = document.createElement('div');
      badges.className = 'hero-badges';
      badges.innerHTML = `
        <span class="hero-badge"><span class="dot"></span>Acreditada DEPR</span>
        <span class="hero-badge cyan"><span class="dot"></span>Programas vocacionales</span>
        <span class="hero-badge gold"><span class="dot"></span>+50 años de excelencia</span>
      `;
      hero.appendChild(badges);
    }

    // Inject scroll cue
    const heroSection = $('.hero');
    if (heroSection && !$('.hero-scroll-cue', heroSection)) {
      const cue = document.createElement('div');
      cue.className = 'hero-scroll-cue';
      cue.innerHTML = `
        <div class="mouse"></div>
        <span>Desliza</span>
      `;
      heroSection.appendChild(cue);
    }

    // Inject SVG wave at bottom
    if (heroSection && !$('.hero-wave', heroSection)) {
      const wave = document.createElement('div');
      wave.className = 'hero-wave';
      wave.setAttribute('aria-hidden', 'true');
      wave.innerHTML = `
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="var(--bg)" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,53.3C1120,53,1280,75,1360,85.3L1440,96L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"/>
        </svg>
      `;
      heroSection.appendChild(wave);
    }
  }

  // ============== 4. CARD SPOTLIGHT (cursor light) ==============
  function initCardSpotlight() {
    const cards = $$('.card, .service-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        card.style.setProperty('--mx', x + 'px');
        card.style.setProperty('--my', y + 'px');
      });
    });
  }

  // ============== 5. 3D TILT (subtle) ==============
  function initTilt() {
    const tiltCards = $$('.card.pcb-tilt, .pcb-value-card');
    tiltCards.forEach(card => {
      let raf = null;
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const rx = (0.5 - y) * 8;
        const ry = (x - 0.5) * 8;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
        });
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ============== 6. REVEAL ON SCROLL ==============
  function initReveal() {
    // Auto-add reveal to common elements if not already there
    $$('.section-header').forEach(el => el.classList.add('reveal-up'));
    $$('.grid-2, .grid-3').forEach(el => el.classList.add('stagger'));
    $$('.pcb-stats-grid').forEach(el => el.classList.add('stagger'));
    $$('.pcb-values').forEach(el => el.classList.add('stagger'));
    $$('.pcb-faq').forEach(el => el.classList.add('stagger'));
    $$('.pcb-testimonials').forEach(el => el.classList.add('stagger'));
    $$('.pcb-map-wrap').forEach(el => el.classList.add('reveal-scale'));
    $$('.gaming-block').forEach(el => el.classList.add('reveal-up'));
    $$('.calendar-wrapper').forEach(el => el.classList.add('reveal-scale'));
    $$('.slideshow-container').forEach(el => el.classList.add('reveal-scale'));

    const targets = $$('.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .stagger');
    if (!('IntersectionObserver' in window) || targets.length === 0) {
      targets.forEach(t => t.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(t => io.observe(t));
  }

  // ============== 7. STAT COUNTER ==============
  function animateCounter(el) {
    const target = parseFloat(el.dataset.count || el.textContent.replace(/[^\d.]/g, '')) || 0;
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1800;
    const start = performance.now();
    const startVal = 0;
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const val = startVal + (target - startVal) * eased;
      const display = Number.isInteger(target) ? Math.floor(val) : val.toFixed(1);
      el.textContent = prefix + display + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function initStatCounters() {
    const stats = $$('.pcb-stat-num[data-count]');
    if (stats.length === 0) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    stats.forEach(s => io.observe(s));
  }

  // ============== 8. FAQ ACCORDION ==============
  function initFAQ() {
    $$('.pcb-faq-item').forEach(item => {
      const q = $('.pcb-faq-q', item);
      if (!q) return;
      q.addEventListener('click', () => {
        const wasOpen = item.classList.contains('open');
        // Close siblings (single open)
        const faq = item.closest('.pcb-faq');
        if (faq) {
          $$('.pcb-faq-item', faq).forEach(i => i.classList.remove('open'));
        }
        if (!wasOpen) item.classList.add('open');
      });
    });
  }

  // ============== 9. BACK-TO-TOP BUTTON ==============
  function initBackToTop() {
    if ($('.pcb-back-to-top')) return;
    const btn = document.createElement('button');
    btn.className = 'pcb-back-to-top';
    btn.setAttribute('aria-label', 'Volver arriba');
    btn.setAttribute('title', 'Volver arriba');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    let ticking = false;
    function update() {
      if (window.scrollY > 600) btn.classList.add('visible');
      else btn.classList.remove('visible');
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  }

  // ============== 10. FOOTER ENRICHMENT ==============
  function enrichFooter() {
    const footer = $('.site-footer .container');
    if (!footer) return;
    // If already enriched, skip
    if ($('.pcb-footer-grid', footer)) return;

    const original = footer.innerHTML;
    const year = new Date().getFullYear();

    footer.innerHTML = `
      <div class="pcb-footer-grid">
        <div class="pcb-footer-col pcb-footer-brand">
          <img src="LOGO6.png" alt="Logo PCB">
          <h3>Pablo Colón Berdecia</h3>
          <p>Escuela Superior Vocacional comprometida con la excelencia académica, técnica y humana.</p>
          <div class="pcb-footer-socials">
            <a href="https://www.facebook.com/p/Escuela-Superior-Vocacional-Pablo-Col%C3%B3n-Berdecia-100057389681928/?locale=es_LA" target="_blank" rel="noopener" title="Facebook">📘</a>
            <a href="https://www.instagram.com/clase.eunoiia/" target="_blank" rel="noopener" title="Instagram">📷</a>
            <a href="mailto:contacto@pcbsystem.com" title="Correo">✉️</a>
            <a href="tel:+17878572897" title="Teléfono">📞</a>
          </div>
        </div>
        <div class="pcb-footer-col">
          <h4 data-translate="Navegación">Navegación</h4>
          <a href="#inicio">Inicio</a>
          <a href="#escuela">La escuela</a>
          <a href="#programas">Programas</a>
          <a href="#servicios">Servicios</a>
          <a href="#vida">Vida estudiantil</a>
          <a href="#contacto">Contacto</a>
        </div>
        <div class="pcb-footer-col">
          <h4 data-translate="Servicios">Servicios</h4>
          <a href="biblioteca.html">📚 Biblioteca</a>
          <a href="comedor.html">🍽️ Comedor</a>
          <a href="padres.html">👨‍👩‍👧 Padres</a>
          <a href="seguridad.html">🛡️ Seguridad</a>
          <a href="PCBLearning.html">🎓 PCBLearning</a>
          <a href="admin.html">⚙️ Admin</a>
        </div>
        <div class="pcb-footer-col">
          <h4 data-translate="Contacto">Contacto</h4>
          <p>📍 Carretera 156<br>Barranquitas, PR</p>
          <p>📞 +1 787-857-2897</p>
          <p>🕘 Lun – Vie<br>7:30 AM – 2:30 PM</p>
        </div>
      </div>
      <div class="pcb-footer-bottom">
        &copy; ${year} <strong>Escuela Superior Vocacional Pablo Colón Berdecia</strong>. Todos los derechos reservados.
        <br><span style="font-size:0.78rem;opacity:0.7;">Hecho con 💙 por estudiantes del programa Computec</span>
      </div>
    `;
  }

  // ============== 11. NEW SECTIONS INJECTION ==============
  function injectStatsSection() {
    if ($('#pcb-stats-section')) return;
    const anchor = $('#clas-graduanda');
    if (!anchor) return;

    const section = document.createElement('section');
    section.id = 'pcb-stats-section';
    section.className = 'pcb-stats';
    section.innerHTML = `
      <div class="container">
        <div class="pcb-stats-grid">
          <div class="pcb-stat">
            <div class="pcb-stat-icon">🎓</div>
            <div class="pcb-stat-num" data-count="850" data-suffix="+">0</div>
            <div class="pcb-stat-label" data-translate="Estudiantes activos">Estudiantes activos</div>
          </div>
          <div class="pcb-stat">
            <div class="pcb-stat-icon">👩‍🏫</div>
            <div class="pcb-stat-num" data-count="65" data-suffix="+">0</div>
            <div class="pcb-stat-label" data-translate="Maestros y personal">Maestros y personal</div>
          </div>
          <div class="pcb-stat">
            <div class="pcb-stat-icon">📚</div>
            <div class="pcb-stat-num" data-count="12">0</div>
            <div class="pcb-stat-label" data-translate="Programas vocacionales">Programas vocacionales</div>
          </div>
          <div class="pcb-stat">
            <div class="pcb-stat-icon">🏆</div>
            <div class="pcb-stat-num" data-count="50" data-suffix="+">0</div>
            <div class="pcb-stat-label" data-translate="Años formando líderes">Años formando líderes</div>
          </div>
          <div class="pcb-stat">
            <div class="pcb-stat-icon">💼</div>
            <div class="pcb-stat-num" data-count="95" data-suffix="%">0</div>
            <div class="pcb-stat-label" data-translate="Tasa de empleabilidad">Tasa de empleabilidad</div>
          </div>
        </div>
      </div>
    `;
    anchor.parentNode.insertBefore(section, anchor);
  }

  function injectValuesSection() {
    if ($('#pcb-values-section')) return;
    const anchor = $('#escuela');
    if (!anchor) return;

    const section = document.createElement('section');
    section.id = 'pcb-values-section';
    section.className = 'section section-alt';
    section.innerHTML = `
      <div class="container">
        <div class="section-header reveal-up">
          <span class="section-eyebrow" data-translate="Nuestra identidad">Nuestra identidad</span>
          <h2 data-translate="Misión, visión y valores">Misión, visión y valores</h2>
          <p data-translate="Los pilares que guían cada día nuestro compromiso educativo.">Los pilares que guían cada día nuestro compromiso educativo.</p>
        </div>
        <div class="pcb-values stagger">
          <div class="pcb-value-card pcb-tilt">
            <div class="pcb-value-icon">🎯</div>
            <h3 data-translate="Misión">Misión</h3>
            <p data-translate="Formar estudiantes íntegros con destrezas técnicas, académicas y socioemocionales que respondan a las demandas del mundo actual.">
              Formar estudiantes íntegros con destrezas técnicas, académicas y socioemocionales que respondan a las demandas del mundo actual.
            </p>
          </div>
          <div class="pcb-value-card pcb-tilt">
            <div class="pcb-value-icon">🔭</div>
            <h3 data-translate="Visión">Visión</h3>
            <p data-translate="Ser una institución líder en educación vocacional, reconocida por la innovación pedagógica y la formación integral de líderes del mañana.">
              Ser una institución líder en educación vocacional, reconocida por la innovación pedagógica y la formación integral de líderes del mañana.
            </p>
          </div>
          <div class="pcb-value-card pcb-tilt">
            <div class="pcb-value-icon">🌱</div>
            <h3 data-translate="Valores">Valores</h3>
            <p data-translate="Respeto, responsabilidad, excelencia, integridad, innovación y compromiso comunitario marcan nuestra ruta.">
              Respeto, responsabilidad, excelencia, integridad, innovación y compromiso comunitario marcan nuestra ruta.
            </p>
          </div>
          <div class="pcb-value-card pcb-tilt">
            <div class="pcb-value-icon">🤝</div>
            <h3 data-translate="Compromiso">Compromiso</h3>
            <p data-translate="Acompañamos a cada estudiante con un trato cercano, basado en altas expectativas y un firme apoyo emocional.">
              Acompañamos a cada estudiante con un trato cercano, basado en altas expectativas y un firme apoyo emocional.
            </p>
          </div>
        </div>
      </div>
    `;
    anchor.parentNode.insertBefore(section, anchor.nextSibling);
  }

  function injectTestimonialsSection() {
    if ($('#pcb-testimonials-section')) return;
    const anchor = $('#vida');
    if (!anchor) return;

    const section = document.createElement('section');
    section.id = 'pcb-testimonials-section';
    section.className = 'section';
    section.innerHTML = `
      <div class="container">
        <div class="section-header reveal-up">
          <span class="section-eyebrow" data-translate="Voces de la comunidad">Voces de la comunidad</span>
          <h2 data-translate="Lo que dicen nuestros estudiantes">Lo que dicen nuestros estudiantes</h2>
          <p data-translate="Historias reales de quienes viven la experiencia PCB cada día.">Historias reales de quienes viven la experiencia PCB cada día.</p>
        </div>
        <div class="pcb-testimonials stagger">
          <div class="pcb-testi-card">
            <div class="pcb-testi-stars">★★★★★</div>
            <p class="pcb-testi-quote">"En PCB encontré mucho más que clases. Encontré mentores que creyeron en mí y una vocación que ahora es mi carrera."</p>
            <div class="pcb-testi-author">
              <div class="pcb-testi-avatar">JR</div>
              <div>
                <div class="pcb-testi-name">Javier R.</div>
                <div class="pcb-testi-role">Egresado, Computec 2024</div>
              </div>
            </div>
          </div>
          <div class="pcb-testi-card">
            <div class="pcb-testi-stars">★★★★★</div>
            <p class="pcb-testi-quote">"El programa de Enfermería me dio la práctica y la confianza para entrar a la universidad ya con experiencia clínica real."</p>
            <div class="pcb-testi-author">
              <div class="pcb-testi-avatar">MS</div>
              <div>
                <div class="pcb-testi-name">María S.</div>
                <div class="pcb-testi-role">Estudiante, 12mo grado</div>
              </div>
            </div>
          </div>
          <div class="pcb-testi-card">
            <div class="pcb-testi-stars">★★★★★</div>
            <p class="pcb-testi-quote">"Como madre, agradezco la comunicación constante de la escuela. Siempre sé cómo va mi hijo y eso me da tranquilidad."</p>
            <div class="pcb-testi-author">
              <div class="pcb-testi-avatar">LT</div>
              <div>
                <div class="pcb-testi-name">Luisa T.</div>
                <div class="pcb-testi-role">Madre de familia</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    anchor.parentNode.insertBefore(section, anchor);
  }

  function injectFAQSection() {
    if ($('#pcb-faq-section')) return;
    const anchor = $('#contacto');
    if (!anchor) return;

    const section = document.createElement('section');
    section.id = 'pcb-faq-section';
    section.className = 'section section-alt';
    section.innerHTML = `
      <div class="container">
        <div class="section-header reveal-up">
          <span class="section-eyebrow" data-translate="Resolvemos tus dudas">Resolvemos tus dudas</span>
          <h2 data-translate="Preguntas frecuentes">Preguntas frecuentes</h2>
          <p data-translate="Encuentra respuestas rápidas a las preguntas más comunes sobre nuestra escuela.">Encuentra respuestas rápidas a las preguntas más comunes sobre nuestra escuela.</p>
        </div>
        <div class="pcb-faq">
          <div class="pcb-faq-item">
            <button class="pcb-faq-q">
              <span data-translate="¿Cómo me matriculo en la escuela?">¿Cómo me matriculo en la escuela?</span>
              <span class="pcb-faq-q-icon">+</span>
            </button>
            <div class="pcb-faq-a">
              <div class="pcb-faq-a-inner" data-translate="La matrícula se realiza de forma oficial a través del portal del Departamento de Educación. También puedes acercarte a la oficina de matrícula con tu récord de notas, certificado de nacimiento e identificación del encargado.">
                La matrícula se realiza de forma oficial a través del portal del Departamento de Educación. También puedes acercarte a la oficina de matrícula con tu récord de notas, certificado de nacimiento e identificación del encargado.
              </div>
            </div>
          </div>
          <div class="pcb-faq-item">
            <button class="pcb-faq-q">
              <span data-translate="¿Qué programas vocacionales ofrecen?">¿Qué programas vocacionales ofrecen?</span>
              <span class="pcb-faq-q-icon">+</span>
            </button>
            <div class="pcb-faq-a">
              <div class="pcb-faq-a-inner" data-translate="Ofrecemos Computec, Enfermería, Cosmetología, Artes Culinarias, Productos Agrícolas, Empresarismo, Seguridad Pública y más. Puedes ver el detalle en la sección de Programas y en Casa Abierta.">
                Ofrecemos Computec, Enfermería, Cosmetología, Artes Culinarias, Productos Agrícolas, Empresarismo, Seguridad Pública y más. Puedes ver el detalle en la sección de Programas y en Casa Abierta.
              </div>
            </div>
          </div>
          <div class="pcb-faq-item">
            <button class="pcb-faq-q">
              <span data-translate="¿Cómo puedo contactar a un maestro?">¿Cómo puedo contactar a un maestro?</span>
              <span class="pcb-faq-q-icon">+</span>
            </button>
            <div class="pcb-faq-a">
              <div class="pcb-faq-a-inner" data-translate="Tenemos un directorio público de correos electrónicos por departamento. Lo puedes consultar en Servicios al Estudiante → Correos Electrónicos.">
                Tenemos un directorio público de correos electrónicos por departamento. Lo puedes consultar en Servicios al Estudiante → Correos Electrónicos.
              </div>
            </div>
          </div>
          <div class="pcb-faq-item">
            <button class="pcb-faq-q">
              <span data-translate="¿Tienen apoyo socioemocional?">¿Tienen apoyo socioemocional?</span>
              <span class="pcb-faq-q-icon">+</span>
            </button>
            <div class="pcb-faq-a">
              <div class="pcb-faq-a-inner" data-translate="Sí. Contamos con orientación, trabajo social y un equipo de apoyo socioemocional accesible para toda la comunidad. Puedes acceder al servicio desde el menú de Servicios Digitales.">
                Sí. Contamos con orientación, trabajo social y un equipo de apoyo socioemocional accesible para toda la comunidad. Puedes acceder al servicio desde el menú de Servicios Digitales.
              </div>
            </div>
          </div>
          <div class="pcb-faq-item">
            <button class="pcb-faq-q">
              <span data-translate="¿Cómo reporto un incidente?">¿Cómo reporto un incidente?</span>
              <span class="pcb-faq-q-icon">+</span>
            </button>
            <div class="pcb-faq-a">
              <div class="pcb-faq-a-inner" data-translate="Tenemos un sistema confidencial en la sección de Seguridad Escolar. Puedes reportar de forma anónima cualquier situación de riesgo o acoso.">
                Tenemos un sistema confidencial en la sección de Seguridad Escolar. Puedes reportar de forma anónima cualquier situación de riesgo o acoso.
              </div>
            </div>
          </div>
          <div class="pcb-faq-item">
            <button class="pcb-faq-q">
              <span data-translate="¿Dónde está ubicada la escuela?">¿Dónde está ubicada la escuela?</span>
              <span class="pcb-faq-q-icon">+</span>
            </button>
            <div class="pcb-faq-a">
              <div class="pcb-faq-a-inner" data-translate="Carretera 156 salida hacia Comerío, Barranquitas, Puerto Rico. Puedes ver el mapa interactivo en la sección de Contacto.">
                Carretera 156 salida hacia Comerío, Barranquitas, Puerto Rico. Puedes ver el mapa interactivo en la sección de Contacto.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    anchor.parentNode.insertBefore(section, anchor);
  }

  function injectMapInContact() {
    const contactSection = $('#contacto .container');
    if (!contactSection || $('.pcb-map-wrap', contactSection)) return;
    const mapWrap = document.createElement('div');
    mapWrap.className = 'pcb-map-wrap';
    mapWrap.style.marginTop = '2.5rem';
    mapWrap.innerHTML = `
      <iframe
        src="https://www.google.com/maps?q=Escuela+Superior+Vocacional+Pablo+Col%C3%B3n+Berdecia+Barranquitas+Puerto+Rico&output=embed"
        loading="lazy"
        title="Ubicación de la Escuela"
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>
    `;
    contactSection.appendChild(mapWrap);
  }

  // ============== 12. ENHANCE EXISTING SECTION HEADERS ==============
  function enhanceSectionHeaders() {
    // Add eyebrow tags to known sections if not present
    const map = {
      '#escuela':         { eyebrow: 'Conoce PCB' },
      '#programas':       { eyebrow: 'Oferta vocacional' },
      '#servicios':       { eyebrow: 'Recursos para ti' },
      '#servicios-maestro':{ eyebrow: 'Para nuestro personal' },
      '#portal-padres':   { eyebrow: 'Familia PCB' },
      '#seguridad-escolar':{ eyebrow: 'Tu seguridad importa' },
      '#calendario-escolar':{ eyebrow: 'Año escolar' },
      '#vida':            { eyebrow: 'Comunidad y eventos' },
      '#contacto':        { eyebrow: 'Hablemos' },
      '#clas-graduanda':  { eyebrow: 'Generación 2026' },
      '#publicar-anuncio':{ eyebrow: 'Tu voz' }
    };
    Object.keys(map).forEach(sel => {
      const sec = $(sel);
      if (!sec) return;
      const header = $('.section-header', sec);
      if (!header || $('.section-eyebrow', header)) return;
      const eb = document.createElement('span');
      eb.className = 'section-eyebrow';
      eb.textContent = map[sel].eyebrow;
      header.insertBefore(eb, header.firstChild);
    });
  }

  // ============== 13. INIT ALL ==============
  // Detección de tipo de página
  function isHomePage() {
    // La home tiene: #escuela + #vida + #contacto
    return !!($('#escuela') && $('#vida') && $('#contacto'));
  }
  function hasHero() { return !!$('.hero'); }
  function hasStandardChrome() { return !!$('.site-header') || !!$('.site-footer'); }

  function initAll() {
    // SIEMPRE: efectos globales (funcionan en cualquier página)
    initScrollProgress();
    initCardSpotlight();
    initTilt();
    initReveal();
    initBackToTop();

    // Si hay hero: enhances del hero (badges, scroll cue, wave, orbes)
    if (hasHero()) {
      initOrbs();
      initHero();
    }

    // Solo en la home: secciones nuevas (stats, valores, testimonios, FAQ, mapa)
    if (isHomePage()) {
      injectStatsSection();
      injectValuesSection();
      injectTestimonialsSection();
      injectFAQSection();
      injectMapInContact();
      initStatCounters();
      initFAQ();
    }

    // Eyebrows y footer enriquecido solo si hay chrome del sitio
    if (hasStandardChrome()) {
      enhanceSectionHeaders();
      enrichFooter();
    }

    // Re-run translation if available so new sections become bilingual
    if (typeof window.translatePage === 'function') {
      const lang = localStorage.getItem('language') || 'es';
      try { window.translatePage(lang); } catch (e) {}
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
