import getData from "./getData.js";
const productsGrid = document.getElementById("products-grid");
const cartProducts = document.getElementById("cart-products");
const cartCount = document.getElementById("cart-count");
const cartSubtotal = document.querySelector(".cart-subtotal strong");
const cartShipping = document.querySelector(".cart-shipping strong");
const cartTotal = document.querySelector(".cart-total strong");
const heartCount = document.getElementById("heart-count");
const wishlistProducts = document.getElementById("wishlist-products");
let subTotal;
let shippingPrice;
let products;
let cartProductsData = JSON.parse(localStorage.getItem("cartProducts")) || [];
let wishlistProductsData =
  JSON.parse(localStorage.getItem("wishlistProducts")) || [];

// handle get and show data

productsGrid.innerHTML = `
<div class="loading">
  <i class="fa-solid fa-spinner"></i>
  <span>Loading Product...</span>
</div>
`;

getData()
  .then((data) => {
    products = data;
    showProducts(data);
  })
  .catch((error) => {
    productsGrid.innerHTML = `
    <div class="products-empty">
        <i class="fa-solid fa-box-open"></i>
        <h3>${error.message}</h3>
    </div>
    `;
  });

productsGrid.addEventListener("click", function (e) {
  const productcart = e.target.closest(".product-cart");

  if (!productcart) return;

  if (e.target.closest(".add-cart-btn")) {
    addTocart(productcart.dataset.id);
    return;
  }

  if (e.target.closest(".wishlist-btn")) {
    addToWishlist(productcart.dataset.id);
    return;
  }

  goToProduct(productcart.dataset.id);
});

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

wishlistProducts.addEventListener("click", function (e) {
  const product = e.target.closest(".wishlist-product");
  if (!product) {
    return;
  }

  const id = Number(product.dataset.id);

  if (e.target.closest(".remove-wishlist")) {
    removeProductFromWishlist(id);
    return;
  }

  location.href = `product.html?id=${id}`;
});

function showProducts(data) {
  let html = "";
  let productsLength;

  if (location.pathname.endsWith("/products.html")) {
    productsLength = data.length;
    document.getElementById("products-count").textContent = productsLength;
  } else {
    productsLength = data.length > 5 ? 5 : data.length;
  }

  for (let i = 0; i < productsLength; i++) {
    html += `
      <article class="product-cart" data-id="${data[i].id}">
        <div class="product-image">
          <img src="${data[i]["image-1"]}" alt="${data[i].name}" />

          <button class="wishlist-btn">
            <i class="fa-solid fa-heart"></i>
          </button>
        </div>

        <div class="product-info">
          <h3>${data[i].name}</h3>

          <p class="product-price">
            EGP ${data[i].price}
          </p>

          <button class="add-cart-btn" data-id="${data[i].id}">
            Add to cart
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
function addTocart(id) {
  const product = products.find((product) => {
    return product.id === Number(id);
  });

  if (!product) return;

  const test = cartProductsData.some((p) => {
    return p.id === product.id;
  });

  if (test) return;

  cartProductsData.push(product);

  localStorage.setItem("cartProducts", JSON.stringify(cartProductsData));

  showcartProducts();
}

// add to wishlist
function addToWishlist(id) {
  const product = products.find((product) => {
    return product.id === Number(id);
  });

  if (!product) return;

  const test = wishlistProductsData.some((p) => {
    return p.id === product.id;
  });

  if (test) return;

  wishlistProductsData.push(product);

  localStorage.setItem(
    "wishlistProducts",
    JSON.stringify(wishlistProductsData),
  );

  showWishlistProducts();
}

function showcartProducts() {
  subTotal = 0;
  cartCount.innerHTML = cartProductsData.length;
  let html = "";

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

              <span class="quantity">${cartProductsData[i].quantity}</span>

              <button class="plus quantity-btn">+</button>
            </div>
          </div>

          <button class="remove-cart">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
    `;

    subTotal +=
      Number(cartProductsData[i].price) * cartProductsData[i].quantity;
  }
  cartProducts.innerHTML = html;
  calcProductPrice();
}

function showWishlistProducts() {
  heartCount.innerHTML = wishlistProductsData.length;
  let html = "";

  for (let i = 0; i < wishlistProductsData.length; i++) {
    html += `
        <div class="wishlist-product" data-id="${wishlistProductsData[i].id}">
            <div class="wishlist-image">
              <img
                src="${wishlistProductsData[i]["image-1"]}"
                alt="${wishlistProductsData[i].name}"
              />
            </div>

            <div class="wishlist-info">
              <div>
                <h3>${wishlistProductsData[i].name}</h3>

                <p>LE ${wishlistProductsData[i].price}</p>
              </div>

              <button class="remove-wishlist">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
        </div>
    `;
  }
  wishlistProducts.innerHTML = html;
}

function calcProductPrice() {
  shippingPrice = cartProductsData.length > 0 ? 50 : 0;
  cartShipping.innerHTML = "LE " + shippingPrice.toFixed(2);
  cartSubtotal.innerHTML = "LE " + subTotal.toFixed(2);
  cartTotal.innerHTML = "LE " + (subTotal + shippingPrice).toFixed(2);
}

// delete product from cart
function delProduct(id) {
  const product = cartProductsData.find((p) => {
    return p.id === id;
  });

  if (!product) return;

  const newProducts = cartProductsData.filter((p) => {
    return p.id !== id;
  });

  cartProductsData = newProducts;

  localStorage.setItem("cartProducts", JSON.stringify(cartProductsData));

  showcartProducts();
}

// increment count product in cart
function incProduct(id) {
  const product = cartProductsData.find((p) => {
    return p.id === id;
  });

  if (!product) return;

  const newProducts = cartProductsData.map((p) => {
    return p.id === id ? { ...p, quantity: p.quantity + 1 } : p;
  });

  cartProductsData = newProducts;

  localStorage.setItem("cartProducts", JSON.stringify(cartProductsData));

  showcartProducts();
}

// decrement count product in cart
function decProduct(id) {
  console.log("dec");
  const product = cartProductsData.find((p) => {
    return p.id === id;
  });

  if (!product) return;

  if (product.quantity > 1) {
    const newProducts = cartProductsData.map((p) => {
      return p.id === id ? { ...p, quantity: p.quantity - 1 } : p;
    });
    cartProductsData;
    cartProductsData = newProducts;

    localStorage.setItem("cartProducts", JSON.stringify(cartProductsData));

    showcartProducts();
  }
}

// delete product from wishlist cart
function removeProductFromWishlist(id) {
  const product = wishlistProductsData.find((p) => {
    return p.id === id;
  });

  if (!product) return;

  const newProducts = wishlistProductsData.filter((p) => {
    return p.id !== id;
  });

  wishlistProductsData = newProducts;

  localStorage.setItem(
    "wishlistProducts",
    JSON.stringify(wishlistProductsData),
  );
  showWishlistProducts();
}

showWishlistProducts();
showcartProducts();
