<script lang="ts">
	import { Ratings, Modal, getModalStore } from '@skeletonlabs/skeleton';
	import { icons } from '$lib/utils/icons';
	import { capitalize } from '$lib/utils/common';
	import { createEventDispatcher } from 'svelte';
	import Image from './Image.svelte';
	import { scale } from 'svelte/transition';
	import ProductPopup from './ProductPopup.svelte';

	import type { ModalComponent, ModalStore } from '@skeletonlabs/skeleton';
	import type { productInfo } from '$lib/interface';

	const dispatch = createEventDispatcher();
	const modalStore: ModalStore = getModalStore();

	export let productData: productInfo;
	const modalComponent: ModalComponent = { ref: ProductPopup, props: { data: productData } };

	function sortCategory(category: string) {
		dispatch('categorySelect', category);
	}

	function showPreviewPopUp() {
		modalStore.trigger({
			type: 'component',
			component: modalComponent
		});
	}
</script>

<button
	class="card shadow-lg rounded-xl flex gap-4 h-[250px] md:flex-col md:gap-2 md:h-[500px] overflow-hidden"
	on:click|preventDefault={showPreviewPopUp}
>
	<a
		data-sveltekit-preload-data
		href="/{productData.id}"
		class="w-[50%] bg-white h-full md:h-[50%] md:w-full flex justify-center"
		on:click|stopPropagation
	>
		<Image src={productData.image} alt={productData.title} class="object-contain px-2" />
	</a>
	<div class="p-4 flex flex-col w-[50%] md:w-[100%] md:h-[50%] gap-3 md:gap-1 md:justify-between">
		<button
			class="text-sm underline flex justify-start"
			on:click|stopPropagation={() => sortCategory(productData.category)}
		>
			{capitalize(productData.category)}
		</button>
		<a
			data-sveltekit-preload-data
			href="/{productData.id}"
			on:click|stopPropagation
			class="w-full flex text-left"
		>
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
		<div class="hidden md:flex h-[21%] overflow-hidden w-full text-left">
			<span class="text-base line-clamp-2">{productData.description}</span>
		</div>
		<span class="text-3xl md:text-2xl font-bold w-full flex text-left"
			>$ {parseFloat(productData.price).toFixed(2)}</span
		>
	</div>
</button>
<Modal
	transitionIn={scale}
	transitionOut={scale}
	transitionOutParams={{ duration: 400 }}
	transitionInParams={{ duration: 400 }}
	regionBackdrop="bg-black/[0.15]"
/>
