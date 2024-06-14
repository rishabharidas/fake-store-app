<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<script lang="ts">
	import ProductCard from '../components/ProductCard.svelte';
	import CardPlaceHolder from '../components/CardPlaceHolder.svelte';
	import Image from '../components/Image.svelte';

	import { onMount, getContext } from 'svelte';
	import { toast } from '@zerodevx/svelte-toast';

	import { type Writable } from 'svelte/store';
	import type { productInfo } from '$lib/interface';
	interface Data {
		categories: string[];
		productsCount: number;
	}

	export let data: Data;
	$: hasMore = data.productsCount > pageLimit ? true : false;

	let products: productInfo[] = [];
	let storeCategories: string[] = data.categories;
	let category: string = 'all';
	let pageLimit: number = 10;
	let sort: string = 'default';
	let loading: boolean = true;
	let scrollLoading: boolean = false;
	let sortTypes: { type: string; label: string }[] = [
		{ type: 'default', label: 'Default' },
		{ type: 'popular', label: 'Most Popular' },
		{
			type: 'price_l-h',
			label: 'Price Low to High'
		},
		{ type: 'price_h-l', label: 'Price High to Low' }
	];

	const scrollEventStore: Writable<{
		scrollTop: number;
		scrollHeight: number;
		clientHeight: number;
	} | null> = getContext('scrollEventStore');

	function handleScrollEvent({
		scrollTop,
		scrollHeight,
		clientHeight
	}: {
		scrollTop: number;
		scrollHeight: number;
		clientHeight: number;
	}) {
		// Check if the user has scrolled to the bottom
		if (scrollTop + clientHeight >= scrollHeight - 50) {
			// 50px from the bottom
			if (hasMore) {
				pageLimit = pageLimit + 6;
				getProducts(true);
			}
		}
	}

	function getCategoryProducts() {
		pageLimit = 6;
		getProducts();
	}

	const debouncedHandleScrollEvent = debounce(handleScrollEvent, 200);

	onMount(() => {
		getProducts();
		const unsubscribe = scrollEventStore.subscribe((value) => {
			if (value) {
				debouncedHandleScrollEvent(value);
			}
		});

		return () => {
			unsubscribe();
		};
	});

	function debounce<T extends (...args: any[]) => void>(
		func: T,
		delay = 200
	): (...args: Parameters<T>) => void {
		let debounceTimer: ReturnType<typeof setTimeout>;
		return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => func.apply(this, args), delay);
		};
	}

	async function getProducts(scrollEvent?: boolean) {
		if (scrollEvent && hasMore) {
			scrollLoading = true;
		} else loading = true;
		try {
			await fetch(
				`https://fakestoreapi.com/products${category !== 'all' ? `/category/${category}` : ''}?limit=${pageLimit}`
			).then(async (res) => {
				products = await res.json();
				sort = 'default';
			});
		} catch (err) {
			console.log(err);
			toast.push('Something went wrong. Please try again later', {
				theme: {
					'--toastColor': '#ffffff',
					'--toastBackground': 'rgba(255, 50, 65, 0.8)',
					'--toastBarBackground': '#a3a3a3'
				}
			});
		}
		loading = false;
		scrollLoading = false;
	}

	function sortBy() {
		if (sort === 'popular') {
			products = products.sort((item1, item2) => item2.rating.rate - item1.rating.rate);
		} else if (sort === 'price_l-h') {
			products = products.sort((item1, item2) => Number(item1.price) - Number(item2.price));
		} else if (sort === 'price_h-l') {
			products = products.sort((item1, item2) => Number(item2.price) - Number(item1.price));
		} else {
			getProducts();
		}
	}

	function capitalize(str: string): string {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
</script>

<div class="h-auto">
	<div class="h-[30vh] flex bg-slate-400 relative">
		<Image
			src="https://fakestoreapi.reactbd.com/static/media/intro.21f1953b210a9f6427b5725847c3482c.svg"
			alt="banner"
			class="object-cover w-screen"
		/>
		<div class="w-full h-full absolute bg-[#cccccc9e]"></div>
		<div class="w-full absolute flex justify-center bottom-[45%]">
			<h1
				class="text-6xl font-extrabold text-center text-[#4800A3] font-sans tracking-tight capitalize italic"
			>
				Fake store
			</h1>
		</div>
	</div>
	<div class="flex justify-center pt-4 px-3 md:px-1">
		<div class="container flex flex-col items-center">
			<div class="px-2 flex justify-between w-full bg-slate-300 pb-3 pt-1 rounded-lg">
				<div class="w-[40%] md:w-[26%]">
					<label class="label">
						<span class="text-xs pl-1">Category</span>
						<select
							class="select rounded-lg mt-0"
							placeholder="Category"
							bind:value={category}
							id="categories-list"
							on:change={getCategoryProducts}
						>
							{#each storeCategories as category, index}
								{#key index}
									<option value={category}>{capitalize(category)}</option>
								{/key}
							{/each}
						</select>
					</label>
				</div>
				<div class="w-[40%] md:w-[30%]">
					<label class="label">
						<span class="text-xs pl-1">Sort By</span>
						<select
							bind:value={sort}
							placeholder="Sort by"
							class="select rounded-lg mt-0"
							on:change={() => sortBy()}
						>
							{#each sortTypes as sortType}
								<option value={sortType.type}>{sortType.label}</option>
							{/each}
						</select>
					</label>
				</div>
			</div>
			<div
				class="py-8 grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-full"
			>
				{#if loading}
					{#each Array(10) as item, index}
						<CardPlaceHolder />
					{/each}
				{:else if products && products.length}
					{#each products as product, index}
						{#key index}
							<ProductCard
								productData={product}
								on:categorySelect={(data) => {
									category = data.detail;
									getCategoryProducts();
								}}
							/>
						{/key}
					{/each}
					{#if scrollLoading}
						<CardPlaceHolder />
						<CardPlaceHolder />
					{/if}
				{/if}
			</div>
		</div>
	</div>
</div>
