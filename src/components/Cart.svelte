<script lang="ts">
	import CartItem from './CartItem.svelte';
	import { items } from '$lib/store/cart';
	import { formatMoney } from '$lib/utils/common';
	let totalAmount: number = 0;
	items.subscribe((value) => {
		totalAmount = value.reduce((total, item) => total + Number(item.price) * item.count, 0);
	});
</script>

<div class="flex flex-col gap-3 relative justify-between h-full overflow-hidden">
	<div class="flex flex-col gap-3 h-[80%] overflow-y-auto px-3">
		{#if $items.length}
			{#each $items as item}
				{#key item.id}
					<CartItem cartItem={item} />
				{/key}
			{/each}
		{/if}
	</div>
	<div class="w-full flex flex-col gap-3 pt-5 absolute bottom-0 h-[20%] px-3">
		<div class="p-3 border border-slate-500 rounded-lg">
			<span class="text-2xl font-base">
				Total: <span class="font-semibold">$ {formatMoney(totalAmount.toString())}</span>
			</span>
		</div>
		<button class="btn variant-filled p-4 font-bold rounded-lg">Buy now</button>
	</div>
</div>
