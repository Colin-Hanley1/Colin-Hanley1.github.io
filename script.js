/* ===================================================
   Colin Hanley — Portfolio 2026
   =================================================== */

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============ YEAR ============ */
$("#year").textContent = new Date().getFullYear();

/* ============ LIVE CLOCK / LOCATION ============ */
(function clock() {
  const el = $("#liveClock");
  if (!el) return;
  const update = () => {
    const d = new Date();
    // Central Time (Tuscaloosa). Use local formatting.
    const opts = { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Chicago" };
    const time = d.toLocaleTimeString("en-US", opts);
    el.textContent = `TUSC / ${time}`;
  };
  update();
  setInterval(update, 30000);
})();

/* ============ THEME TOGGLE ============ */
const themeToggle = $("#themeToggle");
const themeIcon   = $(".theme-icon");
function setTheme(dark) {
  document.documentElement.classList.toggle("theme-dark", dark);
  themeToggle.setAttribute("aria-pressed", String(dark));
  if (themeIcon) themeIcon.textContent = dark ? "◑" : "◐";
  localStorage.setItem("theme", dark ? "dark" : "light");
}
setTheme(document.documentElement.classList.contains("theme-dark"));
themeToggle?.addEventListener("click", () => {
  setTheme(!document.documentElement.classList.contains("theme-dark"));
});

/* ============ MOBILE NAV ============ */
const navToggle = $(".nav-toggle");
const navLinks  = $("#nav-menu");
navToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});
$$(".nav-links a").forEach(a => {
  a.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

/* ============ SMOOTH SCROLL (nav only; html smooth handles the rest) ============ */
$$('.nav-links a[href^="#"], .foot-row a[href^="#"], .skip-link').forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
});

/* ============ SCROLL PROGRESS ============ */
const progressBar = $(".scroll-progress span");
const onScroll = () => {
  const h = document.documentElement;
  const scrolled = h.scrollTop;
  const max = h.scrollHeight - h.clientHeight;
  const pct = max > 0 ? (scrolled / max) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + "%";
};
document.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ============ SCROLL SPY ============ */
const sections = $$("main section[id], header#top");
const navItems = $$(".nav-links a");
const spy = () => {
  const pos = window.scrollY + 120;
  let current = "top";
  sections.forEach(sec => {
    if (pos >= sec.offsetTop) current = sec.id;
  });
  navItems.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
};
document.addEventListener("scroll", spy, { passive: true });
spy();

/* ============ REVEAL ON SCROLL ============ */
const revealTargets = $$(".reveal");
if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  revealTargets.forEach(el => io.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add("is-in"));
}

/* ============ PROJECT FILTER ============
   - "Featured" (all): show only data-featured="true" projects
   - Specific tag:     show projects matching that tag, capped at 4
*/
const MAX_VISIBLE = 4;
const chips    = $$(".chip");
const projects = $$(".work .project");

function applyFilter(tag) {
  let shownCount = 0;
  projects.forEach(p => {
    let match;
    if (tag === "all") {
      match = p.dataset.featured === "true";
    } else {
      match = (p.dataset.tags || "").split(",").map(t => t.trim()).includes(tag);
    }
    const show = match && shownCount < MAX_VISIBLE;
    p.classList.toggle("is-hidden", !show);
    if (show) shownCount++;
  });
}

chips.forEach(chip => chip.addEventListener("click", () => {
  chips.forEach(c => {
    c.classList.remove("is-active");
    c.setAttribute("aria-selected", "false");
  });
  chip.classList.add("is-active");
  chip.setAttribute("aria-selected", "true");
  applyFilter(chip.dataset.filter);
}));

// Initial pass so extras are hidden on first load
applyFilter("all");

/* ============ COPY EMAIL ============ */
const copyBtn = $("#copyEmail");
copyBtn?.addEventListener("click", () => {
  const email = copyBtn.getAttribute("data-email");
  navigator.clipboard?.writeText(email).then(() => {
    const label = copyBtn.querySelector(".mono");
    const original = label.textContent;
    label.textContent = "Copied";
    copyBtn.classList.add("copied");
    setTimeout(() => {
      label.textContent = original;
      copyBtn.classList.remove("copied");
    }, 1500);
  });
});

/* ============ ALBUMS ============ */
const albums = [
  { title: "Songs in the Key of Life", artist: "Stevie Wonder", cover: "images/skl.png",     link: "https://open.spotify.com/album/6YUCc2RiXcEKS9ibuZxjt0" },
  { title: "Scenery",                  artist: "Ryo Fukui",     cover: "images/scenery.png", link: "https://open.spotify.com/album/5Uny0mkKiVGDat7H6SNDyS" },
  { title: "Combat Rock",              artist: "The Clash",     cover: "images/cr.png",      link: "https://open.spotify.com/album/1ZH5g1RDq3GY1OvyD0w0s2" },
  { title: "Currents",                 artist: "Tame Impala",   cover: "images/currents.png",link: "https://open.spotify.com/album/79dL7FLiJFOO0EoehUHQBv" },
  { title: "By and By",                artist: "Caamp",         cover: "images/bb.png",      link: "https://open.spotify.com/album/1wohWQ8y4RpdANgxZDa4MF" },
  { title: "Can't Buy a Thrill",       artist: "Steely Dan",    cover: "images/cbat.png",    link: "https://open.spotify.com/album/4Gh6pRaXqXTtJx4plAJbBw" }
];
const albumGrid = $("#albumGrid");
if (albumGrid) {
  albumGrid.innerHTML = albums.map(a => `
    <a class="album" href="${a.link}" target="_blank" rel="noopener">
      <img loading="lazy" src="${a.cover}" alt="${a.title} — ${a.artist}">
      <p><b>${a.title}</b>${a.artist}</p>
    </a>
  `).join("");
}

/* ============ KEYBOARD ============ */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navLinks.classList.contains("is-open")) {
    navLinks.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
  // Cmd/Ctrl + K — focus first nav link (quick nav)
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    navItems[0]?.focus();
  }
});
