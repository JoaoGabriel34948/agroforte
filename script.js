/* =========================================================
   AGROFORTE — Futuro Sustentável
   Interações: menu, scroll, animações, contadores, FAQ, form
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Menu mobile (toggle) ---------- */
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  const closeMenu = () => {
    navMenu.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Fecha o menu ao clicar em um link
  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  /* ---------- Header com fundo ao rolar ---------- */
  const header = document.getElementById("header");
  const backToTop = document.getElementById("back-to-top");

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 40);
    backToTop.classList.toggle("show", y > 500);
    updateActiveLink();
  };

  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Voltar ao topo ---------- */
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Link ativo conforme a seção visível ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (!link) return;
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  }

  /* ---------- Animação de revelação (fade ao rolar) ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Pequeno atraso escalonado para itens irmãos
          const siblings = Array.from(entry.target.parentElement.children).filter(
            (el) => el.classList.contains("reveal")
          );
          const index = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${Math.min(index, 5) * 0.08}s`;
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Contadores animados (impacto) ---------- */
  const counters = document.querySelectorAll(".stat-number");

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutQuad para desaceleração suave
      const eased = 1 - (1 - progress) * (1 - progress);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString("pt-BR") + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString("pt-BR") + suffix;
      }
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((c) => counterObserver.observe(c));

  /* ---------- FAQ acordeão ---------- */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Fecha todos os outros
      faqItems.forEach((other) => {
        other.classList.remove("open");
        other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        other.querySelector(".faq-answer").style.maxHeight = null;
      });

      // Abre o atual se estava fechado
      if (!isOpen) {
        item.classList.add("open");
        question.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ---------- Validação e envio do formulário ---------- */
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = form.nome;
    const email = form.email;
    const mensagem = form.mensagem;
    let valid = true;

    [nome, email, mensagem].forEach((field) => field.classList.remove("invalid"));

    if (nome.value.trim().length < 2) {
      nome.classList.add("invalid");
      valid = false;
    }
    if (!isValidEmail(email.value.trim())) {
      email.classList.add("invalid");
      valid = false;
    }
    if (mensagem.value.trim().length < 5) {
      mensagem.classList.add("invalid");
      valid = false;
    }

    if (!valid) {
      feedback.style.color = "#d64545";
      feedback.textContent = "Por favor, preencha todos os campos corretamente.";
      return;
    }

    // Simula envio bem-sucedido (sem back-end)
    feedback.style.color = "var(--green-dark)";
    feedback.textContent = `Obrigado, ${nome.value.trim().split(" ")[0]}! Sua mensagem foi enviada com sucesso. 🌱`;
    form.reset();

    setTimeout(() => {
      feedback.textContent = "";
    }, 6000);
  });

  // Estado inicial
  onScroll();
});
