<script lang="ts">
	import { Ratings } from '@skeletonlabs/skeleton';
	import common from '$lib/utils/common';
	import { icons } from '$lib/utils/icons';
	import { onMount } from 'svelte';
	import ProductCard from '../../components/ProductCard.svelte';

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
	export let data: productInfo;

	let categoryData: productInfo[] = [];

	onMount(() => {
		let response;
		fetch(`https://fakestoreapi.com/products/category/${data.category}`).then(async (res) => {
			response = await res.json();
			console.log(response.filter((item: productInfo) => item.id != data.id));
			categoryData = response.filter((item: productInfo) => item.id != data.id);
		});
	});
</script>

<div class="flex flex-col">
	<div class=" py-4 px-[5%]">
		<a href="/" class="text-xs">{'< Back to all Products'}</a>
	</div>
	<div class="flex justify-center items-start gap-3">
		<div class="container px-[5%] md:px-0">
			<div class="grid md:grid-cols-2 gap-4">
				<div class="image-section flex justify-center">
					<img src={data.image} alt={data.title} class="w-96 object-scale-down" />
				</div>
				<div class="flex flex-col gap-3 py-10">
					<div class="flex flex-col gap-3">
						<div class="flex flex-col gap-1">
							<span class="text-3xl font-bold">
								{data.title}
							</span>
							<span class="text-lg">
								{common.capitalize(data.category)}
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
							<button class="btn variant-filled p-4 min-w-32">Add to Cart</button>
						</div>
					</div>
					<hr class="my-4" />
					<div class="flex flex-col">
						<span class="text-lg pb-3 text-slate-600"> More about Product </span>
						<span>{@html data.description}</span>
					</div>
				</div>
			</div>
			<div class="flex flex-col py-8">
				<div class="flex justify-between py-6">
					<span class="font-bold text-2xl">Similar Products</span>
					<span>scrollables</span>
				</div>
				<div class="grid grid-cols-4 gap-6">
					{#each categoryData as product, index}
						{#key index}
							<ProductCard productData={product} />
						{/key}
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
