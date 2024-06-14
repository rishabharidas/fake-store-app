import { writable } from 'svelte/store';
import { browser } from '$app/environment';

import type { CartProduct } from '$lib/interface';

// Retrieve cart items from localStorage if in browser environment, otherwise default to an empty array
const cartItemsFromStorage = browser ? localStorage.getItem('cartItems') || '[]' : '[]';

const initialCartItems: CartProduct[] = JSON.parse(cartItemsFromStorage);

export const items = writable<CartProduct[]>(initialCartItems);

if (browser) {
	items.subscribe((value) => (localStorage.cartItems = JSON.stringify(value)));
}
