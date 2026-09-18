/* ============ Green Gains · app logic ============ */
'use strict';

/* ---------- Catalog data ---------- */
const PRODUCTS = [
  {id:'bowl-buddha', name:'Power Buddha Bowl', cat:'meals', emoji:'🥗', price:299, protein:32, kcal:520, pop:98, desc:'Quinoa, smoked tofu, edamame, avocado & tahini-lime dressing.'},
  {id:'bowl-tofu', name:'Tofu Tikka Bowl', cat:'meals', emoji:'🍛', price:329, protein:34, kcal:540, pop:95, desc:'Char-grilled tofu tikka, brown rice, coconut-yogurt raita.'},
  {id:'rice-tempeh', name:'Tempeh Fried Rice', cat:'meals', emoji:'🍚', price:319, protein:30, kcal:610, pop:88, desc:'Wok-fired tempeh, jasmine rice, edamame & scallions.'},
  {id:'wrap-chaap', name:'Soya Chaap Protein Wrap', cat:'meals', emoji:'🌯', price:279, protein:28, kcal:480, pop:90, desc:'Tandoori soya chaap, mint chutney, whole-wheat wrap.'},
  {id:'seitan-steak', name:'Seitan Steak & Mash', cat:'meals', emoji:'🍄', price:349, protein:38, kcal:460, pop:85, desc:'Grilled seitan steak, herbed cauliflower mash & greens.'},
  {id:'shake-green', name:'Green Muscle Shake', cat:'shakes', emoji:'🥤', price:199, protein:25, kcal:290, pop:96, desc:'Pea protein, spinach, banana, dates & almond milk.'},
  {id:'shake-pboats', name:'PB Oats Shake', cat:'shakes', emoji:'🥜', price:189, protein:22, kcal:380, pop:92, desc:'Peanut butter, oats, oat milk & a hint of cinnamon.'},
  {id:'shake-cacao', name:'Cacao Recovery Shake', cat:'shakes', emoji:'🍫', price:209, protein:24, kcal:310, pop:87, desc:'Raw cacao, pea protein, dates & a cold-brew kick.'},
  {id:'snack-edamame', name:'Roasted Edamame Pack', cat:'snacks', emoji:'🫛', price:129, protein:18, kcal:190, pop:84, desc:'Sea-salt roasted edamame. Pocket-size protein.'},
  {id:'snack-balls', name:'Protein Energy Balls · 6', cat:'snacks', emoji:'⚡', price:149, protein:14, kcal:220, pop:89, desc:'Date, cocoa & pea protein bites. No refined sugar.'},
  {id:'staple-tofu', name:'Tofu "Paneer" Block 400g', cat:'staples', emoji:'🧆', price:169, protein:40, kcal:320, pop:80, desc:'Firm high-protein tofu. Cook it like paneer — minus the dairy.'},
  {id:'staple-tempeh', name:'Tempeh Slabs 300g', cat:'staples', emoji:'🌰', price:199, protein:42, kcal:360, pop:78, desc:'Cultured soy tempeh — marinate, grill or crumble it.'},
];

/* ---------- Meal plan data ---------- */
const PLANS = [
  {id:'plan-lean', name:'Lean Cut · 7 Days', emoji:'🔥', price:2099, tagline:'Shred fat, keep the muscle.',
    features:['3 macro-balanced meals / day','~150g protein & under 1,800 kcal daily','Free chilled delivery every morning','Pause or cancel anytime']},
  {id:'plan-bulk', name:'Bulk Builder · 7 Days', emoji:'💪', price:2799, tagline:'Surplus without the guesswork.',
    features:['3 meals + 2 shakes / day','~200g protein & ~3,000 kcal daily','Free chilled delivery every morning','Pause or cancel anytime']},
  {id:'plan-athlete', name:'Athlete · 30 Days', emoji:'🏆', price:8999, tagline:'For the daily grinders.',
    features:['4 meals + shakes daily','Custom macros with our coach','Free protein pack every week','Priority delivery slot']},
];

/* ---------- State ---------- */
const CART_KEY = 'gg_cart_v1';
let cart = loadCart();
let activeFilter = 'all';
let searchTerm = '';
let sortMode = 'popular';

function loadCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch { return {}; } }
function saveCart(){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

const $ = s => document.querySelector(s);
const rupee = n => '₹' + n.toLocaleString('en-IN');

/* ---------- Rendering: products ---------- */
function visibleProducts(){
  let list = PRODUCTS.filter(p => activeFilter === 'all' || p.cat === activeFilter);
  if (searchTerm){
    const q = searchTerm.toLowerCase();
    list = list.filter(p => (p.name + ' ' + p.desc).toLowerCase().includes(q));
  }
  if (sortMode === 'protein')      list = [...list].sort((a,b) => b.protein - a.protein);
  else if (sortMode === 'price-asc')  list = [...list].sort((a,b) => a.price - b.price);
  else if (sortMode === 'price-desc') list = [...list].sort((a,b) => b.price - a.price);
  else                             list = [...list].sort((a,b) => b.pop - a.pop);
  return list;
}

function renderProducts(){
  const list = visibleProducts();
  $('#productGrid').innerHTML = list.map(p => `
    <article class="card glass">
      <div class="card-art"><span>${p.emoji}</span><span class="tag">${p.protein}g protein</span></div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <p class="desc">${p.desc}</p>
        <div class="macros"><span>${p.protein}g protein</span><span>${p.kcal} kcal</span></div>
        <div class="card-meta">
          <span class="price">${rupee(p.price)}</span>
          <button class="add-btn" data-add="${p.id}">+ Add</button>
        </div>
      </div>
    </article>`).join('');
  $('#emptyMsg').hidden = list.length > 0;
}

/* ---------- Rendering: meal plans ---------- */
function renderPlans(){
  $('#plansGrid').innerHTML = PLANS.map(pl => `
    <article class="plan glass reveal ${pl.id === 'plan-bulk' ? 'featured' : ''}">
      <span class="plan-emoji">${pl.emoji}</span>
      <h3>${pl.name}</h3>
      <p class="tagline">${pl.tagline}</p>
      <div class="plan-price">${rupee(pl.price)}<small> / ${pl.id === 'plan-athlete' ? 'month' : 'week'}</small></div>
      <ul>${pl.features.map(f => `<li>✔ ${f}</li>`).join('')}</ul>
      <button class="btn btn-primary w-full" data-plan="${pl.id}">Subscribe</button>
    </article>`).join('');
}

/* ---------- Cart ---------- */
function findItem(id){ return PRODUCTS.find(p => p.id === id) || PLANS.find(p => p.id === id); }
function cartEntries(){
  return Object.entries(cart)
    .map(([id, qty]) => ({ ...(findItem(id) || {}), qty }))
    .filter(e => e.id);
}
function cartCount(){ return cartEntries().reduce((s,e) => s + e.qty, 0); }
function cartSubtotal(){ return cartEntries().reduce((s,e) => s + e.price * e.qty, 0); }

function addToCart(id, name, price, emoji){
  cart[id] = (cart[id] || 0) + 1;
  saveCart(); syncCartUI();
  toast(`${emoji} ${name} added`);
}
function setQty(id, qty){
  if (qty <= 0) delete cart[id]; else cart[id] = qty;
  saveCart(); syncCartUI();
}

function syncCartUI(){
  const n = cartCount();
  $('#cartCount').textContent = n;
  $('#cartCount2').textContent = n;
  $('#cartSubtotal').textContent = rupee(cartSubtotal());
  renderCartItems();
  const sub = cartSubtotal();
  const left = Math.max(0, 499 - sub);
  $('#fsFill').style.width = Math.min(100, (sub / 499) * 100) + '%';
  $('#fsText').textContent = left > 0
    ? `Add ${rupee(left)} more for free delivery`
    : '🎉 You unlocked free delivery!';
}

function renderCartItems(){
  const items = cartEntries();
  if (!items.length){
    $('#cartItems').innerHTML = '<div class="cart-empty">Your cart is empty.<br>Time to eat some gains. 💪</div>';
    return;
  }
  $('#cartItems').innerHTML = items.map(e => `
    <div class="cart-item">
      <span class="ci-emoji">${e.emoji}</span>
      <div class="ci-info"><strong>${e.name}</strong><small>${rupee(e.price)}</small></div>
      <div class="qty">
        <button data-dec="${e.id}" aria-label="Decrease">−</button>
        <b>${e.qty}</b>
        <button data-inc="${e.id}" aria-label="Increase">+</button>
      </div>
      <button class="ci-remove" data-del="${e.id}" aria-label="Remove">✕</button>
    </div>`).join('');
}

function openCart(){ document.body.classList.add('cart-open'); }
function closeCart(){ document.body.classList.remove('cart-open'); }

function checkout(){
  const items = cartEntries();
  if (!items.length){ toast('Cart is empty — add some gains first 🌱'); return; }
  const lines = items.map(e => `• ${e.name} ×${e.qty} — ${rupee(e.price * e.qty)}`);
  const text = `Hi Green Gains! 🌱 I'd like to order:\n\n${lines.join('\n')}\n\nSubtotal: ${rupee(cartSubtotal())}\n(demo checkout — connect payments later)`;
  window.open(`https://wa.me/919000000000?text=${encodeURIComponent(text)}`, '_blank');
}

/* ---------- Protein calculator ---------- */
let calcSuggest = [];
const GOAL = {
  cut:      { f: 2.0, hint: 'Cutting: high protein, moderate deficit. We prioritise meals under 550 kcal.' },
  maintain: { f: 1.6, hint: 'Recomp mode: steady protein, whole-food carbs around training.' },
  bulk:     { f: 2.2, hint: 'Bulking: add shakes between meals to hit the surplus comfortably.' },
};

function runCalc(){
  const w = parseFloat($('#calcWeight').value);
  if (!w || w < 30 || w > 200){ toast('Enter a weight between 30–200 kg'); return; }
  const goal = $('#calcGoal').value;
  const act  = parseFloat($('#calcActivity').value);
  const g    = Math.round(w * GOAL[goal].f);
  const kcal = Math.round((w * 22 * act) / 10) * 10;
  $('#proteinTarget').textContent = g;
  $('#kcalTarget').textContent = kcal.toLocaleString('en-IN');
  $('#calcHint').textContent = GOAL[goal].hint;
  $('#calcResult').hidden = false;
  calcSuggest = suggest(g);
  toast('Target computed — add suggested meals →');
}

/* Pick high-protein products covering ~60% of the daily target */
function suggest(target){
  const pool = PRODUCTS.filter(p => p.cat !== 'staples').sort((a,b) => b.protein - a.protein);
  const picks = [];
  let covered = 0;
  for (const p of pool){
    if (picks.length >= 4) break;
    if (p.protein <= target * 0.6 - covered + 10){ picks.push(p); covered += p.protein; }
  }
  if (!picks.length) picks.push(pool[0]);
  return picks;
}

function addSuggested(){
  if (!calcSuggest.length){ toast('Calculate your target first 🧮'); return; }
  calcSuggest.forEach(p => { cart[p.id] = (cart[p.id] || 0) + 1; });
  saveCart(); syncCartUI(); openCart();
  toast('Suggested meals added to cart 🛒');
}

/* ---------- Toast + reveal ---------- */
let toastTimer;
function toast(msg){
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

function initReveal(){
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting){ en.target.classList.add('visible'); io.unobserve(en.target); }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ---------- Events ---------- */
function bindEvents(){
  $('#cartBtn').addEventListener('click', openCart);
  $('#floatCart').addEventListener('click', openCart);
  $('#cartClose').addEventListener('click', closeCart);
  $('#overlay').addEventListener('click', closeCart);
  $('#checkoutBtn').addEventListener('click', checkout);
  $('#clearCartBtn').addEventListener('click', () => { cart = {}; saveCart(); syncCartUI(); toast('Cart cleared 🧹'); });

  $('#filterPills').addEventListener('click', e => {
    const btn = e.target.closest('.pill');
    if (!btn) return;
    document.querySelectorAll('#filterPills .pill').forEach(p => p.classList.toggle('active', p === btn));
    activeFilter = btn.dataset.filter;
    renderProducts();
  });
  $('#searchInput').addEventListener('input', e => { searchTerm = e.target.value.trim(); renderProducts(); });
  $('#sortSelect').addEventListener('change', e => { sortMode = e.target.value; renderProducts(); });

  document.addEventListener('click', e => {
    const add  = e.target.closest('[data-add]');
    const plan = e.target.closest('[data-plan]');
    const inc  = e.target.closest('[data-inc]');
    const dec  = e.target.closest('[data-dec]');
    const del  = e.target.closest('[data-del]');
    if (add){  const p  = PRODUCTS.find(x => x.id === add.dataset.add);  addToCart(p.id, p.name, p.price, p.emoji); }
    if (plan){ const pl = PLANS.find(x => x.id === plan.dataset.plan);   addToCart(pl.id, pl.name, pl.price, pl.emoji); }
    if (inc) setQty(inc.dataset.inc, (cart[inc.dataset.inc] || 0) + 1);
    if (dec) setQty(dec.dataset.dec, (cart[dec.dataset.dec] || 0) - 1);
    if (del) setQty(del.dataset.del, 0);
  });

  $('#navToggle').addEventListener('click', () => document.body.classList.toggle('nav-open'));
  document.querySelectorAll('.nav-link').forEach(a => a.addEventListener('click', () => document.body.classList.remove('nav-open')));

  $('#calcBtn').addEventListener('click', runCalc);
  $('#calcAddBtn').addEventListener('click', addSuggested);
}

/* ---------- Init ---------- */
renderProducts();
renderPlans();
syncCartUI();
bindEvents();
initReveal();



