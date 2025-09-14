<script lang="ts">
  import { onMount } from 'svelte';
  let files: string[] = [];
  let selected: string = '';

  onMount(async () => {
    const res = await fetch('/data/laps/laps_files.json');
    files = await res.json();
  });

  function selectFile(file: string) {
    selected = file;
  }
</script>

<div>
  <h3 class="font-bold mb-2">Fichiers disponibles</h3>
  <ul>
    {#each files as file}
      <li>
        <button
          class="w-full text-left py-2 px-2 hover:bg-gray-700"
          on:click={() => selectFile(file)}
          class:selected={selected === file}
        >
          {file}
        </button>
      </li>
    {/each}
  </ul>
</div>

