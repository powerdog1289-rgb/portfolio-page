"use strict";

/* =========================================
   1. Mobile Navigation (Burger-Menü)
   ========================================= */
function initNavigation() {
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.querySelector(".nav__menu");
  const links = document.querySelectorAll(".nav__link");

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    menu.classList.toggle("nav__menu--open", !isOpen);
  });

  // Menü schliessen, wenn ein Link angeklickt wird
  links.forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("nav__menu--open");
    });
  });
}

/* =========================================
   2. Header-Schatten beim Scrollen
   ========================================= */
function initHeaderShadow() {
  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("site-header--scrolled", window.scrollY > 10);
  });
}

/* =========================================
   3. Tipp-Animation im Hero
   ========================================= */
function initTypingEffect() {
  const element = document.querySelector(".typing");
  if (!element) return;

  const words = JSON.parse(element.dataset.words);
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const currentWord = words[wordIndex];
    charIndex += isDeleting ? -1 : 1;
    element.textContent = currentWord.slice(0, charIndex);

    let delay = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
      delay = 1800; // Wort kurz stehen lassen
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400;
    }

    setTimeout(tick, delay);
  }

  tick();
}

/* =========================================
   4. Elemente beim Scrollen einblenden
   ========================================= */
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal--visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

function observeReveal(elements) {
  elements.forEach((el) => revealObserver.observe(el));
}

/* =========================================
   5. Aktiven Menüpunkt hervorheben
   ========================================= */
function initActiveNavLink() {
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".nav__link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle(
            "nav__link--active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: "-50% 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

/* =========================================
   6. Projekte aus projects.json laden
   ========================================= */
function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "project-card reveal";

  const tags = project.tags.map((tag) => `<li>${tag}</li>`).join("");

  card.innerHTML = `
    <div class="project-card__image" aria-hidden="true">${project.initials}</div>
    <div class="project-card__body">
      <h3 class="project-card__title">${project.title}</h3>
      <p class="project-card__meta">${project.period}</p>
      <p class="project-card__text">${project.description}</p>
      <ul class="project-card__tags">${tags}</ul>
    </div>
  `;
  return card;
}

async function loadProjects() {
  const grid = document.getElementById("projects-grid");

  try {
    const response = await fetch("projects.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const projects = await response.json();

    grid.innerHTML = "";
    projects.forEach((project, index) => {
      const card = createProjectCard(project);
      card.style.transitionDelay = `${index * 0.1}s`; // Karten nacheinander
      grid.appendChild(card);
    });

    observeReveal(grid.querySelectorAll(".reveal"));
  } catch (error) {
    console.error("Projekte konnten nicht geladen werden:", error);
    grid.innerHTML = '<p class="projects__error">Projekte konnten nicht geladen werden.</p>';
  }
}

/* =========================================
   7. Start
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  initNavigation();
  initHeaderShadow();
  initTypingEffect();
  initActiveNavLink();
  observeReveal(document.querySelectorAll(".reveal"));
  loadProjects();
});