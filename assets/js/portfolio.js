(function () {
  "use strict";

  var navToggle = document.getElementById("nav-toggle");
  var mobileMenu = document.getElementById("mobile-menu");
  var typedEl = document.getElementById("hero-typed");

  function closeMobileMenu() {
    if (!navToggle || !mobileMenu) return;
    navToggle.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      var expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", expanded ? "false" : "true");
      mobileMenu.classList.toggle("is-open", !expanded);
      mobileMenu.setAttribute("aria-hidden", expanded ? "true" : "false");
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobileMenu();
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  });

  if (typedEl && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var items = (typedEl.dataset.typedItems || "")
      .split(",")
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);

    if (items.length) {
      typedEl.classList.add("hero-typed");
      var itemIndex = 0;
      var charIndex = 0;
      var deleting = false;

      function tick() {
        var current = items[itemIndex];
        if (!deleting) {
          typedEl.textContent = current.slice(0, charIndex + 1);
          charIndex += 1;
          if (charIndex === current.length) {
            deleting = true;
            setTimeout(tick, 2000);
            return;
          }
          setTimeout(tick, 80);
        } else {
          typedEl.textContent = current.slice(0, charIndex - 1);
          charIndex -= 1;
          if (charIndex === 0) {
            deleting = false;
            itemIndex = (itemIndex + 1) % items.length;
            setTimeout(tick, 400);
            return;
          }
          setTimeout(tick, 40);
        }
      }

      tick();
    }
  } else if (typedEl) {
    var fallback = (typedEl.dataset.typedItems || "Backend Engineer").split(",")[0].trim();
    typedEl.textContent = fallback;
  }

  var parallaxSections = document.querySelectorAll(".parallax-section");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var parallaxTicking = false;
  var parallaxSpeed = 0.32;

  function updateParallax() {
    parallaxSections.forEach(function (section) {
      var bg = section.querySelector(".parallax-bg");
      if (!bg) return;

      if (reducedMotion) {
        bg.style.transform = "";
        return;
      }

      var rect = section.getBoundingClientRect();
      var offset = rect.top * parallaxSpeed;
      bg.style.transform = "translate3d(0, " + offset + "px, 0)";
    });
    parallaxTicking = false;
  }

  function requestParallaxUpdate() {
    if (parallaxTicking) return;
    parallaxTicking = true;
    window.requestAnimationFrame(updateParallax);
  }

  if (parallaxSections.length) {
    updateParallax();
    window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
    window.addEventListener("resize", requestParallaxUpdate);
  }
})();
