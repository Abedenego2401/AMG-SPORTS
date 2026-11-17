// Gerenciamento do Carrinho de Compras na Página Inicial

document.addEventListener("DOMContentLoaded", () => {
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

  // Ação dos botões "Comprar" nos cards de produtos (AGORA APENAS ADICIONA E AVISA)
  document.querySelectorAll(".add-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      const nome = card.dataset.name;
      const preco = parseFloat(card.dataset.price);

      // Verifica se o produto já está no carrinho
      const itemExistente = cart.find((i) => i.nome === nome);
      if (itemExistente) {
        itemExistente.qtd += 1;
      } else {
        cart.push({ nome, preco, qtd: 1 });
      }

      // Salva no navegador e atualiza o contador sem sair da página
      localStorage.setItem("amg-cart", JSON.stringify(cart));
      atualizarContador();

      // Feedback visual simples para o usuário saber que adicionou
      const textoOriginal = btn.textContent;
      btn.textContent = "Adicionado! ✓";
      btn.style.background = "#00cc66";
      setTimeout(() => {
        btn.textContent = textoOriginal;
        btn.style.background = "";
      }, 1500);
    });
  });

  // Ação ao clicar no botão do carrinho no topo (SÓ VAI PRO PAGAMENTO AQUI)
  const btnCarrinho = document.getElementById("btn-carrinho");
  if (btnCarrinho) {
    btnCarrinho.addEventListener("click", () => {
      window.location.href = "pagamento.html";
    });
  }
});
