import { getAllProducts, searchProducts } from './api';
import { createProductCard } from './productCard';
import { Product, ProductsResponse } from './types';

type CartItem = {
  product: Product;
  quantity: number;
};

const searchForm: HTMLFormElement = document.querySelector('#search-form') as HTMLFormElement;
const searchInput: HTMLInputElement = document.querySelector('#search-input') as HTMLInputElement;
const productsContainer: HTMLElement = document.querySelector('#products-container') as HTMLElement;
const resultCount: HTMLElement = document.querySelector('#result-count') as HTMLElement;
const message: HTMLElement = document.querySelector('#message') as HTMLElement;
const showAllButton: HTMLButtonElement = document.querySelector('#show-all-button') as HTMLButtonElement;
const cartButton: HTMLButtonElement = document.querySelector('.cart-button') as HTMLButtonElement;

let cart: CartItem[] = [];

function clearProducts(): void {
  productsContainer.innerHTML = '';
}

function showMessage(text: string): void {
  message.textContent = text;
}

function clearMessage(): void {
  message.textContent = '';
}

function getCartTotalItems(): number {
  return cart.reduce((total: number, item: CartItem): number => total + item.quantity, 0);
}

function updateCartButton(): void {
  const totalItems: number = getCartTotalItems();
  cartButton.textContent = `Cart (${totalItems})`;
}

function addToCart(product: Product): void {
  const existingItem: CartItem | undefined = cart.find(
    (item: CartItem): boolean => item.product.id === product.id
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      product,
      quantity: 1
    });
  }

  updateCartButton();
  showMessage(`${product.title} added to cart`);
}

function showCart(): void {
  if (cart.length === 0) {
    showMessage('Your cart is empty.');
    return;
  }

  const cartText: string = cart
    .map((item: CartItem): string => `${item.product.title} x ${item.quantity}`)
    .join('\n');

  alert(`Cart:\n\n${cartText}`);
}

function renderProducts(products: Product[]): void {
  clearProducts();

  resultCount.textContent = `${products.length} products found`;

  if (products.length === 0) {
    showMessage('No products found. Try another search.');
    return;
  }

  clearMessage();

  products.forEach((product: Product): void => {
    const productCard: HTMLElement = createProductCard(product, addToCart);
    productsContainer.appendChild(productCard);
  });
}

async function loadAllProducts(): Promise<void> {
  try {
    resultCount.textContent = 'Loading products...';
    clearMessage();

    const data: ProductsResponse = await getAllProducts();
    renderProducts(data.products);
  } catch (error: unknown) {
    resultCount.textContent = '0 products found';
    showMessage('Something went wrong while loading products.');
    console.error(error);
  }
}

async function handleSearch(event: SubmitEvent): Promise<void> {
  event.preventDefault();

  const searchTerm: string = searchInput.value.trim();

  if (searchTerm.length === 0) {
    await loadAllProducts();
    return;
  }

  try {
    resultCount.textContent = 'Searching...';
    clearMessage();

    const data: ProductsResponse = await searchProducts(searchTerm);
    renderProducts(data.products);
  } catch (error: unknown) {
    resultCount.textContent = '0 products found';
    showMessage('Something went wrong while searching.');
    console.error(error);
  }
}

searchForm.addEventListener('submit', (event: SubmitEvent): void => {
  void handleSearch(event);
});

showAllButton.addEventListener('click', (): void => {
  searchInput.value = '';
  void loadAllProducts();
});

cartButton.addEventListener('click', (): void => {
  showCart();
});

updateCartButton();
void loadAllProducts();