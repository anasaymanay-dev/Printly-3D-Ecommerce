import getData from "./getData.js";

let products;

getData().then((data) => {
  products = data;
});
