document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
  
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", async (event) => {
        const productId = event.target.getAttribute("data-product-id");
        const quantity = 1;
  
        try {
          const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity }),
          });
  
          if (response.ok) {
            console.log("producto agregado");
          } else {
            console.error("fallo al intentar agregar el producto");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      });
    });
  });