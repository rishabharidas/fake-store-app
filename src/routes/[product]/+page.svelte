<script lang="ts">
	import { items } from './../../lib/store/cart';
	import { Ratings, getDrawerStore } from '@skeletonlabs/skeleton';
	import { capitalize } from '$lib/utils/common';
	import { icons } from '$lib/utils/icons';
	import { onMount } from 'svelte';
	import ProductCard from '../../components/ProductCard.svelte';
	import AddRemoveItem from '../../components/AddRemoveItem.svelte';
	import Image from '../../components/Image.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { api } from '$lib/api';

	import type { productInfo, CartProduct } from '$lib/interface';

	export let data: productInfo;

	const drawerStore = getDrawerStore();

	let categoryData: productInfo[] = [];
	let cartProductInfo: CartProduct | undefined;
	let quantity: number = 0;

	// Function to update cartProductInfo and quantity reactively
	function updateCartProductInfo(value) {
		cartProductInfo = value.find((item) => item.id == data.id);
		quantity = cartProductInfo?.count ?? 0;
	}

	// Set up subscription on mount and clean up on destroy
	onMount(() => {
		const unsubscribe = items.subscribe((value) => {
			updateCartProductInfo(value);
		});

		return () => {
			unsubscribe();
		};
	});

	// Function to add an item to the cart
	function addToCart() {
		// Find the index of the item in the cart
		const itemIndex = $items.findIndex((item) => item.id == data.id);
		if (itemIndex !== -1) {
			// If the item is already in the cart, increment its count

			const updatedItems = [...$items];
			updatedItems[itemIndex].count++;
			items.set(updatedItems);
		} else {
			// If the item is not in the cart, add it with count 1

			items.update((currentItems) => [
				...currentItems,
				{
					id: data.id,
					name: data.title,
					price: data.price,
					image: data.image,
					count: 1
				}
			]);
		}
	}

	// Function to remove an item from the cart
	function removeFromCart() {
		const updatedItems = $items
			.map((item) => {
				if (item.id === data.id) {
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

		items.set(updatedItems);
	}

	// Update the cart with the filtered items
	function openCart() {
		drawerStore.open();
	}

	onMount(async () => {
		try {
			let response: productInfo[] = (await api(`/category/${data.category}`)) ?? [];
			categoryData = response.filter((item: productInfo) => item.id != data.id).slice(0, 4);
		} catch (err) {
			console.log(err);
			// Display error toast notification
			toast.push('Something went wrong. Please try again later', {
				theme: {
					'--toastColor': '#ffffff',
					'--toastBackground': 'rgba(255, 50, 65, 0.8)',
					'--toastBarBackground': '#a3a3a3'
				}
			});
		}
	});
</script>

<div class="flex flex-col">
	<div class="flex justify-center items-start gap-3 pt-6">
		<div class="container px-[5%] md:px-[2%]">
			<div class="grid md:grid-cols-2 gap-4 place-items-center">
				<div class="image-section flex justify-center items-center w-64 h-64 md:w-96 md:h-96">
					<Image
						loading="lazy"
						src={data.image}
						alt={data.title}
						class=" w-64 h-64 md:w-96 md:h-96 object-scale-down"
					/>
				</div>
				<div class="flex flex-col gap-3 py-10">
					<div class="flex flex-col gap-3">
						<div class="flex flex-col gap-1">
							<span class="text-3xl font-bold">
								{data.title}
							</span>
							<span class="text-lg">
								{capitalize(data.category)}
							</span>
						</div>
						<div class="">
							<Ratings value={data.rating.rate} max={5} fill="fill-red-500" justify="justify-start">
								<svelte:fragment slot="empty">
									{@html icons.starEmpty}
								</svelte:fragment>
								<svelte:fragment slot="half">
									{@html icons.starHalf}
								</svelte:fragment>
								<svelte:fragment slot="full">
									{@html icons.starFull}
								</svelte:fragment>
							</Ratings>
							<span>{data.rating.count} ratings</span>
						</div>
						<span class="text-3xl font-bold">${parseFloat(data.price).toFixed(2)}</span>
						<div class="flex justify-start gap-6">
							{#if quantity > 0}
								<div class="flex flex-col gap-4">
									<AddRemoveItem
										bind:value={quantity}
										on:decrement={removeFromCart}
										on:increment={addToCart}
									/>
									<button class="btn variant-filled rounded-lg" on:click={openCart}>
										Go to Cart
									</button>
								</div>
							{:else}
								<button class="btn variant-filled rounded-lg p-3 min-w-32" on:click={addToCart}>
									Add to Cart
								</button>
							{/if}
						</div>
					</div>
					<hr class="my-4" />
					<div class="flex flex-col">
						<span class="text-lg pb-3 text-slate-600"> More about Product </span>
						<span>{@html data.description}</span>
					</div>
				</div>
			</div>
			<div class="flex flex-col py-8 w-full">
				<div class="flex justify-between py-6">
					<span class="font-bold text-2xl">Similar Products</span>
					<a data-sveltekit-preload-data href="/" class="btn variant-filled rounded-lg">
						View all products
					</a>
				</div>
				<div class="flex flex-col md:flex-row gap-6 w-full md:w-auto md:overflow-x-auto">
					{#each categoryData as product, index}
						{#key index}
							<div class="w-full md:w-64">
								<ProductCard productData={product} />
							</div>
						{/key}
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	:global(::-webkit-scrollbar) {
		display: none !important;
	}
</style>
