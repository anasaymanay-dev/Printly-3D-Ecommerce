const params = new URLSearchParams(location.search);

const id = params.get("id");

const productDetails = document.getElementById("product-details");

let currentImage = 1;

async function getData() {
  productDetails.innerHTML = "<span>Loading Product...</span>";
  try {
    let response = await fetch("/data.json");

    if (!response.ok) {
      throw new Error("HTTP Error " + response.status);
    }

    let data = await response.json();

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

getData()
  .then((data) => {
    showProduct(id, data);
  })
  .catch((error) => {
    alert(error.message);
  });

function showProduct(id, products) {
  const product = products.find((product) => {
    return product.id === Number(id);
  });

  if (!product) {
    productDetails.innerHTML = `<span>product not found with id (${id || "unKnown"})</span>`;
    return;
  }

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
              <div class="quantity">
                <button id="minus-btn" onclick='minus()'>-</button>

                <span id="quantity">1</span>

                <button id="plus-btn" onclick='plus()'>+</button>
              </div>

              <button class="add-cart-btn" id="add-cart-btn">
                <i class="fa-solid fa-cart-shopping"></i>
                Add to Cart
              </button>
            </div>
          </div>
  `;
}

productDetails.addEventListener("click", function (e) {
  if (e.target.classList.contains("bullet")) {
    currentImage = Number(e.target.dataset.id);
    changeImage();
    return;
  }
  if (
    e.target.classList.contains("next") ||
    e.target.closest("button").classList.contains("next")
  ) {
    next();
    return;
  }
  if (
    e.target.classList.contains("prev") ||
    e.target.closest("button").classList.contains("prev")
  ) {
    prev();
  }
});

function minus() {
  let quantityElement = document.getElementById("quantity");
  let count = Number(quantityElement.textContent);
  if (count > 1) {
    count--;
    quantityElement.textContent = count;
  }
}

function plus() {
  let quantityElement = document.getElementById("quantity");
  let count = Number(quantityElement.textContent);
  count++;
  quantityElement.textContent = count;
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