import getData from "./getData.js";
const params = new URLSearchParams(location.search);
const heartCount = document.getElementById("heart-count");
const wishlistProducts = document.getElementById("wishlist-products");
const id = params.get("id");
let products;
const productDetails = document.getElementById("product-details");
let wishlistProductsData =
  JSON.parse(localStorage.getItem("wishlistProducts")) || [];
let cartProductsData = JSON.parse(localStorage.getItem("cartProducts")) || [];
let currentImage = 1;

productDetails.innerHTML = `
<div class="loading">
    <i class="fa-solid fa-spinner"></i>
    <span>Loading Product...</span>
</div>
`;

getData()
  .then((data) => {
    products = data;
    showProduct(id);
    document.getElementById("prev").addEventListener("click", prev);
    document.getElementById("next").addEventListener("click", next);
    document
      .getElementById("wishlist-btn")
      .addEventListener("click", function () {
        console.log(true);
      });
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
    return product.id === Number(id);
  });

  if (!product) {
    productDetails.innerHTML = `
    <div class="products-empty">
          <i class="fa-solid fa-box-open"></i>
          <h3>No Product Found With Id (${id})</h3>
      </div>`;
    return;
  }

  const inCart = cartProductsData.some((product) => {
    return product.id === Number(id);
  });

  const inWishlist = wishlistProductsData.some((product) => {
    return product.id === Number(id);
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
