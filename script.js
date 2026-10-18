const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-nav");

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navigation?.classList.toggle("open", !isOpen);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
  });
});

const filterButtons = document.querySelectorAll(".filter-button");
const galleryItems = document.querySelectorAll(".gallery-item");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    galleryItems.forEach((item) => {
      item.hidden = filter !== "all" && item.dataset.category !== filter;
    });
  });
});

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox?.querySelector("img");
const closeLightbox = () => {
  if (lightbox?.open) lightbox.close();
};

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    const image = item.dataset.image;
    if (!image || !lightbox || !lightboxImage) return;
    lightboxImage.src = image;
    lightboxImage.alt = item.querySelector("img")?.alt ?? "NNIA Stitches design";
    lightbox.showModal();
  });
});

lightbox?.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());

// Progressive reveal: content remains visible if IntersectionObserver is unavailable.
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealTargets = document.querySelectorAll(
    ".hero-copy, .hero-visual, .intro-grid, .stats, .service-card, .collection-heading, .gallery-item, .quote-section, .contact-copy, .booking-form"
  );
  document.documentElement.classList.add("reveal-ready");
  revealTargets.forEach((element) => element.classList.add("reveal"));
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  revealTargets.forEach((element) => revealObserver.observe(element));
}

// Build a WhatsApp-ready enquiry without storing form data on the site.
const bookingForm = document.querySelector("#booking-form");
const formStatus = document.querySelector("#form-status");
bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;
  const values = new FormData(bookingForm);
  const details = [
    "Hello NNIA Stitches! I'd like to enquire about an outfit.",
    "",
    `Name: ${values.get("name")}`,
    `Service: ${values.get("service")}`,
    values.get("date") ? `Preferred date: ${values.get("date")}` : "",
    values.get("budget") ? `Budget: ${values.get("budget")}` : "",
    values.get("details") ? `My idea: ${values.get("details")}` : "",
    "",
    "Please let me know the next steps. Thank you!"
  ].filter(Boolean).join("\\n");
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(details)}`;
  const opened = window.open(whatsappUrl, "_blank");
  if (opened) opened.opener = null;
  else window.location.href = whatsappUrl;
  if (formStatus) formStatus.textContent = "Your message is ready. In WhatsApp, choose the NNIA Stitches chat and tap Send.";
});

// Close the mobile navigation with Escape as well as the menu button.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation?.classList.contains("open")) {
    navigation.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
  }
});
