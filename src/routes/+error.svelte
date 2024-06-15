<script>
	import { page } from '$app/stores';
	import { icons } from '$lib/utils/icons';
</script>

<div class=" h-[100vh] relative flex flex-col justify-center items-center">
	<div class="flex gap-4 justify-center items-center">
		<span class="w-24 p-3 border-black border-r-2"> {@html icons.linkBroken} </span>
		<div class="flex flex-col  gap-1">
			<span class="font-bold text-6xl">{$page.status}</span>
      <span class="text-2xl text-semibold">{$page.error?.message}</span>
		</div>
	</div>
	<div class="flex justify-center items-center absolute bottom-2 left-50 right-50">
		<a class="text-blue-600 font-bold uppercase underline" href="/">Home</a>
	</div>
</div>
