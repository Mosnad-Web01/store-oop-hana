// 'use strict';
const Body = document.querySelector("body");

// Create and append the main element to the body
const main = document.createElement("main");
main.className = "products-container"; // Add a class for styling if needed
Body.appendChild(main);


class App {
  static products = []; // Initialize products as a static property
  static async run() {
    try {
      // Fetch products and categories
      this.products = await APIService.fetchProducts();
      const categories = await APIService.fetchCategories();

      // Create the navbar with categories
      const nav = Navbar.create(categories);
      Body.prepend(nav);
      // Render all products initially
      HomePage.renderProducts(this.products);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
      
    Cart.updateCartIcon();
    
  }
}

class APIService {
  static STORE_BASE_URL = "https://fakestoreapi.com";

  static async fetchProducts() {
    const url = APIService._constructUrl("products");
    const res = await fetch(url);
    const data = await res.json();
    return data.map((product) => new Product(product));
  }

  static async fetchCategories() {
    const url = APIService._constructUrl("products/categories");
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }

  static async fetchProductsByCategory(category) {
    if (!category) {
      return APIService.fetchProducts();
    }
    const url = APIService._constructUrl("products/category/" + category);
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
  static container = document.querySelector("main");

  static products = []; // Initialize products as a static property

  static renderProducts(products, priceRange = { min: Infinity, max: Infinity }, rate = "all") {
    this.products = products;
    this.container.innerHTML = "";
    console.log(priceRange, this.products, rate);

    if (priceRange && !(priceRange.min === Infinity && priceRange.max === Infinity)) {
      products = products.filter((product) => {
        return product.price >= priceRange.min && product.price <= priceRange.max;
      });
    }
    if (rate !== "all" && rate > 0) {
      products = products.filter((product) => {
        return parseInt(product.rating.rate) === rate;
      });
    }

    const productGrid = document.createElement("div");
    productGrid.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";

    products.forEach((product) => {
      const productDiv = document.createElement("div");

      productDiv.innerHTML = `
        <div class="relative border rounded-lg shadow-lg overflow-hidden">
          <img src="${product.image}" class="w-full h-60 object-cover">
          <div class="p-4">
            <h5 class="text-lg font-semibold">${product.title}</h5>
            <p class="text-gray-500">${product.category}</p>
            <p class="text-gray-700 font-bold">${product.price} €</p>
            <button class="absolute bottom-2 right-2 text-white bg-blue-500 hover:bg-blue-600 p-1 rounded-full">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18l-2 10H5L3 3z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 17a4 4 0 11-8 0"></path>
              </svg>
              <i class="bi bi-cart"></i>
            </button>
          </div>
        </div>
      `;

      productDiv.querySelector("button").addEventListener("click", (e) => {
        e.stopPropagation();
        Cart.addProduct(product);
        Navbar.updateCartIcon();
      });

      productDiv.addEventListener("click", () => {
        Products.run(product);
      });

      productDiv.classList.add(
        "cursor-pointer",
        "hover:scale-105",
        "transform",
        "transition-transform",
        "duration-200"
      );
      productGrid.appendChild(productDiv);
    });

    this.container.appendChild(productGrid);
  }
}

class Products {
  static async run(product) {
    const productDetails = await APIService.fetchProduct(product.id);
    ProductPage.renderProduct(productDetails);
  }
}

class ProductPage {
  static container = document.querySelector("main");

static renderProduct(product) {
    ProductPage.container.innerHTML = `
      <div>
        <img src="${product.image}" alt="${product.title} poster">
        <h1>${product.title}</h1>
        <p>${product.price} €</p>
        <p>${product.category}</p>
        <p>${product.rating.rate} stars</p>
      </div>
    `;
  }
}

class Product {
  constructor(json) {
    this.id = json.id;
    this.title = json.title;
    this.image = json.image;
    this.price = json.price;
    this.rating = json.rating;
    this.category = json.category;
  }
}

class Navbar {
  static create(categories) {
    const nav = document.createElement("nav");
    nav.className = "flex items-center justify-between px-6 py-4 bg-white shadow-md z-10";

    nav.innerHTML = ` 
      <div class="text-xl font-bold">chanta</div>
      <div class="flex space-x-6">
        <a href="#" class="text-gray-600 hover:text-gray-900">Home</a>
        <div class="relative group">
          
        <button  id="categories-button" class="text-gray-600 hover:text-gray-900">Categories</button>
          <div class="categories-dropdown absolute left-0 mt-2 w-48 bg-white border rounded shadow-lg hidden group-hover:block">
          <div  id="catogry-dropdown" class=" categories-dropdown absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
          <div class="py-1" role="menuitem">
              <a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="category-item-all" data-category="all">All</a>

            ${categories
            .map(
            (category, index) => 
              `<a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700"  role="menuitem" tabindex="-1" id="category-item-${category}" data-category="${category}">${category}</a>`
            
              )
              .join("")}
          </div>
          </div>
        </div>
        <a href="#" class="text-gray-600 hover:text-gray-900">About</a>
      </div>
      <div class="flex items-center space-x-6">
    <!-- Filter by Rate -->
    <div class="relative">
        <button id="rate-button" class="text-gray-600 hover:text-gray-900">Filter by Rate</button>
        <div id="rate-dropdown" class="rate-dropdown hidden absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div class="py-1" role="menuitem">
                <a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700" role="menuitem" data-rate="5">5 Stars</a>
                <a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700" role="menuitem" data-rate="4">4 Stars & Up</a>
                <a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700" role="menuitem" data-rate="3">3 Stars & Up</a>
            </div>
        </div>
    </div>

