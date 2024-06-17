<script lang="ts">
	import { searchStore } from '$lib/store/searchStore';
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';
	
	import '../app.postcss';
	import { initializeStores, Drawer, getDrawerStore } from '@skeletonlabs/skeleton';
	import { onMount, setContext, createEventDispatcher } from 'svelte';
	import { browser } from '$app/environment';

	// Highlight JS
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml'; // for HTML
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';

	hljs.registerLanguage('xml', xml); // for HTML
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);
	initializeStores();
	let scrollContainer: HTMLDivElement;
	const dispatch = createEventDispatcher();

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { items } from '$lib/store/cart';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { icons } from '$lib/utils/icons';

	import Cart from '../components/Cart.svelte';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	// Create a writable store to hold scroll event details
	const scrollEventStore = writable<{
		scrollTop: number;
		scrollHeight: number;
		clientHeight: number;
	} | null>(null);

	let cartItemsCount: number = 0;
	let onSearch: boolean = false;
	let currentPageId: string | null = null;

	// Function to handle scroll events and update the scrollEventStore
	function runEvent() {
		if (scrollContainer) {
			const scrollTop = scrollContainer.scrollTop;
			const scrollHeight = scrollContainer.scrollHeight;
			const clientHeight = scrollContainer.clientHeight;

			// Update the scrollEventStore with the latest scroll details
			scrollEventStore.set({ scrollTop, scrollHeight, clientHeight });
		}
	}

	// Subscribe to items store and update cartItemsCount accordingly
	items.subscribe((value) => {
		cartItemsCount = value.length ?? 0;
	});

	setContext('scrollEventStore', scrollEventStore);

	onMount(() => {
		if (scrollContainer) {
			// Add the scroll event listener to the scrollContainer
			scrollContainer.addEventListener('scroll', runEvent);
		}

		// Cleanup function to remove the scroll event listener when the component is destroyed
		return () => {
			if (scrollContainer) {
				scrollContainer.removeEventListener('scroll', runEvent);
			}
		};
	});
	const drawerStore = getDrawerStore();

	// Function to open the drawer using the drawer store
	function openDrawer() {
		drawerStore.open();
	}

	let searchFunc: Function;

	// Subscribe to the searchStore and update searchFunc with the searchItems function
	searchStore.subscribe((value) => {
		searchFunc = value.searchItems;
	});

	// Function to be called when `page.route.id` changes
	function scrollToTop() {
		if (browser && scrollContainer) {
			scrollContainer.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		}
	}

	$: {
		$page; // This is a reactive statement that will run whenever $page changes

		if ($page.route && $page.route.id !== currentPageId) {
			currentPageId = $page.route.id;
			scrollToTop();
		}
	}

	function searchItems() {
		searchFunc();
	}
</script>

<div class="w-full h-full flex flex-col overflow-hidden">
	<header>
		<div class="shadow-2xl bg-slate-400 w-full flex justify-center items-center">
			<div class="container py-3 px-3 gap-2 flex justify-between">
				<div class="{onSearch ? 'hidden md:flex' : 'flex'} items-center justify-center">
					<a
						data-sveltekit-preload-data
						href="/"
						class="touch-styler {onSearch ? 'hidden md:block' : 'block'}"
					>
						<strong class="text-xl text-[#4800A3] font-sans tracking-tight capitalize italic">
							Fake Store
						</strong>
					</a>
				</div>

				<div
					class="flex {$page.route.id === '/' ? 'justify-between' : 'justify-end'}
						{onSearch ? 'w-full md:w-[70%] ' : 'w-[70%]'} 
						items-center gap-3"
				>
					{#if $page.route.id === '/'}
						<input
							class="input rounded-lg w-full"
							placeholder="Search Items"
							bind:value={$searchStore.searchValue}
							on:click={() => (onSearch = true)}
							on:keypress={(e) => (e.key == 'Enter' ? searchItems() : '')}
						/>
						<button
							class="{onSearch ? 'block' : 'hidden md:block'} btn btn-sm px-0"
							on:click={() => {
								searchItems();
								onSearch = false;
							}}
						>
							<span>{@html icons.searchIcon}</span>
						</button>
					{/if}
					<button
						class="{onSearch ? 'hidden md:block' : ''} relative inline-block touch-styler"
						on:click={openDrawer}
					>
						<span class="badge-icon variant-filled-warning absolute -top-0 -right-0 z-10"
							>{cartItemsCount}</span
						>
						<div class="btn btn-sm pl-0">
							{@html icons.cartIcon}
						</div>
					</button>
				</div>
			</div>
		</div>
	</header>
	<!-- Page Route Content -->
	<div
		bind:this={scrollContainer}
		style="height: 93vh; overflow-y: auto"
		class="bg-slate-200 flex flex-col justify-between"
	>
		<slot />
		<footer class="w-full py-5 px-3 md:px-[9%] flex justify-between items-center bg-slate-400">
			<span>fake store ltd</span>
			<span> © {new Date().getFullYear()}</span>
		</footer>
	</div>
</div>
<Drawer
	bgDrawer="bg-slate-200 text-black"
	width="w-[320px] md:w-[480px]"
	height="h-full"
	padding="p-2"
	rounded="rounded-lg"
	position="right"
>
	<div class="card h-full">
		<div class="h-[10%] px-4 py-2 flex justify-start items-center">
			<span class="text-3xl flex items-center">
				<svg
					class="w-12 h-12 text-gray-800 dark:text-white"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
					/>
				</svg>
				Cart
			</span>
		</div>
		<hr />
		<div class="px-4 pb-2 pt-4 h-[89%]">
			<Cart />
		</div>
	</div>
</Drawer>
<SvelteToast />
