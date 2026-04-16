const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const navToggle = document.getElementById("navToggle");
const primaryNav = document.getElementById("primary-nav");
const navBackdrop = document.getElementById("navBackdrop");

if (navToggle && primaryNav && navBackdrop) {
  const mqDesktop = window.matchMedia("(min-width: 961px)");

  function setNavOpen(open) {
    document.body.classList.toggle("nav-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Închide meniul" : "Deschide meniul");
    navBackdrop.setAttribute("aria-hidden", String(!open));
  }

  function closeNav() {
    setNavOpen(false);
  }

  navToggle.addEventListener("click", () => {
    setNavOpen(!document.body.classList.contains("nav-open"));
  });

  navBackdrop.addEventListener("click", closeNav);

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (document.body.classList.contains("product-modal-open")) {
        return;
      }
      closeNav();
    }
  });

  function closeNavOnDesktop() {
    if (mqDesktop.matches) {
      closeNav();
    }
  }

  if (typeof mqDesktop.addEventListener === "function") {
    mqDesktop.addEventListener("change", closeNavOnDesktop);
  } else if (typeof mqDesktop.addListener === "function") {
    mqDesktop.addListener(closeNavOnDesktop);
  }
}

const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el) => revealObserver.observe(el));

const quoteForm = document.getElementById("quoteForm");
const formStatus = document.getElementById("formStatus");

if (quoteForm && formStatus) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(quoteForm);
    const name = formData.get("name");
    formStatus.textContent = `Mulțumim, ${name}! Am primit cererea și revenim curând.`;
    quoteForm.reset();
  });
}
