(() => {
"use strict";

/* =========================================================
   AVATARS
   Illustrated, colorful avatars (DiceBear "personas") seeded from each
   specialist's name — tuned toward warmer skin tones and dark hair so the
   set reads as South Asian, without hot-linking photos of real, identifiable
   people and attaching fabricated names/credentials to their likeness.
   ========================================================= */
function avatarFor(seed, bgHex){
  const bg = bgHex.replace("#","");
  const params = new URLSearchParams({
    seed,
    backgroundColor: bg,
    backgroundType: "solid",
    radius: "0",
    skinColor: "8d5524,a86b3c,c68863,e0ac69",
    hairColor: "090806,1b1210,2c1b18,3b2219",
    facialHairProbability: "35",
  });
  return `https://api.dicebear.com/10.x/personas/svg?${params.toString()}`;
}

/* =========================================================
   CATEGORY TAXONOMY — 9 specializations, 9 distinct colors
   ========================================================= */
const CATS = [
  { id:"all",         label:"All Clauses",          group:"",                color:"#0B1526", soft:"#F4F2EC", text:"#0B1526" },
  { id:"ma",          label:"Merger & Acquisition",  group:"CORPORATE",          desc:"Buyouts, mergers, asset transfers",        color:"#E07A34", soft:"#FBEADA", text:"#9B5B14" },
  { id:"shareholder", label:"Shareholder Rights",    group:"CORPORATE",          desc:"Voting, dividends, minority protections",  color:"#7C5CFC", soft:"#EEE9FE", text:"#5738C9" },
  { id:"employment",  label:"Employment",            group:"HR & WORKPLACE",     desc:"Contracts, exits, policy compliance",      color:"#3D6BEA", soft:"#E4EBFE", text:"#2247B8" },
  { id:"credit",      label:"Credit & Loan",         group:"FINANCE",            desc:"Debt instruments, facility letters",       color:"#1E8F5E", soft:"#E1F3EA", text:"#146B44" },
  { id:"ip",          label:"License & IP",          group:"INTELLECTUAL PROPERTY", desc:"Trademarks, tech transfer, royalty",    color:"#D6455E", soft:"#FBE4E9", text:"#A32B42" },
  { id:"lease",       label:"Lease",                 group:"REAL ESTATE",        desc:"Commercial & residential leasing terms",   color:"#0F9B8E", soft:"#DFF4F1", text:"#0B6E63" },
  { id:"purchase",    label:"Purchase & Sale",       group:"COMMERCIAL",         desc:"Goods, assets & equity purchase terms",    color:"#0BA5D1", soft:"#E1F3FA", text:"#0B6E90" },
  { id:"supply",      label:"Service & Supply",      group:"COMMERCIAL",         desc:"Vendor terms, SLAs, procurement",          color:"#D6398F", soft:"#FBE3F0", text:"#9C2569" },
  { id:"settlement",  label:"Settlement & Release",  group:"DISPUTES",           desc:"Waivers, releases, negotiated exits",      color:"#C9922B", soft:"#FAF0DC", text:"#8A6314" },
];
const catById = Object.fromEntries(CATS.map(c => [c.id, c]));
const FOCUS_CATS = CATS.filter(c => c.id !== "all");

/* =========================================================
   NAME / DATA GENERATION — Indian names, cities, matters
   ========================================================= */
const FIRST = ["Aryan","Maya","Rohan","Priya","Sameer","Kavita","Nikhil","Ananya","Vikram","Ishita",
  "Karan","Riya","Arjun","Sneha","Rahul","Divya","Aditya","Neha","Varun","Pooja",
  "Siddharth","Meera","Aakash","Tanvi","Rajesh","Simran","Amit","Nandini","Yash","Deepa",
  "Farhan","Zoya","Arnav","Kiara","Rishabh","Anjali","Manav","Sanya","Dev","Trisha","Rohit","Alia"];
const LAST = ["Sharma","Kulkarni","Das","Iyer","Ali","Nair","Mehta","Reddy","Singh","Gupta",
  "Chopra","Menon","Rao","Verma","Kapoor","Bose","Joshi","Malhotra","Pillai","Bhatt","Desai","Banerjee"];
const CITIES = ["Mumbai","New Delhi","Bengaluru","Chennai","Hyderabad","Pune","Kolkata","Ahmedabad","Jaipur","Chandigarh"];
const LANGS = [["English","Hindi"],["English","Hindi","Marathi"],["English","Tamil"],["English","Hindi","Bengali"],
  ["English","Kannada"],["English","Telugu"],["English","Hindi","Gujarati"],["English","Punjabi","Hindi"]];
const MATTERS_POOL = [
  "Series B funding round for $45M tech acquisition",
  "Structured cross-border SPV for renewable energy exit",
  "Negotiated 124+ minority protection clauses for unicorn startups",
  "Won a landmark case regarding force majeure in industrial supply contracts",
  "Settled a $50M international trade dispute via arbitration",
  "Drafted master services agreement for a Fortune 500 vendor rollout",
  "Advised on ESOP restructuring for a Series C SaaS company",
  "Closed a $12M commercial lease portfolio across three cities",
  "Represented licensor in a cross-border trademark dispute",
  "Structured a leveraged buyout facility for a mid-market manufacturer",
  "Negotiated exit terms for a co-founder separation",
  "Filed and defended 40+ patent applications for a deep-tech startup",
];
const BIO_TEMPLATES = (name, years, focus) =>
  `${name.split(" ")[0]} has over ${years} years of experience in ${focus.toLowerCase()} and related commercial matters, advising founders, boards, and institutional clients on deals that hold up under scrutiny.`;

function seededRand(seed){
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}
const rand = seededRand(42);
const pickN = (arr, n) => { const a=[...arr]; const out=[]; for(let i=0;i<n && a.length;i++){ out.push(a.splice(Math.floor(rand()*a.length),1)[0]); } return out; };

function generateLawyers(count){
  const list = [];
  for(let i=0;i<count;i++){
    const first = FIRST[i % FIRST.length];
    const last = LAST[(i*3+7) % LAST.length];
    const name = `${first} ${last}`;
    const years = 3 + Math.floor(rand()*18);
    const focus = FOCUS_CATS[(i*2+1) % FOCUS_CATS.length];
    const secondary = pickN(FOCUS_CATS.filter(c=>c.id!==focus.id), 2);
    const rating = (4.4 + rand()*0.6).toFixed(2);
    const reviews = 24 + Math.floor(rand()*280);
    const response = [1,1,2,2,3,4,6][Math.floor(rand()*7)];
    list.push({
      id: `l${i+1}`,
      name: `Adv. ${name}`,
      city: CITIES[(i*5+2) % CITIES.length],
      years,
      focus,
      tags: [focus, ...secondary],
      rating: Number(rating),
      reviews,
      photo: avatarFor(name, focus.soft),
      response,
      memberSince: 2015 + (i % 10),
      languages: LANGS[i % LANGS.length],
      bio: BIO_TEMPLATES(name, years, focus.label),
      matters: pickN(MATTERS_POOL, 3),
      featured: i === 0,
    });
  }
  return list;
}

const LAWYERS = generateLawyers(48);

/* =========================================================
   STATE
   ========================================================= */
const state = { category:"all", sort:"relevance", query:"", fastOnly:false, visible:6, pageSize:6 };

/* =========================================================
   DOM refs
   ========================================================= */
const $ = (sel, el=document) => el.querySelector(sel);
const $$ = (sel, el=document) => [...el.querySelectorAll(sel)];

const specTrack = $("#spec-track");
const filterList = $("#filter-list");
const cardGrid = $("#card-grid");
const featuredCard = $("#featured-card");
const resultsCount = $("#results-count");
const resultsFilter = $("#results-filter");
const showingCount = $("#showing-count");
const loadMoreBtn = $("#load-more");
const avatarStack = $("#avatar-stack");
const expertCount = $("#expert-count");

/* =========================================================
   FILTERING / SORTING
   ========================================================= */
function getFiltered(){
  let out = LAWYERS.slice();
  if(state.category !== "all") out = out.filter(l => l.tags.some(t => t.id === state.category));
  if(state.fastOnly) out = out.filter(l => l.response <= 2);
  if(state.query.trim()){
    const q = state.query.trim().toLowerCase();
    out = out.filter(l =>
      l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) ||
      l.tags.some(t => t.label.toLowerCase().includes(q))
    );
  }
  switch(state.sort){
    case "rating": out.sort((a,b)=> b.rating - a.rating); break;
    case "experience": out.sort((a,b)=> b.years - a.years); break;
    case "response": out.sort((a,b)=> a.response - b.response); break;
    case "name": out.sort((a,b)=> a.name.localeCompare(b.name)); break;
    default: break;
  }
  return out;
}

/* =========================================================
   RENDER: SPECIALIZATIONS CAROUSEL
   ========================================================= */
function renderSpecCards(){
  specTrack.innerHTML = FOCUS_CATS.map(c => `
    <button class="spec-card ${c.id===state.category?'active':''}" data-cat="${c.id}"
      style="--accent:${c.color}; --accent-soft:${c.soft};">
      <span class="spec-cat" style="color:${c.color}">${c.group}</span>
      <h3 class="spec-name">${c.label}</h3>
      <p class="spec-desc">${c.desc}</p>
    </button>
  `).join("");
  observeReveal($$(".spec-card", specTrack));
}

/* =========================================================
   RENDER: SIDEBAR FILTERS
   ========================================================= */
function renderFilters(){
  const counts = { all: LAWYERS.length };
  FOCUS_CATS.forEach(c => counts[c.id] = LAWYERS.filter(l => l.tags.some(t=>t.id===c.id)).length);
  filterList.innerHTML = CATS.map(c => `
    <li class="filter-item ${state.category===c.id?'active':''}" data-cat="${c.id}" style="--accent:${c.color}">
      <span>${c.label}</span><span class="count">${counts[c.id]}</span>
    </li>
  `).join("");
}

/* =========================================================
   RENDER: FEATURED CARD
   ========================================================= */
function renderFeatured(list){
  const f = list.find(l=>l.featured) || list[0];
  if(!f){ featuredCard.style.display="none"; return; }
  featuredCard.style.display="grid";
  featuredCard.innerHTML = `
    <span class="featured-badge">FEATURED EXPERT</span>
    <div class="featured-photo"><img src="${f.photo}" alt="${f.name}"></div>
    <div class="featured-info">
      <div>
        <h3>${f.name}</h3>
        <p>Corporate &amp; Commercial Law Specialist · ${f.city}</p>
        <div class="featured-tags">
          ${f.tags.map(t=>`<span class="tag" style="background:${t.soft};color:${t.text}">${t.label}</span>`).join("")}
        </div>
      </div>
      <button class="btn btn-primary" data-connect="${f.id}">Connect with ${f.name.split(" ")[1]}</button>
    </div>
  `;
  observeReveal([featuredCard]);
}

/* =========================================================
   RENDER: GRID
   ========================================================= */
function cardHTML(l){
  return `
    <article class="lawyer-card" data-id="${l.id}" style="--accent:${l.focus.color}; --accent-soft:${l.focus.soft};">
      <div class="lc-top">
        <div class="lc-photo"><img src="${l.photo}" alt="${l.name}" loading="lazy"></div>
        <div>
          <h4 class="lc-name">${l.name}</h4>
          <p class="lc-meta">${l.city} · ${l.years} years exp.</p>
        </div>
        <span class="lc-rating">★ ${l.rating.toFixed(1)} <span style="opacity:.6;font-weight:500;">(${l.reviews})</span></span>
      </div>
      <div class="lc-focus" style="background:${l.focus.soft};">
        <div>
          <span class="lc-focus-label" style="color:${l.focus.text}">PRIMARY FOCUS</span>
          <span class="lc-focus-name" style="color:${l.focus.text}">${l.focus.label}</span>
        </div>
        <a href="#" class="view-profile" data-id="${l.id}" style="color:${l.focus.text}">View full profile →</a>
      </div>
      <div class="lc-actions">
        <button class="btn btn-outline btn-sm view-profile" data-id="${l.id}">View details</button>
        <button class="btn btn-primary btn-sm connect-btn" data-connect="${l.id}" style="background:${l.focus.color}">Connect</button>
      </div>
    </article>
  `;
}

function renderGrid(){
  const filtered = getFiltered();
  const withoutFeatured = filtered.filter(l => !(l.featured && state.category==="all" && !state.query));
  const showList = (state.category==="all" && !state.query) ? withoutFeatured : filtered;

  resultsCount.textContent = `${filtered.length} expert${filtered.length!==1?'s':''} available`;
  resultsFilter.textContent = state.category==="all" ? "All Clauses" : catById[state.category].label;

  renderFeatured(filtered);

  const slice = showList.slice(0, state.visible);
  cardGrid.innerHTML = slice.map(cardHTML).join("");
  observeReveal($$(".lawyer-card", cardGrid));

  showingCount.textContent = `Showing ${Math.min(state.visible, showList.length)} of ${filtered.length} experts`;
  loadMoreBtn.style.display = state.visible >= showList.length ? "none" : "inline-flex";

  expertCount.textContent = `${LAWYERS.length} experts`;
}

/* =========================================================
   REVEAL ON SCROLL (staggered)
   ========================================================= */
let revealObserver;
function observeReveal(elements){
  if(!revealObserver){
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const el = entry.target;
          const idx = Number(el.dataset.i || 0);
          el.style.transitionDelay = `${Math.min(idx,10) * 55}ms`;
          el.classList.add("in-view");
          revealObserver.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  }
  elements.forEach((el, i) => {
    el.dataset.i = i % 8;
    revealObserver.observe(el);
  });
}

/* =========================================================
   HERO: avatar stack + typing effect
   ========================================================= */
function renderAvatarStack(){
  avatarStack.innerHTML = LAWYERS.slice(0,3).map((l,i) =>
    `<img src="${l.photo}" alt="${l.name}" style="animation-delay:${i*120}ms">`).join("");
  const heroImg = $("#hero-card img[data-face]");
  if(heroImg) heroImg.src = LAWYERS[0].photo;
}

const TYPE_PHRASES = ["Analyzing terms…", "Matching clause type…", "Cross-referencing precedent…", "Verifying jurisdiction…"];
function startTyping(){
  const el = $("#typing-text");
  if(!el) return;
  let phraseIdx = 0, charIdx = 0, deleting = false;
  function tick(){
    const phrase = TYPE_PHRASES[phraseIdx];
    el.textContent = phrase.slice(0, charIdx);
    if(!deleting && charIdx < phrase.length){ charIdx++; setTimeout(tick, 42); }
    else if(!deleting && charIdx >= phrase.length){ deleting = true; setTimeout(tick, 1400); }
    else if(deleting && charIdx > 0){ charIdx--; setTimeout(tick, 22); }
    else { deleting = false; phraseIdx = (phraseIdx+1) % TYPE_PHRASES.length; setTimeout(tick, 250); }
  }
  tick();
}

/* =========================================================
   CAROUSEL ARROWS
   ========================================================= */
function initCarousel(){
  const prev = $('[data-carousel="prev"]');
  const next = $('[data-carousel="next"]');
  const step = () => (specTrack.querySelector(".spec-card")?.offsetWidth || 240) + 20;
  function updateArrows(){
    prev.disabled = specTrack.scrollLeft <= 4;
    next.disabled = specTrack.scrollLeft >= specTrack.scrollWidth - specTrack.clientWidth - 4;
  }
  prev.addEventListener("click", () => specTrack.scrollBy({left: -step()*2, behavior:"smooth"}));
  next.addEventListener("click", () => specTrack.scrollBy({left: step()*2, behavior:"smooth"}));
  specTrack.addEventListener("scroll", updateArrows);
  window.addEventListener("resize", updateArrows);
  setTimeout(updateArrows, 300);
}

/* =========================================================
   MODAL (side drawer)
   ========================================================= */
const modalOverlay = $("#modal-overlay");
const modalBody = $("#modal-body");

function openModal(id){
  const l = LAWYERS.find(x=>x.id===id);
  if(!l) return;
  modalBody.innerHTML = `
    <div class="modal-header">
      <div class="modal-photo" style="background:${l.focus.soft}"><img src="${l.photo}" alt="${l.name}"></div>
      <div>
        <h2>${l.name}</h2>
        <p class="modal-role">${l.focus.label} · ${l.city}</p>
        <p class="signature" style="color:${l.focus.color}">${l.name.replace(/^Adv\.\s*/,'')}</p>
      </div>
    </div>
    <div class="modal-main">
      <div class="modal-section">
        <h4>Specializations</h4>
        <div class="modal-tags">${l.tags.map(t=>`<span class="tag" style="background:${t.soft};color:${t.text}">${t.label}</span>`).join("")}</div>
      </div>
      <div class="modal-section">
        <h4>Biography</h4>
        <p>${l.bio}</p>
      </div>
      <div class="modal-section">
        <h4>Representative Matters</h4>
        <ul style="--dot:${l.focus.color}">${l.matters.map(m=>`<li>${m}</li>`).join("")}</ul>
      </div>
    </div>
    <div class="modal-side">
      <div class="modal-stat"><h5>Rating</h5><p>★ ${l.rating.toFixed(2)} (${l.reviews})</p></div>
      <div class="modal-stat"><h5>Languages</h5><p>${l.languages.join(", ")}</p></div>
      <div class="modal-stat"><h5>Member Since</h5><p>${l.memberSince}</p></div>
      <div class="modal-stat"><h5>Response Time</h5><p class="resp">~${l.response} hour${l.response>1?'s':''}</p></div>
      <button class="btn btn-primary" data-connect="${l.id}" style="background:${l.focus.color}">Connect with ${l.name.split(" ")[1]}</button>
    </div>
  `;
  modalOverlay.classList.add("open");
  document.body.classList.add("modal-lock");
}
function closeModal(){
  modalOverlay.classList.remove("open");
  document.body.classList.remove("modal-lock");
}

/* =========================================================
   TOAST
   ========================================================= */
let toastTimer;
function showToast(msg){
  const toast = $("#toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> toast.classList.remove("show"), 2600);
}

/* =========================================================
   CONFETTI BURST — fires in the 9 category colors on Connect
   ========================================================= */
const CONFETTI_COLORS = FOCUS_CATS.map(c => c.color);
function confettiBurst(x, y){
  const n = 16;
  for(let i=0;i<n;i++){
    const el = document.createElement("span");
    el.className = "confetti-bit";
    const angle = (Math.PI * 2 * i) / n + (Math.random()*0.4 - 0.2);
    const dist = 60 + Math.random()*70;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 30;
    el.style.setProperty("--dx", `${dx}px`);
    el.style.setProperty("--dy", `${dy}px`);
    el.style.setProperty("--bg", CONFETTI_COLORS[i % CONFETTI_COLORS.length]);
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

/* =========================================================
   CURSOR SPOTLIGHT on cards (colored per category)
   ========================================================= */
function initSpotlight(){
  document.addEventListener("pointermove", (e) => {
    const card = e.target.closest(".lawyer-card, .spec-card, .featured-card");
    if(!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--sx", `${e.clientX - r.left}px`);
    card.style.setProperty("--sy", `${e.clientY - r.top}px`);
  });
}

/* =========================================================
   EVENTS
   ========================================================= */
function bindEvents(){
  document.addEventListener("click", (e) => {
    const specBtn = e.target.closest(".spec-card");
    if(specBtn){
      state.category = specBtn.dataset.cat;
      state.visible = state.pageSize;
      renderAll();
      document.getElementById("directory").scrollIntoView({behavior:"smooth", block:"start"});
      return;
    }
    const filterItem = e.target.closest(".filter-item");
    if(filterItem){
      state.category = filterItem.dataset.cat;
      state.visible = state.pageSize;
      renderAll();
      return;
    }
    const viewBtn = e.target.closest(".view-profile");
    if(viewBtn){ e.preventDefault(); openModal(viewBtn.dataset.id); return; }

    const connectBtn = e.target.closest("[data-connect]");
    if(connectBtn){
      const l = LAWYERS.find(x=>x.id===connectBtn.dataset.connect);
      const r = connectBtn.getBoundingClientRect();
      confettiBurst(r.left + r.width/2, r.top + r.height/2);
      showToast(`Request sent to ${l ? l.name : "specialist"} — expect a reply soon.`);
      return;
    }
    if(e.target.closest("#modal-close") || e.target === modalOverlay){ closeModal(); return; }
    if(e.target.closest('[data-action="open-signin"]')){ showToast("Sign in coming soon."); return; }
  });

  document.addEventListener("pointermove", (e) => {
    const btn = e.target.closest(".btn");
    if(!btn) return;
    const r = btn.getBoundingClientRect();
    btn.style.setProperty("--mx", `${e.clientX - r.left}px`);
    btn.style.setProperty("--my", `${e.clientY - r.top}px`);
  });

  document.addEventListener("keydown", (e) => { if(e.key === "Escape") closeModal(); });

  $("#search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    state.query = $("#search-input").value;
    state.visible = state.pageSize;
    renderAll();
    document.getElementById("directory").scrollIntoView({behavior:"smooth", block:"start"});
  });

  $("#sort-select").addEventListener("change", (e) => { state.sort = e.target.value; renderAll(); });
  $("#jurisdiction-select").addEventListener("change", () => showToast("Jurisdiction filter applied."));

  $("#fast-toggle").addEventListener("click", (e) => {
    const btn = e.currentTarget;
    const on = btn.getAttribute("aria-checked") === "true";
    btn.setAttribute("aria-checked", String(!on));
    state.fastOnly = !on;
    state.visible = state.pageSize;
    renderAll();
  });

  loadMoreBtn.addEventListener("click", () => {
    const textEl = $("#load-more-text");
    const spinner = $("#load-spinner");
    textEl.style.opacity = ".4";
    spinner.hidden = false;
    setTimeout(() => {
      state.visible += state.pageSize;
      renderGrid();
      textEl.style.opacity = "1";
      spinner.hidden = true;
    }, 420);
  });
}

/* =========================================================
   INIT
   ========================================================= */
function renderAll(){ renderSpecCards(); renderFilters(); renderGrid(); }

document.addEventListener("DOMContentLoaded", () => {
  renderAvatarStack();
  renderAll();
  initCarousel();
  initSpotlight();
  bindEvents();
  startTyping();
});
})();
