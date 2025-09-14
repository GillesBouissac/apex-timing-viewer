<script lang="ts">
  import { onMount } from 'svelte';
  import LapChart from '$lib/charts/LapChart.svelte';
  import { readLapsFile } from '$lib/data/parsers';

  let laps: { lapNum: string, lapTime: string, lapType?: string }[] = [];
  let teamFiles: string[] = [];
  let loading = true;

  // Récupère la liste des fichiers d'équipes
  async function fetchTeams() {
    const res = await fetch('/data/laps/laps_files.json');
    teamFiles = await res.json();
    if (teamFiles.length > 0) {
      await fetchLaps(teamFiles[0]);
    }
    loading = false;
  }

  // Charge les données L de la première équipe
  async function fetchLaps(filename: string) {
    const lines = await readLapsFile(filename);
    laps = lines
      .filter(line => line.type === 'L')
      .map(line => ({
        lapNum: line.lapNum,
        lapTime: line.lapTime,
        lapType: line.lapType
      }))
      .sort((a, b) => Number(a.lapNum) - Number(b.lapNum)); // Tri croissant sur lapNum
  }

  onMount(fetchTeams);
</script>

{#if loading}
  <div>Chargement…</div>
{:else}
  <div class="grid md:grid-cols-2 gap-4">
    <LapChart {laps} />
    <!-- FileMenu / -->
  </div>
{/if}

