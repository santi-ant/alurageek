
import { servicesProducts } from "../services/product-services.js";

const productsContainer = document.querySelector("[data-product]");
const form = document.querySelector("[data-form]");

// Crea estructura HTML para ser renderizada dinámicamente con JS
function createCard({ nombre, precio, imagen, id }) {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
		<div class="img-container">
			<img src="${imagen}" alt="${nombre}">
		</div>
		<div class="name-card-container--info">
			<p>${nombre}</p>
			<div class="card-container--value">
				<p>$ ${precio}</p>
				<button class="delete-button" data-id="${id}">
					<img src="./assets/trashIcon.svg" alt="Eliminar">
				</button>
			</div>
		</div>
	`;

  // Asigna el evento de eliminación
  addDeleteEvent(card, id);

  return card;
}

// Asigna el evento de eliminar producto a la tarjeta
function addDeleteEvent(card, id) {
  const deleteButton = card.querySelector(".delete-button");
  deleteButton.addEventListener("click", async () => {
    try {
      await servicesProducts.deleteProduct(id);
      card.remove();
      console.log(`Producto con id ${id} eliminado`);
    } catch (error) {
      console.error(`Error al eliminar el producto con id ${id}:`, error);
    }
  });
}

// Renderiza los productos en el DOM
const renderProducts = async () => {
  try {
    const listProducts = await servicesProducts.productList();
    listProducts.forEach((product) => {
      const productCard = createCard(product);
      productsContainer.appendChild(productCard);
    });
  } catch (err) {
    console.error("Error al renderizar productos:", err);
  }
};

// Manejo del evento de envío del formulario
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nombre = document.querySelector("[data-name]").value;
  const precio = document.querySelector("[data-price]").value;
  const imagen = document.querySelector("[data-image]").value;

  if (nombre === "" || precio === "" || imagen === "") {
    alert("Por favor, complete todos los campos");
  } else {
    try {
      const newProduct = await servicesProducts.createProduct(
        nombre,
        precio,
        imagen
      );
      console.log("Producto creado:", newProduct);
      const newCard = createCard(newProduct);
      productsContainer.appendChild(newCard);
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }

    form.reset(); // Reinicia el formulario
  }
});

// Ejecuta la función de renderizado inicial
renderProducts();

fetch('http://localhost:3001/products') .then(response => response.json()) .then(data => console.log(data)) .catch(error => console.error('Error:', error));