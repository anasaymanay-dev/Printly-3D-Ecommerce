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

cartProducts.addEventListener("click", function (e) {
  const cartProduct = e.target.closest(".cart-product");

  if (!cartProduct) return;

  const id = Number(cartProduct.dataset.id);

  if (e.target.closest(".plus")) {
    incProduct(id);
    return;
  }

  if (e.target.closest(".minus")) {
    decProduct(id);
    return;
  }

  if (e.target.closest(".remove-cart")) {
    delProduct(id);
  }
});

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
