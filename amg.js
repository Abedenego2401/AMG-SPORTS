// MENU MOBILE

const menuBtn = document.querySelector(".menu-mobile");
const nav = document.querySelector("nav");

menuBtn.addEventListener("click", () => {

  nav.classList.toggle("active");

});

// SCROLL SUAVE

const links = document.querySelectorAll("nav a");

links.forEach((link) => {

  link.addEventListener("click", (e) => {

    e.preventDefault();

    const id = link.getAttribute("href");

    const section = document.querySelector(id);

    section.scrollIntoView({
      behavior:"smooth"
    });

  });

});

// BOTÃO HERO

const btnPrimary = document.querySelector(".btn-primary");

btnPrimary.addEventListener("click", () => {

  document.querySelector("#produtos").scrollIntoView({
    behavior:"smooth"
  });

});

// BOTÕES DE COMPRA

const buyButtons = document.querySelectorAll(".card button");

buyButtons.forEach((button) => {

  button.addEventListener("click", () => {

    button.innerHTML = "✔️ Produto Adicionado";

    button.style.background = "#00cc66";

    setTimeout(() => {

      button.innerHTML = "Comprar";
      button.style.background = "#0066ff";

    }, 2000);

  });

});

// BENEFÍCIOS INTERATIVOS

const benefitBoxes = document.querySelectorAll(".benefit-box");

benefitBoxes.forEach((box) => {

  box.addEventListener("click", () => {

    const title = box.querySelector("h3").innerText;

    if(title === "Entrega Rápida"){

      alert("🚚 Entrega em até 7 dias para todo o Brasil!");

    }

    else if(title === "Garantia"){

      alert("🛡️ Garantia oficial AMG Sports!");

    }

    else{

      alert("⭐ Qualidade premium para atletas profissionais!");

    }

  });

});

// FORMULÁRIO

const form = document.querySelector(".contact-form");

form.addEventListener("submit", (e) => {

  e.preventDefault();

  alert("Mensagem enviada com sucesso!");

  form.reset();

});

// HEADER EFEITO

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

  if(window.scrollY > 50){

    header.style.background = "#050505";
    header.style.boxShadow = "0 0 15px rgba(0,0,0,0.5)";

  }

  else{

    header.style.background = "#000";
    header.style.boxShadow = "none";

  }

});
