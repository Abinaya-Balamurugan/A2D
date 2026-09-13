const $ = id => document.getElementById(id);
let products = [];
let selectedProductId = null;

async function loadProducts() {
  try {
    const res = await fetch("/api/products");
    products = await res.json();
  } catch {
    products = [];
  }
  renderProducts(products);
  $("dressSelect").innerHTML = products.map(p =>
    `<option value="${p.name}" data-id="${p.id}">${p.name} — ₹${p.price}</option>`
  ).join("");
  syncProductSelection();
  checkAIStatus();
}

function syncProductSelection() {
  const option = $("dressSelect").selectedOptions[0];
  selectedProductId = option?.dataset.id || products[0]?.id;
  const p = products.find(x => String(x.id) === String(selectedProductId));
  if (p) $("clothType").value = p.garmentType || "upper";
}

function renderProducts(items) {
  $("recommendations").innerHTML = items.length ? items.map(p => `
    <article class="product">
      <img src="${p.image}" alt="${p.name}">
      <div class="product-body">
        <span class="tag">${p.color}</span>
        <h3>${p.name}</h3>
        <p>${p.brand} • ${p.type}</p>
        <p>Sizes: ${p.sizes.join(", ")}</p>
        <p class="price">₹${p.price}</p>
        <button class="secondary full" onclick="selectDress(${p.id})">Try This Outfit</button>
      </div>
    </article>`).join("") :
    `<p style="grid-column:1/-1;text-align:center;color:#777">No exact matches. Try changing your filters.</p>`;
}

function selectDress(id) {
  const p = products.find(x => String(x.id) === String(id));
  if (!p) return;
  $("dressSelect").value = p.name;
  syncProductSelection();
  $("tryon").scrollIntoView({behavior:"smooth"});
}

async function getRecommendations() {
  const payload = {
    gender: $("gender").value,
    type: $("type").value,
    color: $("color").value,
    occasion: $("occasion").value,
    budget: $("budget").value
  };
  $("recommendations").innerHTML =
    `<p style="grid-column:1/-1;text-align:center">✨ AI is analyzing your preferences...</p>`;
  try {
    const res = await fetch("/api/recommend", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(payload)
    });
    const data = await res.json();
    renderProducts(data.recommendations || []);
  } catch {
    renderProducts(products);
  }
}

function previewImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  $("preview").innerHTML = `<img src="${url}" alt="Uploaded full body photo">`;
}

async function checkAIStatus() {
  try {
    const r = await fetch("/api/ai-status");
    const data = await r.json();
    $("aiLive").textContent = data.online ? "● CATVTON ONLINE" : "● CATVTON OFFLINE";
    $("aiLive").className = data.online ? "live" : "";
    $("aiLive").style.color = data.online ? "#24a86b" : "#d34b4b";
  } catch {
    $("aiLive").textContent = "● BACKEND OFFLINE";
    $("aiLive").style.color = "#d34b4b";
  }
}

async function runTryOn() {
  const file = $("userImage").files[0];
  if (!file) {
    $("tryonStatus").textContent = "Please upload a clear full-body image first.";
    return;
  }

  const product = products.find(p => String(p.id) === String(selectedProductId));
  const garment = $("garmentImage").files[0];
  const form = new FormData();
  form.append("userImage", file);
  if (garment) form.append("garmentImage", garment);
  if (selectedProductId) form.append("productId", selectedProductId);
  form.append("dressName", product?.name || $("dressSelect").value);
  form.append("clothType", $("clothType").value);
  form.append("steps", $("steps").value);
  form.append("guidance", "2.5");
  form.append("seed", "42");

  $("tryonStatus").textContent = "CatVTON is generating your virtual try-on. Please wait...";
  $("tryonResult").innerHTML =
    `<div><div class="result-icon">⏳</div><h3>Generating AI try-on...</h3><p>CatVTON is processing the person and garment images.</p></div>`;

  try {
    const res = await fetch("/api/tryon", {method:"POST", body:form});
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.detail || data.message || "Try-on failed");

    const src = data.resultUrl.startsWith("/") ? data.resultUrl : data.resultUrl;
    $("tryonResult").classList.add("result-image");
    $("tryonResult").innerHTML = `
      <div>
        <img src="${src}" alt="CatVTON virtual try-on result">
        <h3>${data.dressName || product?.name || "Selected outfit"}</h3>
        <p class="success-box">✓ Real CatVTON inference completed.</p>
        <a class="download-result" href="${src}" target="_blank">Open Result</a>
      </div>`;
    $("tryonStatus").textContent = "✓ CatVTON try-on completed successfully.";
  } catch (err) {
    $("tryonResult").classList.remove("result-image");
    $("tryonResult").innerHTML = `
      <div class="error-box">
        <b>CatVTON generation failed</b><br><br>
        ${escapeHtml(err.message)}
        <br><br>
        Start CatVTON on <b>127.0.0.1:7860</b>, then start the Flask bridge on <b>5001</b>.
      </div>`;
    $("tryonStatus").textContent = "AI generation failed. Check the CatVTON and Flask terminals.";
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function openAuth(){ $("authModal").classList.add("open"); }
function openRetailer(){ $("retailModal").classList.add("open"); }
function closeModal(){ document.querySelectorAll(".modal").forEach(m => m.classList.remove("open")); }
function showQR(){ alert("Demo QR: connect this action to your retailer-specific QR code."); }
document.querySelectorAll(".modal").forEach(m =>
  m.addEventListener("click", e => { if(e.target === m) closeModal(); })
);

loadProducts();
