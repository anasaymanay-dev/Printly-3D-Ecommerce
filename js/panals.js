// Dom Elements
const searchBtn = document.getElementById("search-btn");
const searchBox = document.getElementById("search-box");
const closeSearch = document.getElementById("close-search");

const heartBtn = document.getElementById("heart-btn");
const loveBox = document.getElementById("love-box");
const closeLove = document.getElementById("close-love");

const cartBtn = document.getElementById("cart-btn");
const cartBox = document.getElementById("cart-box");
const closeCart = document.getElementById("close-cart");

const burgerBtn = document.getElementById("burger-btn");
const closeNav = document.getElementById("close-nav");
const mainNav = document.getElementById("main-nav");
const menuOverlay = document.getElementById("menu-overlay");

// handle search box
searchBtn.onclick = function () {
  closePanels();
  searchBox.classList.add("active");
  menuOverlay.classList.add("active");
};

closeSearch.onclick = function () {
  closePanels();
};

// handle heart box
heartBtn.onclick = function () {
  closePanels();
  loveBox.classList.add("active");
  menuOverlay.classList.add("active");
};

closeLove.onclick = function () {
  closePanels();
};

// handle cart box
cartBtn.onclick = function () {
  closePanels();
  cartBox.classList.add("active");
  menuOverlay.classList.add("active");
};

closeCart.onclick = function () {
  closePanels();
};

// handle navBar

burgerBtn.onclick = function () {
  closePanels();
  mainNav.classList.add("active");
  menuOverlay.classList.add("active");
};

closeNav.onclick = function () {
  closePanels();
};

function closePanels() {
  searchBox.classList.remove("active");
  loveBox.classList.remove("active");
  cartBox.classList.remove("active");
  mainNav.classList.remove("active");
  menuOverlay.classList.remove("active");
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("menu-overlay")) {
    closePanels();
  }
});
