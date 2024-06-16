// export const ssr = false;
import { api } from '$lib/api';

// Function to fetch product details by product ID
async function getProductDetails(id: string) {
	let response;
	try {
		// Make an API call to fetch product details
		response = await api(`/${id}`);
	} catch (err) {
		console.log(err);
	}
	return response;
}

export const load = async ({ params }) => {
	return await getProductDetails(params.product);
};
