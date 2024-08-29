'use strict';

class App {
  static async run() {
    const products = await APIService.fetchProducts();
    HomePage.renderProducts(products);
  }
}

class APIService {
  static STORE_BASE_URL = 'https://fakestoreapi.com';
  static async fetchProducts() {
    const url = APIService._constructUrl('products');
    const res = await fetch(url);
    const data = await res.json();
    return data.map((product) => new Product(product));
  }
  static async fetchProduct(productId) {
    const url = APIService._constructUrl(`products/${productId}`);
    const res = await fetch(url);
    const data = await res.json();
    return new Product(data);
  }
  static _constructUrl(path) {
    return `${APIService.STORE_BASE_URL}/${path}`;
  }
}

class HomePage {
  static container = document.querySelector('body');
  static renderProducts(products) {
    products.forEach((product) => {
      const productDiv = document.createElement('div');
      productDiv.innerHTML = `
          <img src="${product.image}" alt="${product.title} poster">
          <h3>${product.title}</h3>`;
      productDiv.addEventListener('click', () => {
        Products.run(product);
      });
      this.container.appendChild(productDiv);
    });
  }
}

class Products {
  static async run(product) {
    const productDetails = await APIService.fetchProduct(product.id);
    ProductPage.renderProduct(productDetails);
  }
}

class ProductPage {
  static container = document.querySelector('body');
  static renderProduct(product) {
    ProductPage.container.innerHTML = `
      <div>
        ${product.title}
      </div>`;
  }
}

class Product {
  constructor(json) {
    this.id = json.id;
    this.title = json.title;
    this.image = json.image;
  }
}

document.addEventListener('DOMContentLoaded', App.run);
