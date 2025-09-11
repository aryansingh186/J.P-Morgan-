document.addEventListener("DOMContentLoaded", () => {
  /* ===========================
     1. Mobile menu
  =========================== */
  const navToggle = document.getElementById("nav-toggle");
  const navClose = document.getElementById("nav-close");
  const mobileMenu = document.getElementById("mobile-menu");

  if (navToggle && navClose && mobileMenu) {
    navToggle.addEventListener("click", () => mobileMenu.classList.remove("hidden"));
    navClose.addEventListener("click", () => mobileMenu.classList.add("hidden"));
  }

  /* ===========================
     2. Helpers
  =========================== */
  const cap = s => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

  function closeOverlay(overlay, trigger) {
    if (!overlay) return;
    overlay.classList.replace("max-h-[50%]", "max-h-0");
    overlay.classList.remove("overlay-open");
    if (trigger) trigger.classList.remove("border-dashed", "border", "border-black");
  }

  function openOverlay(overlay, trigger, heightClass = "max-h-[50%]") {
    if (!overlay) return;

    if (!overlay.classList.contains("max-h-0")) overlay.classList.add("max-h-0");

    // Close all other overlays
    document.querySelectorAll(".overlay-open").forEach(o => {
      if (o !== overlay) {
        const trg = document.querySelector(`[data-target="${o.id.replace("-overlay","")}"]`);
        closeOverlay(o, trg);
      }
    });

    overlay.classList.replace("max-h-0", heightClass);
    overlay.classList.add("overlay-open");
  }

  function closeAllOverlays() {
    document.querySelectorAll("[id$='-overlay']").forEach(o => {
      const trg = document.querySelector(`[data-target="${o.id.replace("-overlay","")}"]`);
      closeOverlay(o, trg);
    });
  }
  

  /* ===========================
     3. Overlay triggers
  =========================== */
  const triggerNodeList = document.querySelectorAll(".menu-btn, header [data-target]");
  const triggers = Array.from(triggerNodeList).filter(Boolean);

  triggers.forEach(trigger => {
    const target = trigger.getAttribute("data-target") || trigger.dataset.target;
    if (!target) return;

    const overlayId = `${target}-overlay`;
    const overlay = document.getElementById(overlayId);
    if (!overlay) return;

    if (!overlay.classList.contains("max-h-0") && !overlay.classList.contains("max-h-[50%]")) {
      overlay.classList.add("max-h-0");
    }

    let closeBtn =
      overlay.querySelector("[data-close]") ||
      document.getElementById(`close${cap(target)}`) ||
      overlay.querySelector(".close-btn");

    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      if (overlay.classList.contains("overlay-open")) {
        closeOverlay(overlay, trigger);
      } else {
        openOverlay(overlay, trigger);
      }
    });

    if (closeBtn) closeBtn.addEventListener("click", () => closeOverlay(overlay, trigger));
  });

  // Close overlay on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllOverlays();
  });

  // Close overlay on outside click
  document.addEventListener("click", (e) => {
    const openOverlayEl = document.querySelector(".overlay-open");
    if (!openOverlayEl) return;

    const clickedInsideOverlay = !!e.target.closest("[id$='-overlay']");
    const clickedTrigger = !!e.target.closest(".menu-btn, header [data-target]");
    if (!clickedInsideOverlay && !clickedTrigger) closeAllOverlays();
  });

  /* ===========================
     4. Arrow + Border toggle for nav links
  =========================== */
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Reset all links
      navLinks.forEach(l => {
        l.classList.remove("border-dashed", "border", "border-black");
        const arrowIcon = l.querySelector(".arrow");
        if (arrowIcon) arrowIcon.classList.remove("rotate-180");
      });

      // Add styles to current link
      this.classList.add("border-dashed", "border", "border-black");
      let arrow = this.querySelector(".arrow");
      if (arrow) arrow.classList.add("rotate-180");
    });
  });

  /* ===========================
     5. Menu highlight
  =========================== */
  function setupMenuHighlight(menuSelector) {
    const menuItems = document.querySelectorAll(menuSelector);
    if (!menuItems.length) return;
    menuItems.forEach(item => {
      item.addEventListener("click", () => {
        menuItems.forEach(li => li.classList.remove("font-bold", "text-black"));
        item.classList.add("font-bold", "text-black");
      });
    });
  }

  setupMenuHighlight("#solutions-menu li");
  setupMenuHighlight("#who-menu li");
  setupMenuHighlight("#insight-menu li");
  setupMenuHighlight("#about-menu li");

  /* ===========================
     6. Card Slider
  =========================== */
  const slider = document.getElementById("cardSlider");
  const prevBtn = document.getElementById("prevCard");
  const nextBtn = document.getElementById("nextCard");
  const dots = Array.from(document.querySelectorAll(".dot"));
  let currentIndex = 0;
  const cardWidth = 330 + 24;

  function updateSlider() {
    if (!slider) return;
    slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle("bg-black", i === currentIndex);
      dot.classList.toggle("bg-white", i !== currentIndex);
    });
  }

  if (nextBtn && prevBtn && dots.length) {
    nextBtn.addEventListener("click", () => { if (currentIndex < dots.length - 1) currentIndex++; updateSlider(); });
    prevBtn.addEventListener("click", () => { if (currentIndex > 0) currentIndex--; updateSlider(); });
    dots.forEach((dot, i) => dot.addEventListener("click", () => { currentIndex = i; updateSlider(); }));
    updateSlider();
  }

  /* ===========================
     7. Page navigation (Slider)
  =========================== */
  const navItems = Array.from(document.querySelectorAll("ul li[data-target]"));
  const pages = Array.from(document.querySelectorAll("main[id^='page']"));

  if (pages.length) {
    // Sab pages ko left/right offscreen position do
    pages.forEach((page, idx) => {
      page.style.transition = "transform 0.5s ease, opacity 0.5s ease";
      page.style.position = "absolute";
      page.style.top = "0";
      page.style.left = "0";
      page.style.width = "100%";
      page.style.opacity = idx === 0 ? "1" : "0";
      page.style.transform = idx === 0 ? "translateX(0)" : "translateX(100%)";
    });

    let currentPage = 0;

    function showPage(index) {
      if (index === currentPage) return;

      const direction = index > currentPage ? 1 : -1; // forward ya backward
      const oldPage = pages[currentPage];
      const newPage = pages[index];

      // Old page ko slide out
      oldPage.style.transform = `translateX(${-100 * direction}%)`;
      oldPage.style.opacity = "0";

      // New page ko screen me slide in
      newPage.style.transform = "translateX(0)";
      newPage.style.opacity = "1";

      currentPage = index;
    }

    navItems.forEach((item, idx) => {
      item.addEventListener("click", () => {
        showPage(idx);

        // Menu highlight
        navItems.forEach(li => li.classList.remove("font-bold", "text-black"));
        item.classList.add("font-bold", "text-black");
      });
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll("#solutions-menu li");
  const contentItems = document.querySelectorAll(".solutions-content");

  menuItems.forEach(item => {
    item.addEventListener("click", () => {
      // 1. Remove active classes from all menu items
      menuItems.forEach(i => i.classList.remove("font-bold", "text-black"));
      // 2. Add active class to clicked item
      item.classList.add("font-bold", "text-black");

      // 3. Hide all content sections
      contentItems.forEach(c => c.classList.add("hidden"));

      // 4. Show content corresponding to clicked menu
      const target = item.getAttribute("data-content"); // matches the right div ID
      const content = document.getElementById(target);
      if (content) content.classList.remove("hidden");
    });
  });

  // Optional: Open default tab (first one)
  if (menuItems.length) menuItems[0].click();
});
  

});
