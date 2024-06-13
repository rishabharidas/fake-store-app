<script lang="ts">
	import { Ratings } from '@skeletonlabs/skeleton';
	import { icons } from '$lib/utils/icons';
	import { capitalize } from '$lib/utils/common';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	interface Rating {
		rate: number;
		count: number;
	}

	interface productInfo {
		id: number;
		title: string;
		price: string;
		category: string;
		description: string;
		rating: Rating;
		image: string;
	}
	export let productData: productInfo;
	console.log(productData, '<>>>>>');

	function sortCategory(category: string) {
		dispatch('categorySelect', category);
	}
</script>

<div
	class="card shadow-xl rounded-xl flex gap-4 h-[250px] md:flex-col md:gap-2 md:h-[500px] overflow-hidden"
>
	<a
		href="/{productData.id}"
		class="w-[50%] bg-white h-auto md:h-[50%] md:w-auto flex justify-center"
	>
		<img src={productData.image} alt={productData.title} class="object-contain px-2" />
	</a>
	<div class="p-4 flex flex-col w-[50%] md:w-[100%] md:h-[50%] gap-3 md:gap-1 md:justify-between">
		<button
			class="text-sm underline flex justify-start"
			on:click|stopPropagation={() => sortCategory(productData.category)}
		>
			{capitalize(productData.category)}
		</button>
		<a href="/{productData.id}">
			<span class="text-lg font-medium line-clamp-2 min-h-14">{productData.title}</span>
		</a>

		<div class="flex gap-1">
			<span class="underline">{productData.rating.count}</span>
			<Ratings
				value={productData.rating.rate}
				max={5}
				fill="fill-red-500"
				justify="justify-start items-center"
			>
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
		</div>
		<div class="h-[20%] overflow-hidden">
			<span class="text-base line-clamp-2">{productData.description}</span>
		</div>
		<span class="text-3xl md:text-2xl font-bold">$ {parseFloat(productData.price).toFixed(2)}</span>
	</div>
</div>
