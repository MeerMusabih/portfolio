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

// ---------- 6. Contact form (Formspree) ----------
const FORM_ENDPOINT = "https://formspree.io/f/xzepqkzy";
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // stay on the page instead of redirecting

     const submitButton = contactForm.querySelector('button[type="submit"]');
submitButton.disabled = true;
submitButton.textContent = "Sending...";

    // Endpoint not configured yet — tell the owner instead of failing silently
    if (FORM_ENDPOINT.indexOf("YOUR_") === 0) {
      formStatus.textContent = "Form endpoint is not configured yet — please use the email link above.";
      formStatus.className = "form-status err";
       
      return;
    }

    const data = Object.fromEntries(new FormData(contactForm));
    formStatus.textContent = "Sending\u2026";
    formStatus.className = "form-status";

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        formStatus.textContent = "Message sent \u2014 thank you!";
        formStatus.className = "form-status ok";
        contactForm.reset();
      } else {
        formStatus.textContent = "Something went wrong. Please email me directly instead.";
        formStatus.className = "form-status err";
         submitButton.disabled = false;
submitButton.textContent = "Send Message";
      }
    } catch {
      formStatus.textContent = "Network error. Please email me directly instead.";
      formStatus.className = "form-status err";
       submitButton.disabled = false;
submitButton.textContent = "Send Message";
    }
  });
}