    <!-- Filter by Price -->
    <div class="relative">
        <button id="price-button" class="text-gray-600 hover:text-gray-900">Filter by Price</button>
        <div id="price-dropdown" class="price-dropdown hidden absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div class="py-1" role="menuitem">
                <a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700" data-price="0-50">€0 - €50</a>
                <a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700" data-price="50-100">€50 - €100</a>
                <a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700" data-price="100-200">€100 - €200</a>
                <a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700" data-price="200+">€200 & Above</a>
            </div>
        </div>
    </div>

    <!-- Search and Cart -->
    <div class="flex">
        <input type="text" placeholder="Search" class="px-4 py-2 border rounded-l-md focus:outline-none">
        <button class="bg-gray-600 text-white px-4 py-2 rounded-r-md hover:bg-gray-700 focus:outline-none">Search</button>
    </div>
    <a href="#" class="text-gray-600 hover:text-gray-900 relative">
        <div class= "cart-div relative">
        <svg class="cart-svg w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18l-2 10H5L3 3z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 17a4 4 0 11-8 0"></path>
        </svg>
        <span class="cart-icon-count absolute top-5 right-2 text-xs bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center">0</span>
        </div>
    </a>
</div>
`
    ;
    this._addListeners(nav);
    return nav;
  }

  static _addListeners(nav) {
    // Add listeners for Category dropdown
    const dropdownItems = nav.querySelectorAll(".categories-dropdown .dropdown-item");

    dropdownItems.forEach((item) => {
      item.addEventListener("click", async (event) => {
        event.preventDefault();
        const category = event.target.getAttribute("data-category");
        console.log(category);
        let products;
    
        if (category === 'all') {
          products = await APIService.fetchProducts(); // افترضنا أنك لديك دالة لجلب جميع المنتجات
        } else {
          products = await APIService.fetchProductsByCategory(category);
        }
    
        HomePage.renderProducts(products);
      });
    });

    // Add listeners for Rate filter
    const rateItems = nav.querySelectorAll(".rate-dropdown .dropdown-item");

    rateItems.forEach((item) => {
      item.addEventListener("click", async (event) => {
        event.preventDefault();
        const rate = event.target.getAttribute("data-rate");
        HomePage.renderProducts(HomePage.products, { min: Infinity, max: Infinity }, rate);
      });
    });

    // Add listeners for Price filter
    const priceItems = nav.querySelectorAll(".price-dropdown .dropdown-item");

    priceItems.forEach((item) => {
      item.addEventListener("click", async (event) => {
        event.preventDefault();
        const priceRangeString = event.target.getAttribute("data-price");
        let [min, max] = priceRangeString.split("-").map(Number);
        let priceRange = { min, max };
        if (priceRangeString.includes("+")) {
          min = parseInt(priceRangeString, 10);
          priceRange = { min, max: Infinity }; // Set max to Infinity for "200+"
        }
        HomePage.renderProducts(HomePage.products, priceRange);
      });
    });
    document.addEventListener("DOMContentLoaded", () => {
  // Attach event listener to the cart icon
  const cartIcon = document.querySelector(".cart-svg"); // Assuming your cart icon has this class

  if (cartIcon) {
    cartIcon.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent default behavior if any
      console.log("Cart icon clicked");
      Cart.renderCart(); // Render the cart when the cart icon is clicked
    });
  } else {
    console.error("Cart icon not found");
  }
});

  }
}

class Cart {
  quantity ;  
  static items = Cart.loadItems(); // Load items from localStorage

  static addProduct(product) {
    const existingProduct = Cart.items.find(item => item.product.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      Cart.items.push({ product, quantity: 1 });
    }
    this.saveItems(); // Save items to localStorage
    this.updateCartIcon();
  }

  static removeProduct(productId) {
    Cart.items = Cart.items.filter(item => item.product.id !== productId);
    this.saveItems(); // Save updates to localStorage
    this.updateCartIcon();
  }

  static saveItems() {
    localStorage.setItem('cartItems', JSON.stringify(Cart.items));
  }

  static loadItems() {
    const storedItems = localStorage.getItem('cartItems');
    return storedItems ? JSON.parse(storedItems) : [];
  }

  static updateCartIcon() {
    const cartIconCount = document.querySelector(".cart-icon-count");
    const totalItems = Cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cartIconCount.textContent = totalItems;
  }
   
  static renderCart() {
    const cartContainer = document.querySelector("main");
    cartContainer.innerHTML = "";

    Cart.items.forEach(item => {
      const cartItemDiv = document.createElement("div");
      cartItemDiv.className = "cart-item flex justify-between items-center";

      cartItemDiv.innerHTML = `
        <div class="flex items-center space-x-4">
          <img src="${item.product.image}" class="w-16 h-16 object-cover" alt="${item.product.title}">
          <div>
            <h5 class="text-lg font-semibold">${item.product.title}</h5>
            <p class="text-gray-700">${item.product.price} €</p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-gray-700">x${item.quantity}</span>
          <button class="remove-btn bg-red-500 text-white px-2 py-1 rounded">Remove</button>
        </div>
      `;

      cartItemDiv.querySelector(".remove-btn").addEventListener("click", () => {
        Cart.removeProduct(item.product.id);
        Cart.renderCart();
      });

      cartContainer.appendChild(cartItemDiv);
    });
  }
    
}

    // Setup dropdowns

document.addEventListener("DOMContentLoaded", App.run);
