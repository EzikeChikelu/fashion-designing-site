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

// Guided enquiry wizard: validate each step and build a clear, user-approved brief.
const bookingForm = document.querySelector("#booking-form");
const formStatus = document.querySelector("#form-status");
const formSteps = [...document.querySelectorAll("[data-form-step]")];
const stepDots = [...document.querySelectorAll("[data-step-dot]")];
const stepLabel = document.querySelector("#step-label");
const progressPercent = document.querySelector("#progress-percent");
const progressFill = document.querySelector("#progress-fill");
const review = document.querySelector("#enquiry-review");
const detailsField = bookingForm?.elements.namedItem("details");
const detailsCount = document.querySelector("#details-count");
const preferredDate = document.querySelector("#preferred-date");
let currentFormStep = 0;

if (preferredDate) {
  const now = new Date();
  const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  preferredDate.min = localToday;
}
detailsField?.addEventListener("input", () => {
  if (detailsCount) detailsCount.textContent = `${detailsField.value.length} / 1000`;
});

function setFormStep(nextStep) {
  currentFormStep = Math.max(0, Math.min(2, nextStep));
  formSteps.forEach((step, index) => {
    const active = index === currentFormStep;
    step.hidden = !active;
    step.classList.toggle("active", active);
  });
  stepDots.forEach((dot, index) => {
    dot.classList.toggle("current", index === currentFormStep);
    dot.classList.toggle("done", index < currentFormStep);
    dot.setAttribute("aria-current", index === currentFormStep ? "step" : "false");
  });
  if (stepLabel) stepLabel.textContent = `STEP 0${currentFormStep + 1} OF 03`;
  if (progressPercent) progressPercent.textContent = `${Math.round(((currentFormStep + 1) / 3) * 100)}% complete`;
  if (progressFill) progressFill.style.width = `${((currentFormStep + 1) / 3) * 100}%`;
  if (formStatus) formStatus.textContent = "";
}

function validateStep(stepIndex) {
  const step = formSteps[stepIndex];
  if (!step || !bookingForm) return true;
  const fields = [...step.querySelectorAll("input,select,textarea")].filter((field) => field.willValidate);
  for (const field of fields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      field.focus();
      return false;
    }
  }
  return true;
}

function fieldValue(name) {
  const field = bookingForm?.elements.namedItem(name);
  if (!field) return "";
  if (field instanceof RadioNodeList) return field.value || "";
  return field.value?.trim?.() ?? "";
}

function renderReview() {
  if (!review) return;
  const rows = [
    ["Name", fieldValue("name")],
    ["Contact", fieldValue("contact")],
    ["Service", fieldValue("service")],
    ["Occasion", fieldValue("occasion")],
    ["Design brief", fieldValue("details")],
    ["Needed by", fieldValue("date")],
    ["Budget", fieldValue("budget")],
    ["Idea status", fieldValue("readiness")],
    ["Reference", fieldValue("reference")]
  ];
  review.replaceChildren();
  rows.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "review-row";
    const key = document.createElement("span");
    key.className = "review-label";
    key.textContent = label;
    const val = document.createElement("span");
    val.className = `review-value${value ? "" : " is-empty"}`;
    val.textContent = value || (label === "Design brief" ? "Not provided" : "Not added");
    row.append(key, val);
    review.append(row);
  });
}

bookingForm?.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!validateStep(currentFormStep)) return;
    if (currentFormStep === 1) renderReview();
    setFormStep(currentFormStep + 1);
    formSteps[currentFormStep]?.querySelector("input,select,textarea,button")?.focus({ preventScroll: true });
    bookingForm.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
  });
});
bookingForm?.querySelectorAll("[data-back]").forEach((button) => {
  button.addEventListener("click", () => {
    setFormStep(currentFormStep - 1);
  });
});

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateStep(0) || !validateStep(1)) {
    const invalidStep = formSteps.findIndex((step) => [...step.querySelectorAll("input,select,textarea")].some((field) => field.willValidate && !field.checkValidity()));
    setFormStep(Math.max(0, invalidStep));
    validateStep(currentFormStep);
    return;
  }
  renderReview();
  const details = [
    "Hello NNIA Stitches! I'd like to enquire about a piece.",
    "",
    `Name: ${fieldValue("name")}`,
    fieldValue("contact") ? `My contact: ${fieldValue("contact")}` : "",
    `What I need: ${fieldValue("service")}`,
    fieldValue("occasion") ? `Occasion: ${fieldValue("occasion")}` : "",
    `My design idea: ${fieldValue("details")}`,
    fieldValue("date") ? `Needed by: ${fieldValue("date")}` : "",
    fieldValue("budget") ? `Budget: ${fieldValue("budget")}` : "",
    fieldValue("readiness") ? `Idea status: ${fieldValue("readiness")}` : "",
    fieldValue("reference") ? `Inspiration link: ${fieldValue("reference")}` : "",
    "",
    "Please let me know availability, pricing, and the next steps. Thank you!"
  ].filter(Boolean).join("\n");
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(details)}`;
  const opened = window.open(whatsappUrl, "_blank");
  if (opened) opened.opener = null;
  else window.location.href = whatsappUrl;
  if (formStatus) formStatus.textContent = "Your enquiry is prepared. In WhatsApp, choose the NNIA Stitches chat and tap Send.";
});

// Close the mobile navigation with Escape as well as the menu button.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation?.classList.contains("open")) {
    navigation.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
  }
});
