

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
  