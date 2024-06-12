async function getProductDetails(id: string) {
	let response;
	await fetch(`https://fakestoreapi.com/products/${id}`).then(
		async (res) => (response = await res.json())
	);
	return response;
}

export const load = async ({ params }) => {
	return await getProductDetails(params.product);
};
