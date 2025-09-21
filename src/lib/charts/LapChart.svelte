<script lang="ts">
	import type { LapData } from '$lib/data/parsers';
	import { tooltip } from '$lib/tools/Tooltip';

  export let laps: LapData[] = [];

  function msToTime(ms: number): string {
    const date = new Date(ms);
    return `${date.getHours()-1}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
  }

  function buildTooltipText(lap: LapData): string {
    const driver = lap.driverName || lap.driverId
    const raceTimeBefore = msToTime(lap.raceTime)
    const lapTime = msToTime(lap.lapTime)
    return `${driver} \
      <br/>Team Lap Num: ${lap.lapNum} \
      <br/>Race time: ${raceTimeBefore} \
      <br/>Lap Duration: ${lapTime}`;
  }

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
        use:tooltip
        title={buildTooltipText(lap)}
      />
      <text
        x={20 + i * 30}
        y="115"
        font-size="10"
        text-anchor="middle"
        use:tooltip
        title={msToTime(lap.raceTime)}
      >{msToTime(lap.raceTime)}</text>
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
