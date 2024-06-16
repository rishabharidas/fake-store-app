<script lang="ts">
	import { items } from '$lib/store/cart';
	import AddRemoveItem from './AddRemoveItem.svelte';
	import Image from './Image.svelte';

	import type { CartProduct } from '$lib/interface';

	export let cartItem: CartProduct;
	let cartProductInfo: CartProduct | undefined;

	items.subscribe((value) => {
		cartProductInfo = value.find((item) => item.id == cartItem.id);
	});

	let quantity: number = cartProductInfo?.count ?? 0;

	// Function to add an item to the cart
	function addToCart() {
		if ($items.find((item) => item.id == cartItem.id)) {
			// Increment the count of the existing item in the cart
			$items[$items.findIndex((item) => item.id == cartItem.id)].count++;
		}
	}

	// Function to remove an item from the cart
	function removeFromCart() {
		const updatedItems = $items
			.map((item) => {
				if (item.id === cartItem.id) {
					const updatedCount = item.count - 1;
					if (updatedCount <= 0) {
						return null; // Remove the item
					} else {
						return { ...item, count: updatedCount };
					}
				}
				return item;
			})
			.filter((item) => item !== null) as CartProduct[];

		// Update the cart with the filtered items
		items.set(updatedItems);
	}
</script>

<!-- Cart item Component -->
<div class="flex justify-center items-center gap-3 bg-gray-300 rounded-lg px-2 max-h-[100px]">
	<div class="w-[40%] flex justify-center items-center object-contain h-auto">
		<Image
			loading="lazy"
			src={cartItem.image}
			alt={cartItem.name}
			class="object-contain h-[90px]"
		/>
	</div>
	<div class="w-[60%] h-32 flex flex-col justify-center gap-2">
		<span class="line-clamp-1">{cartItem.name}</span>
		<AddRemoveItem
			bind:value={quantity}
			useSmallonMobile={true}
			on:increment={addToCart}
			on:decrement={removeFromCart}
		/>
	</div>
</div>
