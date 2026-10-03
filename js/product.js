import getData from "./getData.js";

const params = new URLSearchParams(location.search);

const heartCount = document.getElementById("heart-count");
const wishlistProducts = document.getElementById("wishlist-products");

const cartProducts = document.getElementById("cart-products");
const cartCount = document.getElementById("cart-count");
const cartSubtotal = document.querySelector(".cart-subtotal strong");
const cartShipping = document.querySelector(".cart-shipping strong");
const cartTotal = document.querySelector(".cart-total strong");
let subTotal = 0;

const ProductId = params.get("id");

let products;
const productDetails = document.getElementById("product-details");
let wishlistProductsData =
  JSON.parse(localStorage.getItem("wishlistProducts")) || [];
let cartProductsData = JSON.parse(localStorage.getItem("cartProducts")) || [];
let productFounded = false;
let currentImage = 1;

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

productDetails.innerHTML = `
<div class="loading">
    <i class="fa-solid fa-spinner"></i>
    <span>Loading Product...</span>
</div>
`;

getData()
  .then((data) => {
    products = data;
    showProduct();
    if (productFounded) {
      document.getElementById("prev").addEventListener("click", prev);
      document.getElementById("next").addEventListener("click", next);
      document
        .querySelector(".product-actions")
        .addEventListener("click", function (e) {
          if (e.target.classList.contains("add-cart-btn")) {
            addToCart();
          } else if (
            e.target.classList.contains("wishlist-btn") ||
            e.target.classList.contains("fa-heart")
          ) {
            addToWishList();
          }
        });
    }
  })
  .catch((error) => {
    productDetails.innerHTML = `
    <div class="products-empty">
        <i class="fa-solid fa-box-open"></i>
        <h3>${error.message}</h3>
    </div>
  `;
  });

function showProduct() {
  const product = products.find((product) => {
    return product.id === Number(ProductId);
  });

  if (!product) {
    productDetails.innerHTML = `
    <div class="products-empty">
          <i class="fa-solid fa-box-open"></i>
          <h3>No Product Found With Id (${ProductId})</h3>
      </div>`;

    productFounded = false;
    return;
  }

  const inCart = cartProductsData.some((product) => {
    return product.id === Number(ProductId);
  });

  const inWishlist = wishlistProductsData.some((product) => {
    return product.id === Number(ProductId);
  });

  productDetails.innerHTML = `
  <!-- Product Gallery -->
          <div class="product-gallery">
            <div class="slider">
              <button class="slider-btn prev disabled" id="prev">
                <i class="fa-solid fa-chevron-left"></i>
              </button>

              <div class="slider-images">
                ${generateImages(product)}
              </div>

              <button class="slider-btn next" id="next">
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            <div class="slider-bullets" id="slider-bullets">
              ${generateBullets(product)}
            </div>
          </div>

          <!-- Product Info -->
          <div class="product-details-info">
            <span class="product-category" id="product-category">
              ${product.category}
            </span>

            <h1 id="product-name">${product.name}</h1>

            <p class="product-price" id="product-price"><del>EGP ${product.oldPrice}</del>EGP ${product.price}</p>

            <div class="product-description">
              <h3>About this product</h3>

              <p id="product-description">
                ${product.description}
              </p>
            </div>

            <div class="product-meta">
              <div>
                <i class="fa-solid fa-cube"></i>
                <span>3D Printed</span>
              </div>

              <div>
                <i class="fa-solid fa-palette"></i>
                <span>Customizable</span>
              </div>

              <div>
                <i class="fa-solid fa-truck"></i>
                <span>Fast Delivery</span>
              </div>
            </div>

            <div class="product-actions">
              <button class="add-cart-btn ${inCart ? "disabled" : ""}" id="add-cart-btn">
                <i class="fa-solid fa-cart-shopping"></i>
                Add to Cart
              </button>

              <button
                class="wishlist-btn ${inWishlist ? "active" : ""}"
                id="wishlist-btn">
                <i class="fa-solid fa-heart"></i>
              </button>
            </div>
            </div>
          </div>
  `;

  productFounded = true;
}
function prev() {
  if (currentImage > 1) {
    currentImage--;
    changeImage();
  }
}

function next() {
  let allImages = document.querySelectorAll(".slider-images img");
  if (currentImage !== allImages.length) {
    currentImage++;
    changeImage();
  }
}

function changeImage() {
  let nextBtn = document.getElementById("next");
  let prevtBtn = document.getElementById("prev");
  let allImages = document.querySelectorAll(".slider-images img");
  let sliderBullets = document.querySelectorAll(".slider-bullets button");

  allImages.forEach((img) => {
    img.classList.remove("active");
  });

  allImages[currentImage - 1].classList.add("active");

  sliderBullets.forEach((bullet) => {
    bullet.classList.remove("active");
  });

  sliderBullets[currentImage - 1].classList.add("active");

  if (currentImage === 1) {
    prevtBtn.classList.add("disabled");
  } else {
    prevtBtn.classList.remove("disabled");
  }

  if (currentImage === allImages.length) {
    nextBtn.classList.add("disabled");
  } else {
    nextBtn.classList.remove("disabled");
  }
}

function generateImages(product) {
  let html = "";
  for (let i = 0; i < product.imagesLength; i++) {
    html += `
    <img
    class="product-image ${i == 0 ? "active" : ""}"
    src="${product["image" + "-" + (i + 1)]}"
    alt="${product.name}"
    />
    `;
  }
  return html;
}

function generateBullets(product) {
  let html = "";
  for (let i = 0; i < product.imagesLength; i++) {
    html += `
      <button class='${i == 0 ? "bullet active" : "bullet"}' data-id='${i + 1}'></button>
    `;
  }
  return html;
}

function addToCart() {
  const inCart = cartProductsData.some((p) => {
    return p.id === Number(ProductId);
  });

  if (inCart) return;

  const product = products.find((p) => {
    return p.id === Number(ProductId);
  });

  cartProductsData.push(product);

  localStorage.setItem("cartProducts", JSON.stringify(cartProductsData));

  document.getElementById("add-cart-btn").classList.add("disabled");

  showcartProducts();
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

function calcProductPrice() {
  const shippingPrice = cartProductsData.length > 0 ? 50 : 0;
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

  if (id === Number(ProductId)) {
    document.getElementById("add-cart-btn").classList.remove("disabled");
  }
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

function addToWishList() {
  const inWishList = wishlistProductsData.some((p) => {
    return p.id === Number(ProductId);
  });

  if (inWishList) return;

  const product = products.find((p) => {
    return p.id === Number(ProductId);
  });

  wishlistProductsData.push(product);

  localStorage.setItem("wishlistProducts", JSON.stringify(cartProductsData));

  document.getElementById("wishlist-btn").classList.add("active");

  showWishlistProducts();
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

  if (id === Number(ProductId)) {
    document.getElementById("wishlist-btn").classList.remove("active");
  }
}

showWishlistProducts();
showcartProducts();
