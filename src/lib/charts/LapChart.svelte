<script lang="ts">
  export let laps: { lapNum: string, lapTime: string, lapType?: string }[] = [];
</script>

<div class="bg-white rounded shadow p-4">
  <h3 class="font-bold mb-2">Chronos des tours</h3>
  <svg width="100%" height="120" viewBox="0 0 4000 120">
    {#each laps as lap, i}
      <circle
        cx={20 + i * 30}
        cy={100 - Math.min(+lap.lapTime / 1000, 90)}
        r="4"
        fill={lap.lapType === 'g' ? '#38bdf8' : lap.lapType === 'p' ? '#f59e42' : lap.lapType === 'b' ? '#ef4444' : '#888'}
      />
      <text x={20 + i * 30} y="115" font-size="10" text-anchor="middle">{lap.lapNum}</text>
    {/each}
  </svg>
</div>

<style>
  circle {
    transition: fill 0.3s;
  }
  circle:hover {
    fill: #000 !important;
    r: 6;
  }
  div {
    width: 1200px;
  }
</style>
