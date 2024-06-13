<script lang="ts">
	import '../app.postcss';
	import { AppBar, initializeStores, Drawer, getDrawerStore } from '@skeletonlabs/skeleton';
	import { onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';

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

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { items } from '$lib/store/cart';

	import Cart from '../components/Cart.svelte';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	const scrollEventStore = writable<{
		scrollTop: number;
		scrollHeight: number;
		clientHeight: number;
	} | null>(null);

	function runEvent() {
		if (scrollContainer) {
			const scrollTop = scrollContainer.scrollTop;
			const scrollHeight = scrollContainer.scrollHeight;
			const clientHeight = scrollContainer.clientHeight;

			scrollEventStore.set({ scrollTop, scrollHeight, clientHeight });
		}
	}

	let cartItemsCount: number = 0;

	items.subscribe((value) => {
		cartItemsCount = value.length ?? 0;
	});

	setContext('scrollEventStore', scrollEventStore);

	onMount(() => {
		if (scrollContainer) {
			scrollContainer.addEventListener('scroll', runEvent);
		}

		return () => {
			if (scrollContainer) {
				scrollContainer.removeEventListener('scroll', runEvent);
			}
		};
	});
	const drawerStore = getDrawerStore();

	function openDrawer() {
		drawerStore.open();
	}
</script>

<div class="w-full h-full flex flex-col overflow-hidden">
	<header>
		<!-- App Bar -->
		<AppBar shadow="shadow-lg" padding="py-3 px-3 md:px-[10%]">
			<svelte:fragment slot="lead">
				<a href="/"><strong class="text-xl uppercase">Fake Store</strong></a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<div class="relative inline-block">
					<span class="badge-icon variant-filled-warning absolute -top-0 -right-0 z-10"
						>{cartItemsCount}</span
					>
					<button class="btn btn-sm" on:click={openDrawer}>
						<svg
							class="w-7 h-7 text-gray-800 dark:text-white"
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
					</button>
				</div>
			</svelte:fragment>
		</AppBar>
	</header>
	<!-- Page Route Content -->
	<div bind:this={scrollContainer} style="height: 92vh; overflow-y: auto">
		<slot />
	</div>
</div>
<Drawer
	bgDrawer="bg-slate-200 text-black"
	width="w-[280px] md:w-[480px]"
	padding="p-2"
	rounded="rounded-lg"
	position="right"
>
	<div class="card h-[98vh]">
		<div class="card-header">
			<span class="text-3xl flex items-center py-3">
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
			<hr />
		</div>
		<div class="p-4 h-[90%]">
			<Cart />
		</div>
	</div>
</Drawer>
