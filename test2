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
        <div class="relative border rounded-lg shadow-lg overflow-hidden">
          <img src="${product.image}" class="w-full h-60 object-cover">
          <div class="p-4">
            <h5 class="text-lg font-semibold">${product.title}</h5>
            <p class="text-gray-500">${product.category}</p>
            <p class="text-gray-700 font-bold">${product.price} €</p>
            <p class="text-gray-700 font-bold">${product.rating.rate}</p>
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
  <!-- العلامة التجارية -->
  <div class="text-xl font-bold">chanta</div>

  <!-- عناصر القائمة -->
  <div class="flex space-x-6">
    <!-- Home -->
    <a href="#" class="home-nav text-gray-600 hover:text-gray-900">Home</a>

    <!-- Categories Dropdown -->
    <div class="relative group">
      <button id="categories-button" class="text-gray-600 hover:text-gray-900">Categories</button>
      <div class="categories-dropdown absolute left-0 mt-2 w-48 bg-white border rounded shadow-lg  group-hover:block z-50">
        <div id="category-dropdown" class="categories-dropdown-content py-1" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
          <a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="category-item-all" data-category="all">All</a>
          ${categories
        .map(
          (category) =>
            `<a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="category-item-${category}" data-category="${category}">${category}</a>`
        )
        .join("")}
        </div>
      </div>
    </div>

    <!-- Filter by Rate Dropdown -->
    <div class="relative group">
      <button id="rate-button" class="text-gray-600 hover:text-gray-900">Filter by Rate</button>
      <div class="rate-dropdown absolute left-0 mt-2 w-48 bg-white border rounded shadow-lg 
       group-hover:block z-50">
        <div class="py-1" role="menuitem">
          <a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700" role="menuitem" data-rate="5">5 Stars</a>
          <a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700" role="menuitem" data-rate="4">4 Stars & Up</a>
          <a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700" role="menuitem" data-rate="3">3 Stars & Up</a>
        </div>
      </div>
    </div>

    <!-- Filter by Price Dropdown -->
    <div class="relative group">
      <button id="price-button" class="text-gray-600 hover:text-gray-900">Filter by Price</button>
      <div class="price-dropdown absolute left-0 mt-2 w-48 bg-white border rounded shadow-lg hidden group-hover:block peer-focus:block z-50 ">
        <div class="py-1" role="menuitem">
          <a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700" data-price="0-50">€0 - €50</a>
          <a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700" data-price="50-100">€50 - €100</a>
          <a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700" data-price="100-200">€100 - €200</a>
          <a href="#" class="dropdown-item block px-4 py-2 text-sm text-gray-700" data-price="200+">€200 & Above</a>
        </div>
      </div>
    </div>
    <!-- About -->
    <a href="#" class="about-link text-gray-600 hover:text-gray-900">About</a>
  </div>

  <!-- البحث والسلة -->
  <div class="flex items-center space-x-6 ml-auto">
    <!-- شريط البحث -->
    <div class="flex">
      <input id="search" type="text" placeholder="Search" class="search-input px-4 py-2 border rounded-l-md focus:outline-none">
      <button class="search-button bg-gray-600 text-white px-4 py-2 rounded-r-md hover:bg-gray-700 focus:outline-none">Search</button>
    </div>

    <!-- سلة التسوق -->
    <a href="#" class="cart-link text-gray-600 hover:text-gray-900 relative">
      <div class=" relative">
        <svg class="cart-svg w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18l-2 10H5L3 3z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 17a4 4 0 11-8 0"></path>
        </svg>
        <span class="cart-icon-count absolute top-0.5 right-2 text-xs bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center">0</span>
      </div>
    </a>
  </div>
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
    this.saveItems(); // Save items to localStorage
    this.updateCartIcon();
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
          <button class="decrease-btn bg-gray-300 text-black px-2 py-1 rounded">-</button>
          <input type="number" value="${item.quantity}" class="quantity-input w-16 text-center border border-gray-300 rounded" min="0" />
          <button class="increase-btn bg-gray-300 text-black px-2 py-1 rounded">+</button>
          <button class="remove-btn bg-red-500 text-white px-2 py-1 rounded">Remove</button>
      </div>

      `;

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


document.addEventListener("DOMContentLoaded", App.run);
