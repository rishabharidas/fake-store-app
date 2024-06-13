// export const ssr = false;
async function getProductDetails(id: string) {
	let response;
	try {
		await fetch(`https://fakestoreapi.com/products/${id}`).then(
			async (res) => (response = await res.json())
		);
	} catch (err) {
		console.log(err);
	}
	return response;
}

export const load = async ({ params }) => {
	return await getProductDetails(params.product);
};
