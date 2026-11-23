// ===== AMG Sports =====
// Carrinho na página inicial + menu mobile + formulário de contato

const EMAIL_CONTATO = "00001132654750sp@al.educacao.sp.gov.br";

document.addEventListener("DOMContentLoaded", () => {
  // ---------- Carrinho ----------
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("amg-cart")) || [];
  } catch (e) {
    cart = [];
  }

  // Atualiza o contador no header
  const atualizarContador = () => {
    const totalItens = cart.reduce((acc, item) => acc + item.qtd, 0);
    const contadorEl = document.getElementById("cart-count");
    if (contadorEl) contadorEl.textContent = totalItens;
  };

  atualizarContador();

  // Botões "Comprar": só adicionam ao carrinho e avisam
  document.querySelectorAll(".add-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      const nome = card.dataset.name;
      const preco = parseFloat(card.dataset.price);

      const itemExistente = cart.find((i) => i.nome === nome);
      if (itemExistente) {
        itemExistente.qtd += 1;
      } else {
        cart.push({ nome, preco, qtd: 1 });
      }

      try { localStorage.setItem("amg-cart", JSON.stringify(cart)); } catch (err) {}
      atualizarContador();

      // Feedback visual
      const textoOriginal = btn.textContent;
      btn.textContent = "Adicionado! ✓";
      btn.style.background = "#00cc66";
      setTimeout(() => {
        btn.textContent = textoOriginal;
        btn.style.background = "";
      }, 1500);
    });
  });

  // Botão do carrinho no topo: vai para o pagamento
  const btnCarrinho = document.getElementById("btn-carrinho");
  if (btnCarrinho) {
    btnCarrinho.addEventListener("click", () => {
      window.location.href = "pagamento.html";
    });
  }

  // ---------- Menu mobile ----------
  const menuBtn = document.getElementById("menu-mobile");
  const menu = document.getElementById("menu");
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", () => menu.classList.toggle("active"));
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => menu.classList.remove("active"))
    );
  }

  // ---------- Formulário de contato (envia para o e-mail) ----------
  const form = document.getElementById("form-contato");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = document.getElementById("form-status");
      const btn = document.getElementById("btn-enviar");
      const nome = document.getElementById("c-nome").value.trim();
      const email = document.getElementById("c-email").value.trim();
      const mensagem = document.getElementById("c-mensagem").value.trim();

      status.className = "";
      if (!nome || !email || !mensagem) {
        status.textContent = "Preencha nome, e-mail e comentário.";
        status.className = "erro";
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        status.textContent = "Digite um e-mail válido.";
        status.className = "erro";
        return;
      }

      btn.disabled = true;
      btn.textContent = "Enviando...";

      try {
        const resp = await fetch(`https://formsubmit.co/ajax/${EMAIL_CONTATO}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            _subject: "Novo comentário - site AMG Sports",
            _template: "table",
            _replyto: email,
            nome,
            email,
            mensagem,
          }),
        });
        if (!resp.ok) throw new Error("falha no envio");
        status.textContent = "Mensagem enviada! Obrigado pelo contato.";
        status.className = "ok";
        form.reset();
      } catch (err) {
        status.textContent = "Não foi possível enviar agora. Tente novamente em instantes.";
        status.className = "erro";
      } finally {
        btn.disabled = false;
        btn.textContent = "Enviar mensagem";
      }
    });
  }
});
