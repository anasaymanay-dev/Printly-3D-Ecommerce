const productsGrid = document.getElementById("products-grid");
const cartProducts = document.getElementById("cart-products");
const cartCount = document.getElementById("cart-count");
const cartSubtotal = document.querySelector(".cart-subtotal strong");
const cartShipping = document.querySelector(".cart-shipping strong");
const cartTotal = document.querySelector(".cart-total strong");
let subTotal = 0;
let shippingPrice = 0;
let products;
let cartProductsData = JSON.parse(localStorage.getItem("cardProducts")) || [];
cartShipping.innerHTML = "LE " + shippingPrice.toFixed(2);

productsGrid.addEventListener("click", function (e) {
  const productCard = e.target.closest(".product-card");

  if (!productCard) return;

  if (e.target.closest(".add-cart-btn")) {
    addToCart(productCard.dataset.id);
    return;
  }

  goToProduct(productCard.dataset.id);
});

cartProducts.addEventListener("click", function (e) {
  const cartProduct = e.target.closest(".cart-product");

  if (!cartProduct) return;

  const id = Number(cartProduct.dataset.id);

  if (e.target.closest(".plus")) {
    console.log("plus", id);
    return;
  }

  if (e.target.closest(".minus")) {
    console.log("minus", id);
    return;
  }

  if (e.target.closest(".remove-cart")) {
    console.log("remove", id);
  }
});

// handle get and show data
async function getData() {
  const response = await fetch("./data.json");

  if (!response.ok) {
    throw new Error("Http Error " + response.status);
  }

  return await response.json();
}

getData()
  .then((data) => {
    products = data;
    showProducts(data);
  })
  .catch((error) => {
    productsGrid.innerHTML = error.message;
  });

function showProducts(data) {
  let html = "";

  for (let i = 0; i < 5 && i < data.length; i++) {
    html += `
      <article class="product-card" data-id="${data[i].id}">
        <div class="product-image">
          <img src="${data[i]["image-1"]}" alt="${data[i].name}" />

          <button class="wishlist-btn">
            <i class="fa-regular fa-heart"></i>
          </button>
        </div>

        <div class="product-info">
          <h3>${data[i].name}</h3>

          <p class="product-price">
            EGP ${data[i].price}
          </p>

          <button class="add-cart-btn" data-id="${data[i].id}">
            Add to Cart
          </button>
        </div>
      </article>
    `;
  }

  productsGrid.innerHTML = html;
}

// handle click on product
function goToProduct(id) {
  location.href = `product.html?id=${id}`;
}

// add to cart
function addToCart(id) {
  const product = products.find((product) => {
    return product.id === Number(id);
  });

  if (!product) return;

  const test = cartProductsData.some((p) => {
    return p.id === product.id;
  });

  if (test) return;

  cartProductsData.push(product);

  localStorage.setItem("cardProducts", JSON.stringify(cartProductsData));

  showCardProducts();
}

function showCardProducts() {
  subTotal = 0;
  cartCount.innerHTML = cartProductsData.length;
  let html = "";

  if (cartProductsData.length > 0) {
    shippingPrice = 50;
    cartShipping.innerHTML = "LE " + shippingPrice.toFixed(2);
  }

  for (let i = 0; i < cartProductsData.length; i++) {
    html += `
        <div class="cart-product" data-id="${cartProductsData[i].id}">
          <div class="cart-product-image">
            <img
              src="${cartProductsData[i]["image-1"]}"
              alt="${cartProductsData[i].name}"
            />
          </div>

          <div class="cart-product-info">
            <h3>${cartProductsData[i].name}</h3>

            <p><del>${cartProductsData[i].oldPrice}</del>${cartProductsData[i].price}</p>

            <div class="cart-product-actions">
              <button class="quantity-btn minus">−</button>

              <span class="quantity">1</span>

              <button class="plus quantity-btn">+</button>
            </div>
          </div>

          <button class="remove-cart">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
    `;

    subTotal += Number(cartProductsData[i].price);
  }
  cartProducts.innerHTML = html;
  calcProductPrice();
}

function calcProductPrice() {
  cartSubtotal.innerHTML = "LE " + subTotal.toFixed(2);
  cartTotal.innerHTML = "LE " + (subTotal + shippingPrice).toFixed(2);
}

showCardProducts();
