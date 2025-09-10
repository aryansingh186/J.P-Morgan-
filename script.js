document.addEventListener("DOMContentLoaded", () => {
  // ===== Mobile Menu =====
  const navToggle = document.getElementById("nav-toggle");
  const navClose = document.getElementById("nav-close");
  const mobileMenu = document.getElementById("mobile-menu");

  if (navToggle && navClose && mobileMenu) {
    navToggle.addEventListener("click", () => {
      mobileMenu.classList.remove("hidden");
    });

    navClose.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  }

  // ===== Card Slider =====
  const slider = document.getElementById("cardSlider");
  const prevBtn = document.getElementById("prevCard");
  const nextBtn = document.getElementById("nextCard");
  const dots = document.querySelectorAll(".dot");

  let currentIndex = 0;
  const cardWidth = 330 + 24; // card width (330px) + gap (24px)

  function updateSlider() {
    if (!slider) return;

    slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    // Update dots
    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add("bg-black");
        dot.classList.remove("bg-white");
      } else {
        dot.classList.remove("bg-black");
        dot.classList.add("bg-white");
      }
    });
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentIndex < dots.length - 1) {
        currentIndex++;
        updateSlider();
      }
    });

    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    });
  }

  // Dot navigation
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      currentIndex = i;
      updateSlider();
    });
  });

  // Init
  updateSlider();

  // ===== Page Navigation via li click =====
  const navItems = document.querySelectorAll("ul li[data-target]");
  const pages = document.querySelectorAll("main[id^='page']"); // sirf page wale main select honge

  // by default only first page show
  pages.forEach((page, index) => {
    if (index === 0) {
      page.classList.remove("hidden");
    } else {
      page.classList.add("hidden");
    }
  });

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const targetId = item.getAttribute("data-target");

      // sab pages hide karo
      pages.forEach(page => page.classList.add("hidden"));

      // selected page show karo
      const targetPage = document.getElementById(targetId);
      if (targetPage) targetPage.classList.remove("hidden");

      // active li highlight
      navItems.forEach(li => li.classList.remove("font-bold", "text-black"));
      item.classList.add("font-bold", "text-black");
    });
  });
});
