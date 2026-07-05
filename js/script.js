(function () {
  "use strict";

  var root = document.documentElement;

  var STRINGS = {
    title: {
      fi: "Strömsbergin Mylly – Suomen vanhin toimiva maalaismylly | Porvoo",
      sv: "Strömsbergs Kvarn – Finlands äldsta fungerande lantkvarn | Borgå",
      en: "Strömsbergin Mylly – One of Finland's Oldest Working Country Mills | Porvoo"
    },
    desc: {
      fi: "Strömsbergin mylly on jauhanut viljaa Porvoonjoen rannalla vuodesta 1545. Tuoreet, lisäaineettomat jauhot ja hiutaleet lähipelloilta – perinteitä kunnioittaen.",
      sv: "Strömsbergs kvarn har malt säd vid Borgå å sedan 1545. Färskt mjöl utan tillsatser från närliggande åkrar – med respekt för traditionen.",
      en: "Strömsbergin Mylly has been grinding grain on the Porvoonjoki River since 1545. Fresh, additive-free flour and flakes from nearby fields, milled in the old way."
    }
  };

  function setLanguage(lang) {
    if (!["fi", "sv", "en"].includes(lang)) lang = "fi";
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang);
    document.title = STRINGS.title[lang];
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", STRINGS.desc[lang]);

    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      var active = btn.getAttribute("data-lang-btn") === lang;
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    try { localStorage.setItem("mylly-lang", lang); } catch (e) {}
  }

  function initLanguage() {
    var stored = null;
    try { stored = localStorage.getItem("mylly-lang"); } catch (e) {}
    var lang = stored;
    if (!lang) {
      var nav = (navigator.language || "fi").toLowerCase();
      if (nav.indexOf("sv") === 0) lang = "sv";
      else if (nav.indexOf("fi") === 0) lang = "fi";
      else lang = "en";
    }
    setLanguage(lang);
  }

  document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLanguage(btn.getAttribute("data-lang-btn"));
    });
  });

  initLanguage();

  /* Header scroll state */
  var header = document.querySelector("[data-header]");
  function onScroll() {
    if (window.scrollY > 24) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  var navToggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* Scroll reveal */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* Subtle hero parallax */
  var parallax = document.querySelector("[data-parallax]");
  if (parallax && !reduceMotion) {
    var ticking = false;
    document.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          var y = window.scrollY;
          if (y < window.innerHeight * 1.2) {
            parallax.style.transform = "translateY(" + y * 0.18 + "px)";
          }
          ticking = false;
        });
      },
      { passive: true }
    );
  }

  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
