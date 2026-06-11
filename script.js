const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Tunn vit linje högst upp som visar hur långt ner på sidan man är.
(function () {
  const bar = document.getElementById("progress");
  if (!bar) return;
  function onScroll() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// 3D-lutning på mockuperna när muspekaren rör sig över dem (endast desktop).
(function () {
  if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
  const MAX = 7;
  document.querySelectorAll(".browser, .dashboard").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1200px) rotateY(${x * MAX}deg) rotateX(${-y * MAX}deg)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
})();

// Scrollytelling: er hemsida idag → med oss → förfrågningar, i takt med scrollen.
(function () {
  const section = document.querySelector(".scrolly");
  const browser = document.getElementById("builder");
  const label = document.getElementById("builder-label");
  const steps = Array.from(document.querySelectorAll(".scrolly-step"));
  const dots = Array.from(document.querySelectorAll(".scrolly-progress i"));
  if (!section || !browser || steps.length === 0) return;

  const labels = [
    "Er hemsida idag",
    "Er hemsida — med oss",
    "Ny offertförfrågan inkommen",
  ];

  const mobile = window.matchMedia("(max-width: 900px)");

  function setPhase(phase) {
    browser.dataset.phase = String(phase);
    label.textContent = labels[phase];
    steps.forEach((el, i) => el.classList.toggle("is-active", i === phase));
    dots.forEach((el, i) => el.classList.toggle("is-active", i <= phase));
  }

  if (reduceMotion) {
    setPhase(2);
    return;
  }

  function onScroll() {
    if (mobile.matches) {
      setPhase(2);
      return;
    }
    const rect = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight;
    const progress = Math.min(1, Math.max(0, -rect.top / total));
    setPhase(progress < 0.33 ? 0 : progress < 0.66 ? 1 : 2);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();

// Dashboarden: kurvan ritas, siffrorna räknas upp och aviseringar dyker upp
// när sektionen scrollas in.
(function () {
  const dash = document.getElementById("dashboard");
  if (!dash) return;

  const counters = Array.from(dash.querySelectorAll(".count"));

  function countUp(el) {
    const target = parseInt(el.dataset.target, 10);
    const start = parseInt(el.textContent, 10) || 0;
    const duration = 1800;
    const t0 = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = Math.round(start + (target - start) * eased);
      el.textContent = value.toLocaleString("sv-SE");
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function activate() {
    dash.classList.add("dash-on");
    counters.forEach(countUp);
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    dash.classList.add("dash-on");
    counters.forEach((el) => {
      el.textContent = parseInt(el.dataset.target, 10).toLocaleString("sv-SE");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        activate();
        observer.disconnect();
      }
    },
    { threshold: 0.35 }
  );
  observer.observe(dash);
})();

// Manifestet: orden tänds ett efter ett i takt med scrollen.
(function () {
  const text = document.getElementById("manifesto-text");
  if (!text) return;

  const words = text.textContent.trim().split(/\s+/);
  text.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(" ");
  const spans = Array.from(text.querySelectorAll(".w"));

  if (reduceMotion) {
    spans.forEach((s) => s.classList.add("lit"));
    return;
  }

  function onScroll() {
    const rect = text.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.min(1, Math.max(0, (vh * 0.85 - rect.top) / (vh * 0.7)));
    const lit = Math.floor(progress * spans.length);
    spans.forEach((s, i) => s.classList.toggle("lit", i < lit));
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// Scrollavslöjanden för kort och rubriker.
(function () {
  const targets = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  targets.forEach((el) => observer.observe(el));
})();
