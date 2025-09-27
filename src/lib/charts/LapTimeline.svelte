<script lang="ts">
	import type { LapData } from '$lib/data/parsers';

	import { Chart } from 'svelte-echarts';
	import { init, use } from 'echarts/core';
	import { LineChart } from 'echarts/charts';
	import {
		GridComponent,
		TitleComponent,
		TooltipComponent,
		DataZoomComponent
	} from 'echarts/components';
	import { CanvasRenderer } from 'echarts/renderers';

	use([
		LineChart,
		GridComponent,
		CanvasRenderer,
		TitleComponent,
		TooltipComponent,
		DataZoomComponent
	]);

	export let laps: LapData[] = [];

	function msToHour(ms: number): string {
		const date = new Date(ms);
		return `${date.getHours() - 1}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
	}

	function msToMins(ms: number): string {
		const date = new Date(ms);
		return `${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
	}

	function buildTooltipText(params: any): string {
		const lap = params[0].data;
		const driver = lap.driverName || lap.driverId;
		const raceTimeBefore = msToHour(lap.raceTime);
		const lapTime = msToHour(lap.lapTime);
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
			type: 'category',
			data: laps.map((lap) => msToHour(lap.raceTime))
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
				data: laps
			}
		],
		dataZoom: [
			{
				type: 'slider',
				show: true,
				xAxisIndex: [0],
				start: 0,
				end: 10
			},
			{
				type: 'slider',
				show: true,
				filterMode: 'none',
				yAxisIndex: [0],
				start: 0,
				end: 10
			},
			{
				type: 'inside',
				xAxisIndex: [0]
			},
			{
				type: 'inside',
				yAxisIndex: [0]
			}
		],
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			},
			formatter: buildTooltipText
		}
	};
</script>

<div id="lap-timeline">
	<Chart {init} {options} />
</div>

<style>
	div {
		width: 100%;
		height: 100%;
	}
</style>
