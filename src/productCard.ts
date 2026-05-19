import { Product } from './types';

function formatCategory(category: string): string {
  return category
    .split('-')
    .map((word: string): string => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getStockText(stock: number): string {
  if (stock < 10) {
    return `Only ${stock} left`;
  }

  return `${stock} in stock`;
}

export function createProductCard(
  product: Product,
  onAddToCart: (product: Product) => void
): HTMLElement {
  const card: HTMLElement = document.createElement('article');
  card.className = 'product-card';

  const stockClass: string = product.stock < 10 ? 'stock stock-warning' : 'stock';

  card.innerHTML = `
    <div class="product-image-wrapper">
      <img 
        src="${product.thumbnail}" 
        alt="${product.title}" 
        class="product-image"
      />
    </div>

    <div class="product-content">
      <span class="category">${formatCategory(product.category)}</span>

      <h3>${product.title}</h3>

      <p class="description">${product.description}</p>

      <div class="product-meta">
        <p><strong>Rating:</strong> ${product.rating}</p>
        <p class="${stockClass}"><strong>Stock:</strong> ${getStockText(product.stock)}</p>
      </div>

      ${
        product.stock < 10
          ? '<p class="warning">Low stock warning</p>'
          : ''
      }

      <button class="add-button" type="button">
        Add to cart
      </button>
    </div>
  `;

  const addButton: HTMLButtonElement = card.querySelector('.add-button') as HTMLButtonElement;

  addButton.addEventListener('click', (): void => {
    onAddToCart(product);
  });

  return card;
}