<script lang="ts">
	import { items } from '$lib/store/cart';
	import { Ratings, getModalStore, getDrawerStore } from '@skeletonlabs/skeleton';
	import { capitalize } from '$lib/utils/common';
	import { icons } from '$lib/utils/icons';
	import { onMount } from 'svelte';
	import AddRemoveItem from './AddRemoveItem.svelte';
	import Image from './Image.svelte';

	import type { productInfo, CartProduct } from '$lib/interface';

	export let data: productInfo;
	export let parent: any;

	const modalStore = getModalStore();
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

	function addToCart() {
		const itemIndex = $items.findIndex((item) => item.id == data.id);
		if (itemIndex !== -1) {
			const updatedItems = [...$items];
			updatedItems[itemIndex].count++;
			items.set(updatedItems);
		} else {
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

	function closeModal() {
		modalStore.close();
	}

	function openCart() {
		closeModal();
		drawerStore.open();
	}
</script>

<div
	class="flex md:flex-col bg-slate-50 max-w-[95%] md:max-w-[60%] max-h-[60%] rounded-lg p-4 relative"
>
	<button class="absolute -top-4 -right-2 w-7" on:click={closeModal}>
		{@html icons.closeMark}
	</button>
	<div class="flex flex-col justify-center items-start gap-3">
		<div class="container px-[5%] md:px-[2%]">
			<div class="grid md:grid-cols-2 gap-4">
				<div class="image-section flex justify-center items-center">
					<a data-sveltekit-preload-data href="/{data.id}" on:click={closeModal}>
						<Image
							loading="lazy"
							src={data.image}
							alt={data.title}
							class="max-w-60 object-scale-down"
						/>
					</a>
				</div>
				<div class="flex flex-col justify-center gap-3 py-5">
					<div class="flex flex-col gap-3">
						<div class="flex flex-col gap-1">
							<span class="text-3xl font-bold">
								<a data-sveltekit-preload-data href="/{data.id}" on:click={closeModal}>
									{data.title}</a
								>
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
							{#key quantity}
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
							{/key}
						</div>
					</div>
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
