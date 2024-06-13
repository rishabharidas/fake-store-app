<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<script lang="ts">
	import ProductCard from '../components/ProductCard.svelte';
	import { onMount, getContext } from 'svelte';
	import { type Writable } from 'svelte/store';

	interface Data {
		categories: string[];
		productsCount: number;
	}

	interface Rating {
		rate: number;
		count: number;
	}
	interface productsData {
		id: number;
		title: string;
		price: string;
		category: string;
		description: string;
		rating: Rating;
		image: string;
	}

	export let data: Data;
	$: hasMore = data.productsCount > pageLimit ? true : false;

	let products: productsData[] = [];
	let storeCategories: string[] = data.categories;
	let category: string = 'all';
	let pageLimit: number = 10;
	let sort: string = 'asc';

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
				getProducts();
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

	async function getProducts() {
		try {
			await fetch(
				`https://fakestoreapi.com/products${category !== 'all' ? `/category/${category}` : ''}?limit=${pageLimit}&?sort=${sort}`
			).then(async (res) => {
				products = await res.json();
			});
		} catch (err) {
			console.log(err);
		}
	}

	function capitalize(str: string): string {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
</script>

<div class=" h-auto">
	<div class="h-[30vh] flex bg-slate-400">
		<img
			src="https://fakestoreapi.reactbd.com/static/media/intro.21f1953b210a9f6427b5725847c3482c.svg"
			alt="banner"
			class="object-cover w-screen"
		/>
	</div>
	<div class="flex justify-center pt-4 px-3 md:px-1">
		<div class="container flex flex-col items-center">
			<div class="px-2 flex justify-between w-full bg-slate-300 py-3 rounded-lg">
				<div class="w-[26%]">
					<!-- <label class="label"> -->
					<!-- <span class="text-xs">Category</span> -->
					<select
						class="select rounded-lg"
						placeholder="Category"
						bind:value={category}
						on:change={getCategoryProducts}
					>
						{#each storeCategories as category, index}
							{#key index}
								<option value={category}>{capitalize(category)}</option>
							{/key}
						{/each}
					</select>
					<!-- </label> -->
				</div>
				<div class="w-[26%]">
					<!-- <label class="label">
						<span class="text-xs">Sort</span> -->
					<select
						bind:value={sort}
						placeholder="Sort by"
						class="select rounded-lg"
						on:change={getProducts}
					>
						<option value="asc">Sort By - Asc</option>
						<option value="desc">Sort By - Desc</option>
					</select>
					<!-- </label> -->
				</div>
			</div>
			<div class="py-8 grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
				{#if products && products.length}
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
				{/if}
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
</style>
