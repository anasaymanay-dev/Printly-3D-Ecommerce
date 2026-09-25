const heartCount = document.getElementById("heart-count");
const wishlistProducts = document.getElementById("wishlist-products");
let wishlistProductsData =
  JSON.parse(localStorage.getItem("wishlistProducts")) || [];

wishlistProducts.addEventListener("click", function (e) {
  console.log(e.target.closest(".wishlist-product"));
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

showWishlistProducts();
