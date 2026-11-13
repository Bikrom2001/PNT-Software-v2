/* ==========================================================
   People N Tech – Header & Navigation Behavior
   1. Compact header + shadow on scroll
   2. Desktop hover & click dropdowns
   3. Mobile offcanvas drawer (open/close & backdrop)
   4. Mobile accordion dropdowns
   5. Active link state & auto-close mobile drawer
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("ptHeader");
  const mobileMenu = document.getElementById("ptMenu");
  const backdrop = document.getElementById("ptBackdrop");
  const openMenuBtn = document.getElementById("ptOpenMenu");
  const closeMenuBtn = document.getElementById("ptCloseMenu");
  const desktopQuery = window.matchMedia("(min-width: 992px)");

  /* --------------------------------------------------------
     1. Scroll state (compacts navbar & adds shadow)
     -------------------------------------------------------- */
  const handleScroll = () => {
    if (!header) return;
    const isScrolled = window.scrollY > 60;
    header.classList.toggle("is-scrolled", isScrolled);
  };
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });

  /* --------------------------------------------------------
     2. Desktop Dropdowns (Hover + Click)
     -------------------------------------------------------- */
  const desktopDropdowns = document.querySelectorAll(".pt-dropdown");

  const closeAllDropdowns = () => {
    desktopDropdowns.forEach((dd) => dd.classList.remove("is-open"));
  };

  desktopDropdowns.forEach((item) => {
    const toggle = item.querySelector(".pt-dropdown-toggle");
    let timer;

    // Hover open / close on desktop
    item.addEventListener("mouseenter", () => {
      if (!desktopQuery.matches) return;
      clearTimeout(timer);
      closeAllDropdowns();
      item.classList.add("is-open");
    });

    item.addEventListener("mouseleave", () => {
      if (!desktopQuery.matches) return;
      timer = setTimeout(() => {
        item.classList.remove("is-open");
      }, 120);
    });

    // Toggle on click on desktop
    if (toggle) {
      toggle.addEventListener("click", (e) => {
        if (!desktopQuery.matches) return;
        e.preventDefault();
        e.stopPropagation();
        const isOpen = item.classList.contains("is-open");
        closeAllDropdowns();
        if (!isOpen) {
          item.classList.add("is-open");
        }
      });
    }
  });

  // Close desktop dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".pt-dropdown")) {
      closeAllDropdowns();
    }
  });

  /* --------------------------------------------------------
     3. Mobile Drawer (Offcanvas Open / Close)
     -------------------------------------------------------- */
  const openMobileMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.add("is-open");
    if (backdrop) backdrop.classList.add("is-open");
    document.body.classList.add("pt-drawer-open");
  };

  const closeMobileMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("is-open");
    if (backdrop) backdrop.classList.remove("is-open");
    document.body.classList.remove("pt-drawer-open");
  };

  if (openMenuBtn) {
    openMenuBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openMobileMenu();
    });
  }

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeMobileMenu();
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeMobileMenu);
  }

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllDropdowns();
      closeMobileMenu();
    }
  });

  /* --------------------------------------------------------
     4. Mobile Accordion Dropdowns
     -------------------------------------------------------- */
  const mobileToggles = document.querySelectorAll(".pt-mobile-toggle");
  mobileToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-collapse-target");
      const targetCollapse = targetId ? document.getElementById(targetId) : btn.nextElementSibling;
      if (!targetCollapse) return;

      const isExpanded = targetCollapse.classList.contains("is-expanded");

      // Optional accordion behavior: close other open collapses
      mobileToggles.forEach((otherBtn) => {
        if (otherBtn !== btn) {
          otherBtn.classList.remove("is-active");
          const otherTargetId = otherBtn.getAttribute("data-collapse-target");
          const otherTarget = otherTargetId ? document.getElementById(otherTargetId) : otherBtn.nextElementSibling;
          if (otherTarget) otherTarget.classList.remove("is-expanded");
        }
      });

      btn.classList.toggle("is-active", !isExpanded);
      targetCollapse.classList.toggle("is-expanded", !isExpanded);
    });
  });

  /* --------------------------------------------------------
     5. Active Nav Link & Auto-Close Mobile Menu on Link Click
     -------------------------------------------------------- */
  const allNavLinks = document.querySelectorAll(".pt-nav-link, .pt-mobile-link");
  allNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      // Don't update active state for dropdown toggle buttons
      if (link.classList.contains("pt-dropdown-toggle") || link.classList.contains("pt-mobile-toggle")) {
        return;
      }

      allNavLinks.forEach((l) => {
        l.classList.remove("active");
        l.removeAttribute("aria-current");
      });

      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    });
  });

  // Auto-close mobile drawer when any link is clicked inside mobile menu
  if (mobileMenu) {
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (!desktopQuery.matches) {
          closeMobileMenu();
        }
      });
    });
  }

  /* --------------------------------------------------------
     6. Services Section Category Filter Tabs
     -------------------------------------------------------- */
  const serviceTabs = document.querySelectorAll(".service-filter-tab");
  const serviceCards = document.querySelectorAll(".pt-service-card");

  serviceTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const selectedFilter = tab.getAttribute("data-service-filter");

      // Update active tab styling & ARIA state
      serviceTabs.forEach((t) => {
        t.classList.remove("active", "text-pt-navy");
        t.classList.add("text-slate-600");
        t.setAttribute("aria-selected", "false");
      });

      tab.classList.add("active", "text-pt-navy");
      tab.classList.remove("text-slate-600");
      tab.setAttribute("aria-selected", "true");

      // Filter and animate matching service cards
      serviceCards.forEach((card) => {
        const category = card.getAttribute("data-service-category");
        const shouldShow =
          selectedFilter === "all" || category === selectedFilter;

        card.classList.remove("is-revealing");
        if (shouldShow) {
          card.classList.remove("is-hidden");
          // Force reflow so reveal animation replays cleanly on tab switch
          void card.offsetWidth;
          card.classList.add("is-revealing");
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  });

  // Auto-close desktop dropdown when clicking in-page industry anchor links
  document.querySelectorAll("[data-select-industry]").forEach((navLink) => {
    navLink.addEventListener("click", () => {
      closeAllDropdowns();
      if (!desktopQuery.matches) {
        closeMobileMenu();
      }
    });
  });
});
