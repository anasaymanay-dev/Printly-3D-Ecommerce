import getData from "./getData.js";

const searchInput = document.querySelector(".search-input input");
const searchBtn = document.querySelector(".search-input button");
const searchResult = document.querySelector(".search-result");
let products;

getData()
  .then((data) => {
    products = data;
  })
  .catch((error) => {
    searchResult.innerHTML = `
      <div class="products-empty" id="products-empty">
        <i class="fa-solid fa-box-open"></i>
        <h3>${error.message}</h3>
      </div>
  `;
  });

searchResult.addEventListener("click", function (e) {
  let product = e.target.closest(".search-product");

  const id = product.dataset.id;

  location.href = `product.html?id=${id}`;
});

searchInput.addEventListener("keyup", function (e) {
  if (e.target.value.trim()) {
    search();
  }
});

searchBtn.addEventListener("click", function () {
  search();
  searchInput.value = "";
});

function search() {
  searchResult.innerHTML = "";
  let html = "";
  searchResult.innerHTML = `
    <div class="loading">
      <i class="fa-solid fa-spinner"></i>
      <span>Loading Product...</span>
    </div>
  `;

  if (!products) {
    searchResult.innerHTML = `
      <div class="products-empty">
        <i class="fa-solid fa-box-open"></i>
        <h3>Not Found Products To Search</h3>
      </div>
  `;
    return;
  }

  let searchValue = searchInput.value.trim().toLowerCase();

  if (!searchValue) {
    searchResult.innerHTML = `
      <div class="products-empty">
        <i class="fa-solid fa-box-open"></i>
        <h3>Write Product Name</h3>
      </div>
  `;

    return;
  }

  for (let i = 0; i < products.length; i++) {
    if (products[i].name.toLowerCase().includes(searchValue)) {
      html += `
      <article class="search-product" data-id="${products[i].id}">
        <div class="search-product-image">
          <img
            src="${products[i]["image-1"]}"
            alt="${products[i].name}"
          />
        </div>

        <div class="search-product-info">
          <h3>${products[i].name}</h3>

          <div class="product-price">
            <span class="old-price">LE ${products[i].oldPrice}</span>
            <span class="new-price">LE ${products[i].price}</span>
          </div>

          <button class="add-to-cart">
            <i class="fa-solid fa-cart-shopping"></i>
            Add to cart
          </button>
        </div>
    </article>;
      `;
    }
  }

  if (html === "") {
    searchResult.innerHTML = `
      <div class="products-empty">
        <i class="fa-solid fa-box-open"></i>
        <h3>Not Product Found With Name</h3>
      </div>
  `;
  } else {
    searchResult.innerHTML = html;
  }
}
