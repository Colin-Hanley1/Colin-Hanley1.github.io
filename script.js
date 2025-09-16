const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

$("#year").textContent = new Date().getFullYear();

const themeToggle = $("#themeToggle");
function setTheme(dark) {
  document.documentElement.classList.toggle("theme-dark", dark);
  themeToggle.setAttribute("aria-pressed", String(dark));
  localStorage.setItem("theme", dark ? "dark" : "light");
}
themeToggle?.addEventListener("click", () => {
  const dark = !document.documentElement.classList.contains("theme-dark");
  setTheme(dark);
});

const navToggle = $(".nav-toggle");
const navMenu = $("#nav-menu");
navToggle?.addEventListener("click", () => {
  const open = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

$$('.nav-links a').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
    navMenu.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const sections = $$("main section");
const navLinks = $$(".nav-links a");
const spy = () => {
  let current = "";
  const pos = window.scrollY + 100;
  sections.forEach(sec => {
    if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
};
document.addEventListener('scroll', spy);

(function typewriter() {
  const el = $(".typewrite-text");
  if (!el) return;
  const rotate = JSON.parse(el.dataset.rotate || "[]");
  let loop = 0, txt = "", isDeleting = false, speed = 80;
  function tick() {
    const full = rotate[loop % rotate.length];
    txt = isDeleting ? full.substring(0, txt.length - 1) : full.substring(0, txt.length + 1);
    el.textContent = txt;

    let delta = isDeleting ? speed / 1.6 : speed;
    if (!isDeleting && txt === full) { delta = 1200; isDeleting = true; }
    else if (isDeleting && txt === "") { isDeleting = false; loop++; delta = 300; }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // No animation: set first phrase
      el.textContent = rotate[0];
      return;
    }
    setTimeout(tick, delta);
  }
  tick();
})();

const counters = $$(".stat-number");
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.count, 10) || 0;
    let cur = 0;
    const step = Math.ceil(target / 60);
    const tick = () => {
      cur += step;
      if (cur >= target) { el.textContent = target; return; }
      el.textContent = cur;
      requestAnimationFrame(tick);
    };
    tick();
    counterObs.unobserve(el);
  });
}, { threshold: 0.4 });
counters.forEach(c => counterObs.observe(c));

const chips = $$(".chip");
const cards = $$(".project-card");
chips.forEach(chip => chip.addEventListener("click", () => {
  chips.forEach(c => c.classList.remove("is-active"));
  chip.classList.add("is-active");
  const tag = chip.dataset.filter;
  cards.forEach(card => {
    const show = tag === "all" || (card.dataset.tags || "").includes(tag);
    card.style.display = show ? "" : "none";
  });
}));

$$("[data-modal]").forEach(btn => {
  const target = btn.getAttribute("data-modal");
  const dlg = $(target);
  btn.addEventListener("click", () => dlg?.showModal());
});
$$(".modal [data-close]").forEach(btn => {
  btn.addEventListener("click", () => btn.closest("dialog")?.close());
});

/* ========= COPY EMAIL ========= */
$("#copyEmail")?.addEventListener("click", (e) => {
  const email = e.currentTarget.getAttribute("data-email");
  navigator.clipboard.writeText(email).then(() => {
    e.currentTarget.textContent = "Copied!";
    setTimeout(() => (e.currentTarget.textContent = "Copy Email"), 1200);
  });
});

const albums = [
  {
    title: "Songs in the Key of Life — Stevie Wonder",
    cover: "images/skl.png",
    link: "https://open.spotify.com/album/6YUCc2RiXcEKS9ibuZxjt0?si=9uktxpWFSZWC1YWupyKW4Q"
  },
  {
    title: "Scenery - Ryo Fukui",
    cover: "images/scenery.png",
    link: "https://open.spotify.com/album/5Uny0mkKiVGDat7H6SNDyS?si=W3yaVLXUREa3XFQ7pAZxkQ"
  },
  {
    title: "Combat Rock — The Clash",
    cover: "images/cr.png",
    link: "https://open.spotify.com/album/1ZH5g1RDq3GY1OvyD0w0s2?si=YxKjjApJTQ-JSJ8LZp1Uzw"
  },
  {
    title: "Currents - Tame Impala",
    cover: "images/currents.png",
    link: "https://open.spotify.com/album/79dL7FLiJFOO0EoehUHQBv?si=DRanZKjmR3Sfez1_Wev88Q"
  },
  {
    title: "By and By - Caamp",
    cover: "images/bb.png",
    link: "https://open.spotify.com/album/1wohWQ8y4RpdANgxZDa4MF?si=xJeVmlgQS4G08sbHQImq-w"
  },
  {
    title: "Can't Buy a Thrill — Steely Dan",
    cover: "images/cbat.png",
    link: "https://open.spotify.com/album/4Gh6pRaXqXTtJx4plAJbBw?si=yfKEZQJbRoCl1gzdve_jsw"
  }
];
const albumGrid = $("#albumGrid");
if (albumGrid) {
  albumGrid.innerHTML = albums.map(a => `
    <a class="album" href="${a.link}" target="_blank" rel="noopener">
      <img loading="lazy" src="${a.cover}" alt="${a.title} cover art">
      <p>${a.title}</p>
    </a>
  `).join("");
}

const toTop = $(".to-top");
let lastY = 0;
document.addEventListener("scroll", () => {
  const y = window.scrollY;
  if (!toTop) return;
  toTop.style.opacity = y > 600 ? "1" : "0";
  lastY = y;
});
