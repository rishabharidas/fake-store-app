export const load = async ({ params }) => {
	let categories;
	let productsCount: number = 0;
	await fetch('https://fakestoreapi.com/products/categories').then(async (res) => {
		categories = await res.json();
		categories.push('all');
		categories.sort((a: string, b: string) => a.localeCompare(b));
	});
	await fetch(`https://fakestoreapi.com/products`).then(async (res) => {
		let products = await res.json();
		productsCount = products.length;
	});

	return { categories, productsCount };
};
