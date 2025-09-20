<script lang="ts">
	import { navigating } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
  import Nav from '$lib/layout/Nav.svelte';
  import PreloadingIndicator from '$lib/layout/PreloadingIndicator.svelte';
  import "../app.css";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Race analyser</title>
</svelte:head>

{#if navigating.to}
	<PreloadingIndicator />
{/if}

<div class="flex justify-center">
  <div class="bg-gray-100 flex-1 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm ">
    <Nav />
    <main class="p-4 overflow-auto">
      {@render children?.()}
    </main>
  </div>
</div>
