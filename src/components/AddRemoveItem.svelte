<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let value: number;

	function addItem() {
		value += 1;
		dispatch('increment');
	}
	function decrementItem() {
		value = value - 1;
		dispatch('decrement');
	}
</script>

<div class="flex justify-start items-center gap-1">
	<button class="variant-filled w-11 h-11 text-2xl font-bold rounded-lg" on:click={decrementItem}>
		-
	</button>
	<input type="text" class="input w-16 rounded-lg" bind:value />
	<button class="variant-filled w-11 h-11 text-2xl font-bold rounded-lg" on:click={addItem}>
		+
	</button>
	{value > 1 ? 'Items' : 'Item'}
</div>
