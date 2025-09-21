<script lang="ts">
	import type { LapData } from '$lib/data/parsers';
	import { tooltip } from '$lib/tools/Tooltip';

	import { Chart } from 'svelte-echarts';
	import { init, use } from 'echarts/core';
	import { LineChart } from 'echarts/charts';
	import { GridComponent, TitleComponent, TooltipComponent } from 'echarts/components';
	import { CanvasRenderer } from 'echarts/renderers';

  use([LineChart, GridComponent, CanvasRenderer, TitleComponent, TooltipComponent])

  export let laps: LapData[] = [];

	function msToTime(ms: number): string {
		const date = new Date(ms);
		return `${date.getHours() - 1}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
	}

	function buildTooltipText(lap: LapData): string {
		const driver = lap.driverName || lap.driverId;
		const raceTimeBefore = msToTime(lap.raceTime);
		const lapTime = msToTime(lap.lapTime);
		return `${driver} \
      <br/>Team Lap Num: ${lap.lapNum} \
      <br/>Race time: ${raceTimeBefore} \
      <br/>Lap Duration: ${lapTime}`;
	}

	const options = {
		title: {
			show: false,
      itemGap: 0
		},
		xAxis: {
      type: "category",
      data: laps.map(lap => msToTime(lap.raceTime))
    },
		yAxis: {
			type: 'value',
      min: 'dataMin',
      max: 'dataMax'
		},
		series: [
			{
				type: 'line',
        name: 'Lap time',
				data: laps.map(lap => lap.lapTime)
			}
		],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    }
	};
</script>

<div id="lap-timeline">
	<Chart {init} {options} />
</div>

<style>
	div {
    width: 100%;
		height: 400px;
	}
</style>
