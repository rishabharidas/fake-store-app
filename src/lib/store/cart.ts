import { writable } from 'svelte/store';
import { browser } from "$app/environment";

interface Product {
  id: number;
  name: string;
  price: string;
  count: number;
  image:string;
}

// Retrieve cart items from localStorage if in browser environment, otherwise default to an empty array
const cartItemsFromStorage = browser ? localStorage.getItem('cartItems') || '[]' : '[]';

const initialCartItems: Product[] = JSON.parse(cartItemsFromStorage);

export const items = writable<Product[]>(initialCartItems);

if(browser) {

  items.subscribe((value) => localStorage.cartItems = JSON.stringify(value))
}
