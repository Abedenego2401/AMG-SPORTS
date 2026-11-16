document.addEventListener("DOMContentLoaded", () => {

  const nav = document.querySelector("nav");
  const header = document.querySelector("header");
  const produtos = document.querySelector("#produtos");
  const irParaProdutos = () =>
    produtos && produtos.scrollIntoView({ behavior: "smooth" });

  // MENU MOBILE
  const menuBtn = document.querySelector(".menu-mobile");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => nav.classList.toggle("active"));
  }

  // SCROLL SUAVE (só links internos que existem na página)
  document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length <= 1) return;
      const section = document.querySelector(id);
      if (!section) return;
      e.preventDefault();
      if (nav) nav.classList.remove("active");
      section.scrollIntoView({ behavior: "smooth" });
    });
  });

  // BOTÕES DO HERO (Comprar Agora e Ver Coleção)
  document
    .querySelectorAll(".btn-primary, .btn-secondary")
    .forEach((b) => b.addEventListener("click", irParaProdutos));

  // EFEITO NO HEADER
  if (header) {
    window.addEventListener("scroll", () => {
      header.style.boxShadow =
        window.scrollY > 50 ? "0 0 15px rgba(0,0,0,0.5)" : "none";
    });
  }

  // ================= CARRINHO =================

  const brl = (n) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const esc = (s) =>
    s.replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("amg-cart")) || [];
  } catch (e) {
    cart = [];
  }

  const save = () => {
    try {
      localStorage.setItem("amg-cart", JSON.stringify(cart));
    } catch (e) {}
  };

  // Estilo do carrinho (pode mover para o style.css depois)
  const style = document.createElement("style");
  style.textContent = `
    .cart-fab{position:fixed;right:20px;bottom:20px;width:56px;height:56px;border:none;border-radius:50%;background:#0066ff;color:#fff;font-size:22px;cursor:pointer;z-index:1000;box-shadow:0 4px 15px rgba(0,0,0,.4)}
    .cart-count{position:absolute;top:-4px;right:-4px;min-width:22px;height:22px;padding:0 4px;border-radius:11px;background:#ff3b3b;color:#fff;font-size:12px;display:none;align-items:center;justify-content:center}
    .cart-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);opacity:0;pointer-events:none;transition:.3s;z-index:1001}
    .cart-overlay.open{opacity:1;pointer-events:auto}
    .cart-panel{position:fixed;top:0;right:0;height:100%;width:min(380px,100%);background:#111;color:#fff;transform:translateX(100%);transition:.3s;z-index:1002;display:flex;flex-direction:column}
    .cart-panel.open{transform:none}
    .cart-head{display:flex;justify-content:space-between;align-items:center;padding:18px 20px;border-bottom:1px solid #333}
    .cart-close{background:none;border:none;color:#fff;font-size:28px;cursor:pointer}
    .cart-items{flex:1;overflow-y:auto;padding:10px 20px}
    .cart-empty{text-align:center;color:#aaa;margin-top:40px}
    .cart-item{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:14px 0;border-bottom:1px solid #222}
    .cart-item h4{margin:0 0 4px;font-size:15px}
    .cart-item span{color:#aaa;font-size:14px}
    .cart-qty{display:flex;align-items:center;gap:8px}
    .cart-qty button{width:28px;height:28px;border:none;border-radius:6px;background:#2a2a2a;color:#fff;cursor:pointer}
    .cart-foot{padding:20px;border-top:1px solid #333}
    .cart-total{display:flex;justify-content:space-between;margin-bottom:14px;font-size:18px}
    .cart-checkout{width:100%;padding:14px;border:none;border-radius:8px;background:#0066ff;color:#fff;font-size:16px;cursor:pointer}
  `;
  document.head.appendChild(style);

  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <button class="cart-fab" aria-label="Abrir carrinho">
      <i class="fa-solid fa-cart-shopping"></i>
      <span class="cart-count">0</span>
    </button>
    <div class="cart-overlay"></div>
    <aside class="cart-panel">
      <div class="cart-head">
        <h3>Seu carrinho</h3>
        <button class="cart-close" aria-label="Fechar carrinho">&times;</button>
      </div>
      <div class="cart-items"></div>
      <div class="cart-foot">
        <div class="cart-total"><span>Total:</span><strong>R$ 0,00</strong></div>
        <button class="cart-checkout">Finalizar compra</button>
      </div>
    </aside>`
  );

  const fab = document.querySelector(".cart-fab");
  const count = document.querySelector(".cart-count");
  const overlay = document.querySelector(".cart-overlay");
  const panel = document.querySelector(".cart-panel");
  const itemsEl = document.querySelector(".cart-items");
  const totalEl = document.querySelector(".cart-total strong");

  const toggleCart = (open) => {
    panel.classList.toggle("open", open);
    overlay.classList.toggle("open", open);
  };

  function render() {
    const qtd = cart.reduce((s, i) => s + i.qtd, 0);
    const total = cart.reduce((s, i) => s + i.preco * i.qtd, 0);

    count.textContent = qtd;
    count.style.display = qtd ? "flex" : "none";
    totalEl.textContent = brl(total);

    if (!cart.length) {
      itemsEl.innerHTML = '<p class="cart-empty">Seu carrinho está vazio.</p>';
      return;
    }

    itemsEl.innerHTML = cart
      .map(
        (i, idx) => `
        <div class="cart-item">
          <div><h4>${esc(i.nome)}</h4><span>${brl(i.preco)}</span></div>
          <div class="cart-qty">
            <button data-act="menos" data-i="${idx}">−</button>
            <span>${i.qtd}</span>
            <button data-act="mais" data-i="${idx}">+</button>
            <button data-act="remover" data-i="${idx}" aria-label="Remover">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>`
      )
      .join("");
  }

  itemsEl.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-act]");
    if (!b) return;
    const i = Number(b.dataset.i);
    const item = cart[i];
    if (!item) return;

    if (b.dataset.act === "mais") item.qtd++;
    else if (b.dataset.act === "menos") item.qtd--;
    else item.qtd = 0;

    if (item.qtd <= 0) cart.splice(i, 1);
    save();
    render();
  });

  fab.addEventListener("click", () => toggleCart(true));
  overlay.addEventListener("click", () => toggleCart(false));
  document
    .querySelector(".cart-close")
    .addEventListener("click", () => toggleCart(false));

  document.querySelector(".cart-checkout").addEventListener("click", () => {
    if (!cart.length) {
      alert("Seu carrinho está vazio.");
      return;
    }
    alert("Pedido realizado com sucesso! Total: " + totalEl.textContent);
    cart = [];
    save();
    render();
    toggleCart(false);
  });

  // BOTÕES "COMPRAR"
  document.querySelectorAll(".card button").forEach((button) => {
    const textoOriginal = button.innerHTML;
    let timer;

    button.addEventListener("click", () => {
      const card = button.closest(".card");
      const nome = card.querySelector("h3").textContent.trim();
      const preco = parseFloat(
        card
          .querySelector(".price")
          .textContent.replace(/[^\d,]/g, "")
          .replace(",", ".")
      );

      const existente = cart.find((i) => i.nome === nome);
      if (existente) existente.qtd++;
      else cart.push({ nome, preco, qtd: 1 });

      save();
      render();

      clearTimeout(timer);
      button.innerHTML = "✔ Produto Adicionado";
      button.style.background = "#00cc66";
      timer = setTimeout(() => {
        button.innerHTML = textoOriginal;
        button.style.background = "";
      }, 2000);
    });
  });

  render();
});
