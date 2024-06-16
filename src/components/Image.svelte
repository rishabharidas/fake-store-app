<script>
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { icons } from '$lib/utils/icons';
	import { onMount } from 'svelte';
	export let src;

	let loaded = false;
	let failed = false;
	let loading = false;

	onMount(() => {
		const img = new Image();
		img.src = src;
		loading = true;

		img.onload = () => {
			loading = false;
			loaded = true;
		};
		img.onerror = () => {
			loading = false;
			failed = true;
		};
	});
</script>

<!-- Image componet which supports loading, crash image and all image properities (like a base componet) -->
{#if loaded}
	<img {...$$restProps} {src} alt="Document" />
{:else if failed}
	<div class="flex flex-col justify-center w-full items-center">
		<span class="w-7">
			{@html icons.heartbreak}
		</span>
		Not Found
	</div>
{:else if loading}
	<div class="flex justify-center w-full items-center">
		<ProgressRadial width="w-10" meter="stroke-surface-100" track="stroke-surface-500" />
	</div>
{/if}
