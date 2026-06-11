const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Scrollytelling: stegen växlar och mockupen byggs medan sektionen scrollas.
(function () {
  const section = document.querySelector(".scrolly");
  const browser = document.getElementById("builder");
  const label = document.getElementById("builder-label");
  const steps = Array.from(document.querySelectorAll(".scrolly-step"));
  const dots = Array.from(document.querySelectorAll(".scrolly-progress i"));
  if (!section || !browser || steps.length === 0) return;

  const labels = [
    "Skriver din beskrivning …",
    "Bygger din hemsida …",
    "Publicerad på dittforetag.se",
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
    // 0 när texten kommer in nedifrån, 1 när den passerat mitten
    const progress = Math.min(1, Math.max(0, (vh * 0.85 - rect.top) / (vh * 0.7)));
    const lit = Math.floor(progress * spans.length);
    spans.forEach((s, i) => s.classList.toggle("lit", i < lit));
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// Scrollavslöjanden för kort, exempel och FAQ.
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
