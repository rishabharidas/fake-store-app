export interface Rating {
	rate: number;
	count: number;
}

export interface productInfo {
	id: number;
	title: string;
	price: string;
	category: string;
	description: string;
	rating: Rating;
	image: string;
}

export interface CartProduct {
	id: number;
	name: string;
	price: string;
	count: number;
	image: string;
}
