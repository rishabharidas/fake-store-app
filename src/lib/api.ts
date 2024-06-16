const base_url: string = 'https://fakestoreapi.com/products';

export async function api(params: string) {
	let response;
	await fetch(`${base_url}${params}`).then(async (res) => {
		response = await res.json();
	});
	return response;
}
