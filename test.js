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
<!-- About -->
</div>
  <a href="#" class="text-gray-600 hover:text-gray-900">About</a>
</div>
<!-- Search -->
<div class="flex">
  <input type="text" placeholder="Search" class="search-input px-4 py-2 border rounded-l-md focus:outline-none">
  <button class="search-button bg-gray-600 text-white px-4 py-2 rounded-r-md hover:bg-gray-700 focus:outline-none">Search</button>
</div>
<!-- Cart -->
<a href="#" class="text-gray-600 hover:text-gray-900 relative">
<div class= "cart-div relative">
  <svg class="cart-svg w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18l-2 10H5L3 3z"></path>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 17a4 4 0 11-8 0"></path>
  </svg>
<span class="cart-icon-count absolute top-5 right-2 text-xs bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center">0</span>
</div>
</a>
</div>`;

  //----Start -java script code for list
document.addEventListener("DOMContentLoaded", () => {
    // Function to handle dropdown toggle and outside click
    const setupDropdown = (buttonId, dropdownId) => {
      const button = document.getElementById(buttonId);
      const dropdown = document.getElementById(dropdownId);
  
      // Toggle dropdown visibility on button click
      button.addEventListener("click", () => {
        dropdown.classList.toggle("hidden");
      });
  
      // Hide dropdown when clicking outside of it
      document.addEventListener("click", (event) => {
        if (!dropdown.contains(event.target) && !button.contains(event.target)) {
          dropdown.classList.add("hidden");
        }
      });
  
      // Hide dropdown when an item is selected
      dropdown.querySelectorAll(".dropdown-item").forEach((item) => {
        item.addEventListener("click", () => {
          dropdown.classList.add("hidden");
        });
      });
    };
  
    // Setup dropdowns
    setupDropdown("categories-button", "catogry-dropdown");
    setupDropdown("rate-button", "rate-dropdown");
    setupDropdown("price-button", "price-dropdown");
  });
  //---End --java script code for list------------------
  