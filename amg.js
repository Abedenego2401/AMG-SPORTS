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

    nav.classList.remove("active");

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

    button.innerHTML = "✔ Produto Adicionado";

    button.style.background = "#00cc66";

    setTimeout(() => {

      button.innerHTML = "Comprar";

      button.style.background = "#0066ff";

    }, 2000);

  });

});

// HEADER EFEITO

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

  if(window.scrollY > 50){

    header.style.boxShadow =
    "0 0 15px rgba(0,0,0,0.5)";

  }

  else{

    header.style.boxShadow = "none";

  }

});
