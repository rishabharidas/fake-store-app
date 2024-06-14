<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let value: number;
	export let useSmallonMobile: boolean = false;

	function addItem() {
		value += 1;
		dispatch('increment');
	}
	function decrementItem() {
		value = value - 1;
		dispatch('decrement');
	}
	$: buttonClass = useSmallonMobile ? 'w-8 md:w-11 h-8 md:h-11' : 'w-11 h-11';
	$: inputClass = useSmallonMobile ? 'w-10 h-8 md:h-auto md:w-16' : 'h-auto w-16';
</script>

<div class="flex justify-start items-center gap-1">
	<button
		class="variant-filled {buttonClass} text-2xl font-bold rounded-lg"
		on:click={decrementItem}
	>
		-
	</button>
	<input type="text" class="input {inputClass} rounded-lg" bind:value />
	<button class="variant-filled {buttonClass} text-2xl font-bold rounded-lg" on:click={addItem}>
		+
	</button>
	<span class="hidden md:block">{value > 1 ? 'Items' : 'Item'}</span>
</div>
