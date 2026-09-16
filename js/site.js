(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  document.querySelectorAll(".ba-compare").forEach((el) => {
    const range = el.querySelector('input[type="range"]');
    const after = el.querySelector(".ba-compare__after");
    const handle = el.querySelector(".ba-compare__handle");
    if (!range || !after || !handle) return;

    const setPos = (value) => {
      const pct = Number(value);
      after.style.clipPath = `inset(0 0 0 ${pct}%)`;
      handle.style.left = `${pct}%`;
    };

    setPos(range.value);
    range.addEventListener("input", () => setPos(range.value));
  });

  const setGalleryOpen = (btn, gallery, open) => {
    btn.setAttribute("aria-expanded", String(open));
    gallery.hidden = !open;
    if (open) {
      gallery.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  document.querySelectorAll(".ba-job__title-btn").forEach((btn) => {
    const gallery = document.getElementById(btn.getAttribute("aria-controls"));
    if (!gallery) return;

    btn.addEventListener("click", () => {
      const willOpen = btn.getAttribute("aria-expanded") !== "true";
      document.querySelectorAll(".ba-job__title-btn[aria-expanded='true']").forEach((other) => {
        if (other === btn) return;
        const otherGallery = document.getElementById(other.getAttribute("aria-controls"));
        if (otherGallery) setGalleryOpen(other, otherGallery, false);
      });
      setGalleryOpen(btn, gallery, willOpen);
    });

    gallery.querySelectorAll("[data-close-gallery]").forEach((closeBtn) => {
      closeBtn.addEventListener("click", () => setGalleryOpen(btn, gallery, false));
    });
  });

  const openFromHash = () => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const job = document.getElementById(id);
    if (!job) return;
    const btn = job.querySelector(".ba-job__title-btn");
    const gallery = btn && document.getElementById(btn.getAttribute("aria-controls"));
    if (btn && gallery) {
      setGalleryOpen(btn, gallery, true);
      job.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  openFromHash();
  window.addEventListener("hashchange", openFromHash);

  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
})();
