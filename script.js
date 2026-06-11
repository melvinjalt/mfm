// Hero-demon: minisidan byggs upp, står klar en stund och börjar om.
(function () {
  const browser = document.getElementById("builder");
  const label = document.getElementById("builder-label");
  if (!browser || !label) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    browser.classList.add("built");
    label.textContent = "Din hemsida är klar";
    return;
  }

  const BUILD_TIME = 2800;   // blockens infasning (matchar CSS-fördröjningarna)
  const HOLD_TIME = 3500;    // hur länge den färdiga sidan visas
  const RESET_TIME = 700;

  function cycle() {
    label.textContent = "Bygger din hemsida …";
    browser.classList.add("built");
    setTimeout(() => {
      label.textContent = "Din hemsida är klar";
    }, BUILD_TIME);
    setTimeout(() => {
      browser.classList.remove("built");
      setTimeout(cycle, RESET_TIME);
    }, BUILD_TIME + HOLD_TIME);
  }

  setTimeout(cycle, 400);
})();

// Scrollavslöjanden för sektionernas kort.
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targets = document.querySelectorAll(".step, .feature, .example, .price-card, details");
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  targets.forEach((el) => el.classList.add("reveal"));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  targets.forEach((el) => observer.observe(el));
})();
