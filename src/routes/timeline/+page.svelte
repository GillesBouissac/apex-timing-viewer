<script lang="ts">
    import { onMount } from 'svelte';
    import { readLapsFile, type LapData } from '$lib/data/parsers';
    import { getLapsFilesList } from '$lib/data/laps_files';
    import LapTimeline from '$lib/charts/LapTimeline.svelte';

    let laps: LapData[] = [];
    let teamFiles: string[] = [];
    let loading = true;

    // Récupère la liste des fichiers d'Ã©quipes
    async function fetchTeams() {
      teamFiles = await getLapsFilesList();
      if (teamFiles.length > 0) {
        await fetchLaps(teamFiles[42]);
      }
      loading = false;
    }

    // Charge les données L de la première équipe
    async function fetchLaps(filename: string) {
      const teamData = await readLapsFile(filename);
      laps = teamData.laps
        .filter(lap => lap.lapNum!==undefined)
//        console.log(filename, laps);
    }

    onMount(fetchTeams);
</script>

<div role="document" class="grid grid-cols-6 gap-4 text-center p-6" >
    <div class="page-card p-4">01</div>
    <div class="page-card p-4">02</div>
    <div class="col-span-2 page-card p-4">03</div>
    <div class="col-span-2 page-card p-4">04</div>
    <div class="col-span-6 page-card p-0 h-200">
    {#if loading}
        <div>Chargement...</div>
    {:else}
        <LapTimeline {laps} />
    {/if}
    </div>
</div>



