emailjs.init('YOUR_EMAILJS_USER_ID'); // Replace with actual EmailJS user ID

let cart = [];
let totalAmount = 0;

// Add item and toggle button
function addToCart(serviceName, price) {
  const existingItem = cart.find(item => item.name === serviceName);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: serviceName, price: price, quantity: 1 });
  }
  totalAmount += price;
  updateCart();

  // Toggle: Add → Remove
  const serviceItem = getServiceItem(serviceName);
  if (serviceItem) {
    serviceItem.querySelector(".add-btn").style.display = "none";
    if (!serviceItem.querySelector(".remove-btn")) {
      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-btn";
      removeBtn.textContent = "Remove";
      removeBtn.onclick = () => removeService(serviceName);
      serviceItem.querySelector(".service-actions").appendChild(removeBtn);
    } else {
      serviceItem.querySelector(".remove-btn").style.display = "inline-block";
    }
  }
}

// Remove item and toggle button
function removeService(serviceName) {
  const index = cart.findIndex(item => item.name === serviceName);
  if (index !== -1) {
    totalAmount -= cart[index].price * cart[index].quantity;
    cart.splice(index, 1);
    updateCart();
  }

  // Toggle: Remove → Add
  const serviceItem = getServiceItem(serviceName);
  if (serviceItem) {
    serviceItem.querySelector(".add-btn").style.display = "inline-block";
    const removeBtn = serviceItem.querySelector(".remove-btn");
    if (removeBtn) removeBtn.style.display = "none";
  }
}

// Helper: find service div by name
function getServiceItem(serviceName) {
  const items = document.querySelectorAll(".service-item");
  for (let item of items) {
    if (item.querySelector(".service-name").textContent === serviceName) {
      return item;
    }
  }
  return null;
}

// Remove from cart (cart table)
function removeFromCart(index) {
  const removedItem = cart[index];
  totalAmount -= removedItem.price * removedItem.quantity;
  const serviceName = removedItem.name;
  cart.splice(index, 1);
  updateCart();

  // Reset button state in service list
  const serviceItem = getServiceItem(serviceName);
  if (serviceItem) {
    serviceItem.querySelector(".add-btn").style.display = "inline-block";
    const removeBtn = serviceItem.querySelector(".remove-btn");
    if (removeBtn) removeBtn.style.display = "none";
  }
}

// Update cart UI
function updateCart() {
  const cartItemsElement = document.getElementById("cart-items");
  const totalAmountElement = document.getElementById("total-amount");

  cartItemsElement.innerHTML = "";
  if (cart.length === 0) {
    cartItemsElement.innerHTML =
      '<tr><td colspan="4" style="text-align:center;">No items added yet</td></tr>';
  } else {
    cart.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>₹${(item.price * item.quantity).toFixed(2)}</td>
    `;

      cartItemsElement.appendChild(row);
    });
  }

  totalAmountElement.textContent = totalAmount.toFixed(2);
}

// Booking form
document.getElementById("booking-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const fullName = document.getElementById("full-name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;

  const emailData = {
    to_email: email,
    from_name: "LaundryPro",
    to_name: fullName,
    message: `Thank you for booking our laundry services. Here are your order details:

    Services Booked:
    ${cart
      .map(
        (item) => `- ${item.name} (${item.quantity} x ₹${item.price.toFixed(2)})`
      )
      .join("\n")}

    Total Amount: ₹${totalAmount.toFixed(2)}

    We will contact you shortly at ${phone} to confirm your pickup time.

    Thank you for choosing LaundryPro!`,
  };

  emailjs
    .send("YOUR_EMAILJS_SERVICE_ID", "YOUR_EMAILJS_TEMPLATE_ID", emailData)
    .then(
      function (response) {
        document.getElementById("thank-you").style.display = "block";
        document.getElementById("booking-form").reset();
        cart = [];
        totalAmount = 0;
        updateCart();
        setTimeout(() => {
          document.getElementById("thank-you").style.display = "none";
        }, 5000);
      },
      function (error) {
        alert("Error sending email. Please try again.");
        console.error("EmailJS error:", error);
      }
    );
});

// Newsletter
document.getElementById("newsletter-form").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Thank you for subscribing to our newsletter!");
  this.reset();
});

updateCart();
