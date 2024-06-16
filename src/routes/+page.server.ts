import { api } from '$lib/api.js';
import type { productInfo } from '$lib/interface';

export const load = async ({ params }) => {
	let categories: string[] = [];
	let productsCount: number = 0;
	try {
		// Fetch the list of categories from the API
		categories = (await api('/categories')) ?? [];
		categories.push('all');
		categories.sort((a: string, b: string) => a.localeCompare(b));

		// Fetch the list of products from the API for totalcount
		let products: productInfo[] = (await api('')) ?? [];
		productsCount = products.length;
	} catch (err) {
		console.log(err);
	}

	return { categories, productsCount };
};
