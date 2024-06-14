<script lang="ts">
	import CartItem from './CartItem.svelte';
	import { items } from '$lib/store/cart';
	import { formatMoney } from '$lib/utils/common';
	let totalAmount: number = 0;
	items.subscribe((value) => {
		totalAmount = value.reduce((total, item) => total + Number(item.price) * item.count, 0);
	});
</script>

<div class="flex flex-col gap-3 relative justify-between h-full overflow-x-auto">
	<div class="flex flex-col gap-3 h-auto ">
		{#if $items.length}
			{#each $items as item}
				<CartItem cartItem={item} />
			{/each}
		{/if}
	</div>
	<div class="w-full flex flex-col gap-4 absolute bottom-0">
		<div class="p-4 border border-slate-500 rounded-lg">
			<span class="text-2xl font-base">
				Total: <span class="font-semibold">$ {formatMoney(totalAmount.toString())}</span>
			</span>
		</div>
		<button class="btn variant-filled p-4 font-bold rounded-lg">Buy now</button>
	</div>
</div>
