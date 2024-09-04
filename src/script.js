// 'use strict';
const Body = document.querySelector("body");

// Create and append the main element to the body
const main = document.createElement("main");
main.className = "h-0vh products-container"; // Add a class for styling if needed
Body.appendChild(main);

class Login {
  static container = document.querySelector("main");

  constructor(mainContentSelector) {
      this.mainContent = document.querySelector(mainContentSelector);
      this.loginScreen = null;
      this.usernameInput = null;
      this.passwordInput = null;
      this.loginButton = null;
      
     
  }
  static saveUserName(username) {
    localStorage.setItem('username', JSON.stringify(username));
  }
  static loadUserName(username) {
    const storedUser = localStorage.getItem('username');
    return storedUser ? JSON.parse(storedUser) : [];
  }

  static createLoginScreen() {
      const loginScreen = document.createElement("div");
      loginScreen.className='login-screen flex justify-center items-center h-screen';
      loginScreen.innerHTML = `
        <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Login</h2>
        <label class=" block mb-2 text-sm font-medium text-gray-700">User name:</label>
        <input type="text" placeholder= "admi" class="login-username w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">

        <label class="block mb-2 text-sm font-medium text-gray-700">Passwod:</label>
        <input type="password" placeholder="1234" class="login-password w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">

        <button class="login-button w-full py-2 bg-black text-white font-bold rounded-lg hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500">Login</button>
       </div>`;
      this.init(loginScreen);
  }

  static init(loginScreen) {
    main.appendChild(loginScreen);
    loginScreen.querySelector(".login-button").addEventListener('click', () => this.handleLogin());
      console.log("in init");
   }

