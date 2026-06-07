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
  var exitStart = 0.62;

  function updateParallax() {
    var viewportHeight = window.innerHeight;

    parallaxSections.forEach(function (section) {
      var img = section.querySelector(".parallax-bg img");
      var content = section.querySelector(".parallax-content");
      if (!img) return;

      var rect = section.getBoundingClientRect();
      var scrollRange = Math.max(1, section.offsetHeight - viewportHeight);
      var scrolled = Math.max(0, Math.min(scrollRange, -rect.top));
      var progress = scrolled / scrollRange;

      if (content) {
        if (reducedMotion) {
          content.style.opacity = "";
          content.style.transform = "";
        } else {
          var enterProgress = Math.max(0, Math.min(1, (viewportHeight - rect.top) / (viewportHeight * 0.9)));
          content.style.opacity = String(0.4 + enterProgress * 0.6);
          content.style.transform = "translate3d(0, " + (1 - enterProgress) * 32 + "px, 0)";
        }
      }

      if (reducedMotion) {
        img.style.transform = "";
        return;
      }

      if (progress <= exitStart) {
        img.style.transform = "scale(1) translate3d(0, 0, 0)";
        return;
      }

      var exitProgress = (progress - exitStart) / (1 - exitStart);
      var scale = 1 + exitProgress * 0.15;
      var translateY = -exitProgress * viewportHeight * 0.24;
      img.style.transform =
        "scale(" + scale + ") translate3d(0, " + translateY + "px, 0)";
    });
    parallaxTicking = false;
  }

  function requestParallaxUpdate() {
    if (parallaxTicking) return;
    parallaxTicking = true;
    window.requestAnimationFrame(updateParallax);
  }

  if (parallaxSections.length) {
    function layoutParallaxSections() {
      var viewportHeight = window.innerHeight;
      parallaxSections.forEach(function (section) {
        var content = section.querySelector(".parallax-content");
        if (!content) return;
        var tail = viewportHeight * 0.85;
        var minHeight = Math.max(viewportHeight * 2, content.offsetHeight + tail);
        section.style.minHeight = minHeight + "px";
      });
      updateParallax();
    }

    layoutParallaxSections();
    window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
    window.addEventListener("resize", function () {
      layoutParallaxSections();
      requestParallaxUpdate();
    });
  }
})();
