// Durgadas Pagare Portfolio interactions
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) window.lucide.createIcons();

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  menuToggle?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    menuToggle.innerHTML = open ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    if (window.lucide) window.lucide.createIcons();
  });

  document.querySelectorAll(".nav-link, .nav-resume, .footer-links a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks?.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // Skill category filters
  const filterButtons = document.querySelectorAll("[data-skill-filter]");
  const skillCards = document.querySelectorAll(".skill-card");
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.skillFilter;
      skillCards.forEach(card => {
        const show = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hidden", !show);
      });
    });
  });

  // Reveal sections as they enter the viewport
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // Highlight the navigation item for the section in view
  const sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll(".nav-link").forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Front-end demo form: validates fields, but does not send an email without a backend/service.
  const form = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");
  const toast = document.getElementById("toast");
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3800);
  }
  form?.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    formNote.textContent = "Thanks! The form is validated, but email delivery needs a backend or email service.";
    showToast("Form validated. Connect an email service to receive this message.");
    form.reset();
  });

  // Make the resume link helpful until the real PDF is supplied.
  const resumeButton = document.getElementById("resumeButton");
  resumeButton?.addEventListener("click", event => {
    fetch("assets/resume.pdf", { method: "HEAD" }).then(response => {
      if (!response.ok) {
        event.preventDefault();
        showToast("Add your resume PDF at assets/resume.pdf to enable downloading.");
      }
    }).catch(() => {
      event.preventDefault();
      showToast("Add your resume PDF at assets/resume.pdf to enable downloading.");
    });
  });

  document.getElementById("year").textContent = new Date().getFullYear();
});
