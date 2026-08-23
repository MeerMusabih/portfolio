/* ==========================================================================
   Meer Musabih — Portfolio interactions
   1. Mobile navigation (hamburger)
   2. Header background on scroll
   3. Active nav-link highlighting
   4. Scroll-reveal animations
   5. Current year in footer
   ========================================================================== */

// ---------- 1. Mobile navigation ----------
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  // aria-expanded tells screen readers whether the menu is open
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

function closeMenu() {
  navLinks.classList.remove("open");
  navToggle.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
}

// Close the menu when a link inside it is clicked
navLinks.addEventListener("click", (e) => {
  if (e.target.matches(".nav-link")) closeMenu();
});

// Close with the Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

// ---------- 2. Header background once page is scrolled ----------
const header = document.getElementById("siteHeader");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
}, { passive: true });

// ---------- 3. Active nav link + 4. scroll reveal ----------
// One IntersectionObserver watches every section; as a section enters the
// middle of the viewport we highlight its nav link.
const sections = document.querySelectorAll("main section[id]");
const links = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      links.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === "#" + id
        );
      });
    });
  },
  { rootMargin: "-40% 0px -55% 0px" } // "active zone" around viewport middle
);
sections.forEach((sec) => sectionObserver.observe(sec));

// A second observer fades elements in the first time they appear.
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // animate only once
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ---------- 5. Current year in the footer ----------
document.getElementById("year").textContent = new Date().getFullYear();
