const products = [
  {id:1,name:"Woven Jute Tote",category:"Accessories",price:399,maker:"Sakhi Craft Collective",emoji:"👜",tag:"Bestseller",bg:"#ead9bd",description:"A reusable everyday tote inspired by traditional weaving."},
  {id:2,name:"Terracotta Planter",category:"Home",price:249,maker:"Mitti Women’s Group",emoji:"🪴",tag:"Handmade",bg:"#e8c5ad",description:"A warm, earthy planter for a small green corner."},
  {id:3,name:"Embroidered Pouch",category:"Craft",price:299,maker:"Rang Threads SHG",emoji:"👝",tag:"Crafted slowly",bg:"#d8dfc5",description:"A colourful pouch inspired by decorative hand stitching."},
  {id:4,name:"Handmade Candles",category:"Home",price:199,maker:"Udaan Makers Group",emoji:"🕯️",tag:"Gift idea",bg:"#f0dfb7",description:"Simple decorative candles for a cosy home."},
  {id:5,name:"Decorative Wall Art",category:"Craft",price:349,maker:"Sakhi Craft Collective",emoji:"🪷",tag:"Artisan-made",bg:"#d9d5e8",description:"A decorative piece inspired by folk patterns."},
  {id:6,name:"Spice Gift Set",category:"Food",price:279,maker:"Pragati SHG",emoji:"🫙",tag:"Pantry pick",bg:"#edc9a9",description:"A sample gift set concept for locally prepared spices."},
  {id:7,name:"Handwoven Basket",category:"Home",price:459,maker:"Mitti Women’s Group",emoji:"🧺",tag:"Natural texture",bg:"#d8c6a9",description:"A versatile basket for storing everyday essentials."},
  {id:8,name:"Beaded Earrings",category:"Accessories",price:179,maker:"Rang Threads SHG",emoji:"📿",tag:"Small-batch",bg:"#e8d4d7",description:"A colourful accessory concept made for everyday styling."}
];
const state = {category:"all", search:"", cart:{}};
const $ = (id) => document.getElementById(id);
const money = (amount) => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(amount);
function renderProducts(){
  const filtered = products.filter(p => (state.category==="all" || p.category===state.category) && (p.name+" "+p.category+" "+p.maker).toLowerCase().includes(state.search.toLowerCase()));
  $("productGrid").innerHTML = filtered.length ? filtered.map(p => `
    <article class="product-card">
      <div class="product-image" style="background:${p.bg}"><span class="product-tag">${p.tag}</span><span class="emoji" aria-hidden="true">${p.emoji}</span></div>
      <div class="product-info"><p class="product-category">${p.category==="Home"?"Home & Living":p.category}</p><h3>${p.name}</h3><p class="maker">By ${p.maker}</p><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-btn" data-add="${p.id}" aria-label="Add ${p.name} to bag">+</button></div></div>
    </article>`).join("") : `<div class="empty-state">No products match your search. Try another name or category.</div>`;
  document.querySelectorAll("[data-add]").forEach(btn=>btn.addEventListener("click",()=>addToCart(Number(btn.dataset.add))));
}
function addToCart(id){state.cart[id]=(state.cart[id]||0)+1;renderCart();showToast(`${products.find(p=>p.id===id).name} added to your bag`);}
function updateQty(id,delta){state.cart[id]=(state.cart[id]||0)+delta;if(state.cart[id]<=0)delete state.cart[id];renderCart();}
function renderCart(){
  const ids=Object.keys(state.cart).map(Number);const count=ids.reduce((sum,id)=>sum+state.cart[id],0);
  $("cartCount").textContent=count;
  $("cartItems").innerHTML=ids.length?ids.map(id=>{const p=products.find(x=>x.id===id);return `<div class="cart-row"><div class="cart-thumb" style="background:${p.bg}">${p.emoji}</div><div><h4>${p.name}</h4><small>${money(p.price)} each</small><div class="qty-control"><button data-qty="${id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${state.cart[id]}</span><button data-qty="${id}" data-delta="1" aria-label="Increase quantity">+</button></div></div><div><strong>${money(p.price*state.cart[id])}</strong><br><button class="remove-item" data-remove="${id}">Remove</button></div></div>`}).join(""):`<div class="cart-empty"><div style="font-size:3rem">🧺</div><strong>Your bag is waiting.</strong><p>Add a product to see it here.</p></div>`;
  $("cartTotal").textContent=money(ids.reduce((sum,id)=>sum+products.find(p=>p.id===id).price*state.cart[id],0));
  document.querySelectorAll("[data-qty]").forEach(b=>b.addEventListener("click",()=>updateQty(Number(b.dataset.qty),Number(b.dataset.delta))));
  document.querySelectorAll("[data-remove]").forEach(b=>b.addEventListener("click",()=>{delete state.cart[Number(b.dataset.remove)];renderCart();}));
}
function openCart(){ $("cartOverlay").classList.add("open");$("cartOverlay").setAttribute("aria-hidden","false");document.body.style.overflow="hidden"; }
function closeCart(){ $("cartOverlay").classList.remove("open");$("cartOverlay").setAttribute("aria-hidden","true");document.body.style.overflow=""; }
let toastTimer;
function showToast(msg){const toast=$("toast");toast.textContent=msg;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2300);}
$("searchInput").addEventListener("input",e=>{state.search=e.target.value;renderProducts();});
$("categoryFilter").addEventListener("change",e=>{state.category=e.target.value;document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("active",c.dataset.category===state.category));renderProducts();});
document.querySelectorAll(".chip").forEach(c=>c.addEventListener("click",()=>{state.category=c.dataset.category;$("categoryFilter").value=state.category;document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("active",x===c));renderProducts();}));
$("cartJump").addEventListener("click",openCart);$("closeCart").addEventListener("click",closeCart);
$("cartOverlay").addEventListener("click",e=>{if(e.target===$("cartOverlay"))closeCart();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart();});
$("checkoutBtn").addEventListener("click",()=>{$("checkoutStatus").textContent=Object.keys(state.cart).length?"Demo checkout ready. This prototype does not process payments or create a real order.":"Your bag is empty. Add a product before continuing.";});
$("contactForm").addEventListener("submit",e=>{e.preventDefault();$("formStatus").textContent="Thanks! This demo form works locally, but no message was sent to a server.";e.target.reset();});
$("menuToggle").addEventListener("click",()=>{const open=$("mainNav").classList.toggle("open");$("menuToggle").setAttribute("aria-expanded",String(open));});
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>{$("mainNav").classList.remove("open");$("menuToggle").setAttribute("aria-expanded","false");}));
$("year").textContent=new Date().getFullYear();
renderProducts();renderCart();
