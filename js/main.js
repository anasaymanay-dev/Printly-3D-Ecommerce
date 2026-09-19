const productsGrid = document.getElementById("products-grid");

// handle get and show data
async function getData() {
  const response = await fetch("/data.json");

  if (!response.ok) {
    throw new Error("Http Error " + response.status);
  }

  return await response.json();
}

getData()
  .then((data) => {
    showProducts(data);
  })
  .catch((error) => {
    productsGrid.innerHTML = error.message;
  });

function showProducts(data) {
  console.log(data[0]);
  console.log(data[0]["image-1"]);
  let html = "";

  for (let i = 0; i < 5 && i < data.length; i++) {
    html += `
      <article class="product-card" onclick='goToProduct(${data[i].id})'>
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