  static handleLogin() {

    this.usernameInput = document.querySelector('.login-username');
    this.passwordInput = document.querySelector('.login-password');

      const username = this.usernameInput.value;
      const password = this.passwordInput.value;

      // تحقق من صحة البيانات (يمكنك تخصيص هذه الدالة)
      if (username === 'admin' && password === '1234') {
          //this.loginScreen.classList.remove('show-login');
          //this.mainContent.classList.add('show-content');
          this.saveUserName(username);
           App.run();
           //document.addEventListener("DOMContentLoaded", App.run);


      } else {
          alert('خطأ في اسم المستخدم أو كلمة المرور');
      }
  }
  static run(){
    const log = Login.createLoginScreen();
    main.prepend(log);
    Login.init();
    console.log("here")
}
}


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
    //Create Footer
    const footer = Footer.create();
    Body.append(footer);
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
    if (this.products.length == 0)
      this.products = products;
    this.container.innerHTML = "";
    console.log(priceRange, this.products, rate);

    if (priceRange && !(priceRange.min == Infinity && priceRange.max == Infinity)) {
      products = products.filter((product) => {
        return product.price >= priceRange.min && product.price <= priceRange.max;
      });
    }
    if (rate !== "all" && rate > 0) {
      products = products.filter((product) => {
        return parseInt(product.rating.rate) == rate;
      });
    }

    const productGrid = document.createElement("div");
    productGrid.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";

    products.forEach((product) => {
      const productDiv = document.createElement("div");


      productDiv.innerHTML = `
      <div class="relative border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 flex flex-col h-full">
      <div class="w-full h-64 flex items-center justify-center bg-white">
        <img src="${product.image}" class="max-h-full max-w-full object-contain">
      </div>
      <div class="p-4 bg-white flex flex-col justify-between flex-grow">
        <div>
          <h5 class="text-lg font-semibold text-gray-800 mb-2">${product.title}</h5>
          <p class="text-gray-500 text-sm mb-1 capitalize">${product.category}</p>
        </div>
        <div class="mt-auto">
          <p class="text-gray-700 font-bold text-lg mb-2">${product.price} €</p>
          <p class="text-yellow-500 font-semibold mb-4 flex items-center">
            <svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927a.75.75 0 011.902 0l1.425 4.313a.75.75 0 00.712.518h4.518a.75.75 0 01.44 1.362l-3.66 2.725a.75.75 0 00-.268.837l1.425 4.313a.75.75 0 01-1.155.837l-3.66-2.725a.75.75 0 00-.88 0l-3.66 2.725a.75.75 0 01-1.155-.837l1.425-4.313a.75.75 0 00-.268-.837l-3.66-2.725a.75.75 0 01.44-1.362h4.518a.75.75 0 00.712-.518l1.425-4.313z" />
            </svg>
            ${product.rating.rate} / 5
          </p>
        </div>
      </div>
      <button class="absolute bottom-4 right-4 text-white bg-blue-500 hover:bg-blue-600 p-3 rounded-full shadow-md focus:outline-none transition-shadow">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18l-2 10H5L3 3z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 17a4 4 0 11-8 0"></path>
        </svg>
      </button>
    </div>
        `;

      productDiv.querySelector("button").addEventListener("click", (e) => {
        e.stopPropagation();
        Cart.addProduct(product);
        Cart.updateCartIcon();
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
     <div class=" max-w-4xl my-8 mx-auto p-4 flex flex-col md:flex-row items-center md:items-start bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div class="w-full md:w-1/2 p-4 flex justify-center">
        <img src="${product.image}" alt="${product.title} poster" class="max-w-full h-auto object-cover rounded-lg shadow-md">
      </div>
      <div class="w-full md:w-1/2 p-4 text-center md:text-left">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">${product.title}</h1>
        <p class="text-xl font-semibold text-green-500 mb-2">${product.price} €</p>
        <p class="text-md text-gray-600 dark:text-gray-300 mb-4">${product.category}</p>
        <p class="text-yellow-500 text-md">${'★'.repeat(product.rating.rate)} (${product.rating.rate} stars)</p>
      </div>
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
  <div class="text-2xl font-bold text-gray-900">chanta</div>

  <div class="hidden md:flex space-x-6">
    <a href="index.html" class="text-gray-600 hover:text-gray-900 transition duration-300">Home</a>

    <div class="relative group">
      <button id="categories-button" class="text-gray-600 hover:text-gray-900 transition duration-300 flex items-center">
        Categories
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div class="categories-dropdown absolute left-0 mt-2 w-48 bg-white border rounded shadow-lg hidden group-hover:block z-50 transition duration-300">
        <div id="category-dropdown" class="categories-dropdown-content py-1" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
          <a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-300" data-category="all">All</a>
          ${categories
        .map(
          (category) =>
            `<a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-300" data-category="${category}">${category}</a>`
        )
        .join('')}
        </div>
      </div>
    </div>

    <div class="relative group">
      <button id="rate-button" class="text-gray-600 hover:text-gray-900 transition duration-300 flex items-center">
        Filter by Rate
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div class="rate-dropdown absolute left-0 mt-2 w-48 bg-white border rounded shadow-lg hidden group-hover:block z-50 transition duration-300">
        <div class="py-1">
          <a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-rate="5">5 Stars</a>
          <a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-rate="4">4 Stars & Up</a>
          <a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-rate="3">3 Stars & Up</a>
        </div>
      </div>
    </div>

    <div class="relative group">
      <button id="price-button" class="text-gray-600 hover:text-gray-900 transition duration-300 flex items-center">
        Filter by Price
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div class="price-dropdown absolute left-0 mt-2 w-48 bg-white border rounded shadow-lg hidden group-hover:block z-50 transition duration-300">
        <div class="py-1">
          <a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-price="0-50">€0 - €50</a>
          <a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-price="50-100">€50 - €100</a>
          <a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-price="100-200">€100 - €200</a>
          <a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-price="200+">€200 & Above</a>
        </div>
      </div>
    </div>

    <a href="#" class="about-link text-gray-600 hover:text-gray-900 transition duration-300">About</a>
  </div>

  <div class="flex items-center space-x-4">
    <div class="relative group">
      <input id="search" type="text" placeholder="Search" class="search-input px-4 py-2 border rounded-l-md focus:outline-none">
      <button class="search-button bg-gray-600 text-white px-4 py-2 rounded-r-md hover:bg-gray-700 transition duration-300">Search</button>
    </div>

    <a href="#" class="relative cart-link text-gray-600 hover:text-gray-900 transition duration-300">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18l-2 10H5L3 3z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 17a4 4 0 11-8 0"></path>
      </svg>
      <span class="absolute top-0.5 right-2 text-xs bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center cart-icon-count">0</span>
    </a>
  </div>
  <button class="md:hidden text-gray-600 hover:text-gray-900">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
    </svg>
  </button>
`;

    this._addListeners(nav);
    return nav;
  }

  static _addListeners(nav) {
    // Add listeners for Home 
    const homeNav = nav.querySelectorAll(".home-nav");

    homeNav.forEach((navItem) => {
      navItem.addEventListener("click", async (event) => {
        event.preventDefault();
        HomePage.renderProducts(HomePage.products);
      });
    });

    // Add listeners for Category dropdown
    const dropdownItems = nav.querySelectorAll(".categories-dropdown .dropdown-item");

    dropdownItems.forEach((item) => {
      item.addEventListener("click", async (event) => {
        event.preventDefault();
        const category = event.target.getAttribute("data-category");
        console.log(category);
        let products;

        if (category == 'all') {
          products = await APIService.fetchProducts();
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

    // Attach event listener to the search input
    const searchButton = nav.querySelector(".search-button");
    const searchInput = nav.querySelector(".search-input");
    if (searchButton && searchInput) {
      searchButton.addEventListener("click", (event) => {
        event.preventDefault(); //
        const searchString = searchInput.value.trim().toLowerCase(); //to Lower case
        console.log(searchString);
        // Filter products
        const filteredProducts = HomePage.products.filter(product => {
          return (
            product.title.toLowerCase().includes(searchString) ||
            product.category.toLowerCase().includes(searchString) ||
            product.price.toString().includes(searchString) ||
            product.rating.rate.toString().includes(searchString)
          );
        });

        HomePage.renderProducts(filteredProducts);
      });

      searchInput.addEventListener("keypress", (event) => {
        if (event.key == "Enter") {
          searchButton.click();
        }
      });
    } else {
      console.error("Search input or button not found");
    }

    // Attach event listener to the cart icon
    const cartIcon = nav.querySelector(".cart-link"); // Assuming your cart icon has this class
    console.log('Attach event listener', nav, cartIcon);
    if (cartIcon) {
      cartIcon.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default behavior if any
        console.log("Cart icon clicked");
        Cart.renderCart(); // Render the cart when the cart icon is clicked
      });
    } else {
      console.error("Cart icon not found");
    }
    // Assuming the "About" link has a class of "about-link"
    const aboutLink = nav.querySelector(".about-link");
    if (aboutLink) {
      aboutLink.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent the default link behavior

        // Get the footer element
        const footer = document.getElementById("footer");

        if (footer) {
          // Scroll to the footer
          footer.scrollIntoView({ behavior: "smooth" });
        } else {
          console.error("Footer not found");
        }
      });
    } else {
      console.error("About link not found");
    }
  }

}

class Cart {
  quantity;
  static items = Cart.loadItems(); // Load items from localStorage

  static addProduct(product) {
    const existingProduct = Cart.items.find(item => item.product.id == product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      Cart.items.push({ product, quantity: 1 });
    }
    this.saveItems(); 
    this.updateCartIcon();
  }
  static clearCart() {
    Cart.items = []; // Clear the cart array
    Cart.saveItems(); // Save the empty cart to localStorage
    Cart.updateCartIcon(); // Update the cart icon to reflect the empty state
  }
  static removeProduct(productId) {
    Cart.items = Cart.items.filter(item => item.product.id !== productId);
    this.saveItems(); // Save updates to localStorage
    this.updateCartIcon();
  }
  static decreaseQty(productId) {
    let itemIndex = Cart.items.findIndex(item => item.product.id == productId);

    // Check if the item exists
    if (itemIndex !== -1) {
      // Decrease the quantity
      Cart.items[itemIndex].quantity--;

      // If quantity is zero, remove the item from the cart
      if (Cart.items[itemIndex].quantity <= 0) {
        Cart.items.splice(itemIndex, 1); // Remove the item
      }
    }
    this.saveItems(); // Save updates to localStorage
    this.updateCartIcon();
  }
  static increaseQty(productId) {
    let itemIndex = Cart.items.findIndex(item => item.product.id == productId);

    // Check if the item exists
    if (itemIndex !== -1) {
      // Decrease the quantity
      Cart.items[itemIndex].quantity++;
    }
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
    let totalPrice = 0;

    Cart.items.forEach(item => {
      const productTotalPrice = item.product.price * item.quantity;
      totalPrice += productTotalPrice;
      const cartItemDiv = document.createElement("div");
      cartItemDiv.className = "cart-item h-0vh flex justify-between items-center";

      cartItemDiv.innerHTML = `
      <div class="flex items-center justify-between space-x-4 p-4 border-b">
        <!-- صورة المنتج وعنوانه وسعره -->
        <div class="flex items-center space-x-4">
          <img src="${item.product.image}" class="w-16 h-16 object-cover" alt="${item.product.title}">
          <div>
            <h5 class="text-lg font-semibold">${item.product.title}</h5>
            <p class="text-gray-700">${item.product.price} €</p>
            <p class="text-gray-500 text-sm">Total: ${productTotalPrice.toFixed(2)} €</p> 
          </div>
        </div>

        <!-- التحكم في الكمية وزر الحذف -->
        <div class="flex  auto items-center space-x-2">
          <button class="decrease-btn bg-gray-300 text-black px-2 py-1 rounded">-</button>
          <input type="number" value="${item.quantity}" class="quantity-input w-16 text-center border border-gray-300 rounded" min="0" />
          <button class="increase-btn bg-gray-300 text-black px-2 py-1 rounded">+</button>
          <button class="remove-btn bg-red-500 text-white px-4 py-2 rounded self-center">Remove</button>
        </div>
      </div>
    `;
      //
      //addEventListeners
      cartItemDiv.querySelector(".remove-btn").addEventListener("click", () => {
        Cart.removeProduct(item.product.id);
        Cart.renderCart();
      });
      cartItemDiv.querySelector(".decrease-btn").addEventListener("click", () => {
        Cart.decreaseQty(item.product.id);
        Cart.renderCart();
      });
      cartItemDiv.querySelector(".increase-btn").addEventListener("click", () => {
        Cart.increaseQty(item.product.id);
        Cart.renderCart();
      });

      cartContainer.appendChild(cartItemDiv);

    });
    // Display total price
    const totalPriceDiv = document.createElement("div");
    totalPriceDiv.className = "total-price text-right p-4 text-xl font-bold";
    totalPriceDiv.innerHTML = `Total Price: ${totalPrice.toFixed(2)} €`;
    cartContainer.appendChild(totalPriceDiv);
     // Add Checkout button
     const checkoutButton = document.createElement("button");
     checkoutButton.className = "checkout-btn mt-4 bg-green-500 text-white px-4 py-2 rounded-full w-full";
     checkoutButton.textContent = "Checkout";
     checkoutButton.addEventListener("click", () => {
      Cart.clearCart(); // Call the function to clear the cart
      Cart.renderCart(); // Re-render the cart to reflect the empty state     
      });
      cartContainer.appendChild(checkoutButton);

  }

}
// Footer
class Footer {
  static create() {
    const footer = document.createElement("footer");
    footer.id = "footer"; // Assign an ID to the footer element
    footer.className = "flex items-center justify-between px-6 py-4 bg-white shadow-md z-10 bg-white py-8";
    footer.innerHTML = `
  <div class="flex justify-between items-center container mx-auto px-4">
    <!-- Logo Section -->
    <div class="flex items-center">
      <img src="path-to-your-logo.svg" alt="Logo" class="w-24 h-auto">
    </div>
    
    <!-- Social Media Icons -->
    <div class="flex items-center space-x-6">
      <a href="https://twitter.com/your-twitter" target="_blank">
        <img src="../imges/x_icon.png" alt="Twitter" class="w-6 h-6">
      </a>
      <a href="https://www.facebook.com/your-facebook" target="_blank">
        <img src="./imges/facebook_logo_icon.png"" alt="Facebook" class="w-6 h-6">
      </a>
      <a href="https://www.instagram.com/your-instagram" target="_blank">
        <img src="../imges/instagram_icon.png" alt="Instagram" class="w-6 h-6">
      </a>
      <a href="https://www.github.com/your-pinterest" target="_blank">
        <img src="../imges/github_icon.png" alt="Pinterest" class="w-6 h-6">
      </a>
    </div>
    
    <!-- Copyright Section -->
    <div class="flex items-center">
      <p class="text-gray-600">&copy; 2024 Built by You and Your Partner</p>
    </div>
  </div>`;


    return footer;
  }
}

//const username = Login.loadUserName(); // Load username from localStorage
//if (!username)
  document.addEventListener("DOMContentLoaded", Login.run);
//else
  //document.addEventListener("DOMContentLoaded", App.run);
