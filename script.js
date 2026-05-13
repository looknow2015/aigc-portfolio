const projects = window.projects;
const track = document.querySelector("[data-work-track]");
const stage = document.querySelector("[data-horizontal-stage]");
const menuButton = document.querySelector(".menu-button");
const menuPanel = document.querySelector(".menu-panel");
const menuClose = document.querySelector(".menu-close");

let currentX = 0;
let targetX = 0;
let maxX = 0;
let dragging = false;
let dragStart = 0;
let dragStartX = 0;
let hasDragged = false;
let pressedLink = null;

function renderProjects() {
  track.innerHTML = projects
    .map(
      (project, index) => `
        <a class="work-card" href="project.html?id=${index}" data-project-index="${index}">
          <img src="${project.image}" alt="${project.title}" loading="lazy" />
          <span class="work-card-info">
            <span class="work-title">${project.title}</span>
            <span class="work-category">${project.category}</span>
          </span>
        </a>
      `
    )
    .join("");
}

function measure() {
  maxX = Math.max(0, track.scrollWidth - window.innerWidth + 42);
  targetX = clamp(targetX, -maxX, 0);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function animate() {
  currentX += (targetX - currentX) * 0.12;
  if (Math.abs(targetX - currentX) < 0.1) currentX = targetX;
  track.style.setProperty("--track-x", `${currentX}px`);

  document.querySelectorAll(".work-card").forEach((card) => {
    const rect = card.getBoundingClientRect();
    const centerOffset = (rect.left + rect.width / 2 - window.innerWidth / 2) / window.innerWidth;
    card.style.setProperty("--parallax", `${centerOffset * -26}px`);
  });

  requestAnimationFrame(animate);
}

function openMenu() {
  menuPanel.classList.add("is-open");
  menuPanel.setAttribute("aria-hidden", "false");
  menuButton.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  menuPanel.classList.remove("is-open");
  menuPanel.setAttribute("aria-hidden", "true");
  menuButton.setAttribute("aria-expanded", "false");
}

renderProjects();
measure();
animate();

window.addEventListener("resize", measure);

window.addEventListener("scroll", () => {
  const shift = Math.min(window.scrollY * 0.08, 42);
  document.documentElement.style.setProperty("--hero-shift", `${shift}px`);
});

stage.addEventListener(
  "wheel",
  (event) => {
    if (window.matchMedia("(max-width: 800px)").matches) return;
    event.preventDefault();
    targetX = clamp(targetX - event.deltaY * 1.2 - event.deltaX, -maxX, 0);
  },
  { passive: false }
);

stage.addEventListener("pointerdown", (event) => {
  if (window.matchMedia("(max-width: 800px)").matches) return;
  dragging = true;
  hasDragged = false;
  pressedLink = event.target.closest(".work-card");
  dragStart = event.clientX;
  dragStartX = targetX;
  stage.classList.add("is-dragging");
  stage.setPointerCapture(event.pointerId);
});

stage.addEventListener("pointermove", (event) => {
  if (!dragging) return;
  if (Math.abs(event.clientX - dragStart) > 8) hasDragged = true;
  targetX = clamp(dragStartX + event.clientX - dragStart, -maxX, 0);
});

stage.addEventListener("pointerup", () => {
  dragging = false;
  stage.classList.remove("is-dragging");
  if (pressedLink && !hasDragged) {
    window.location.href = pressedLink.href;
  }
  pressedLink = null;
});

stage.addEventListener("pointercancel", () => {
  dragging = false;
  hasDragged = false;
  pressedLink = null;
  stage.classList.remove("is-dragging");
});

track.addEventListener("click", (event) => {
  if (!hasDragged) return;
  event.preventDefault();
  hasDragged = false;
});

menuButton.addEventListener("click", openMenu);
menuClose.addEventListener("click", closeMenu);
menuPanel.addEventListener("click", (event) => {
  if (event.target.matches("a")) closeMenu();
});
