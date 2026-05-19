import { ProductsResponse } from './types';

const BASE_URL: string = 'https://dummyjson.com/products';

export async function getAllProducts(): Promise<ProductsResponse> {
  const response: Response = await fetch(`${BASE_URL}?limit=30`);

  if (!response.ok) {
    throw new Error('Could not fetch products');
  }

  const data: ProductsResponse = (await response.json()) as ProductsResponse;
  return data;
}

export async function searchProducts(searchTerm: string): Promise<ProductsResponse> {
  const encodedSearchTerm: string = encodeURIComponent(searchTerm.trim());
  const response: Response = await fetch(`${BASE_URL}/search?q=${encodedSearchTerm}`);

  if (!response.ok) {
    throw new Error('Could not search products');
  }

  const data: ProductsResponse = (await response.json()) as ProductsResponse;
  return data;
}