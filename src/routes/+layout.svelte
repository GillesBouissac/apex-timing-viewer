<script lang="ts">
	import Menu from '$lib/layout/Menu.svelte';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
	let menuOpen = $state(false);
	function toggleMenu() {
		menuOpen = !menuOpen;
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-screen">
  <!-- Mobile menu button -->
  <div class="md:hidden absolute top-2 left-2 z-10">
    <button onclick={toggleMenu} class="bg-gray-800 text-white px-3 py-2 rounded">
      ☰ Menu
    </button>
  </div>
  <!-- Mobile drawer -->
  {#if menuOpen}
    <nav class="fixed inset-0 bg-gray-900 bg-opacity-80 z-20 flex flex-col w-2/3 max-w-xs p-4">
      <button onclick={toggleMenu} class="self-end mb-4 text-white">✕</button>
      <h2 class="font-bold mb-4 text-white">Paramètres</h2>
      <ul>
        <li><button class="w-full text-left py-2 px-2 hover:bg-gray-700">Fichier</button></li>
        <li><button class="w-full text-left py-2 px-2 hover:bg-gray-700">Affichage</button></li>
        <li><button class="w-full text-left py-2 px-2 hover:bg-gray-700">Aide</button></li>
      </ul>
    </nav>
  {/if}
  <!-- Main content -->
  <main class="flex-1 bg-gray-100 p-4 overflow-auto">
	{@render children?.()}
  </main>
</div>
