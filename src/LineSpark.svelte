<script lang='ts'>
	// src/LineSpark.svelte

	import type {TCoinHistory} from './global';

	import { scaleLinear } from 'd3-scale';

	export let history: TCoinHistory;

	let width = 500;
	let height = 500;

	// const xScale = v => v * width / (maxX - minX)

	$: xScale =	scaleLinear()
		.domain([minX, maxX])
		.range([0, width]);

	$: yScale = scaleLinear()
		.domain([minY, maxY])
		.range([height, 0]);

	$: minimaxY = history.reduce( (m, v) => {
				return {
					min: (v[1] < m.min ? v[1] : m.min),
					max: (v[1] > m.max ? v[1] : m.max) }
				},
			{min: Infinity , max: 0}
		)

	$:	minY = minimaxY.min;
	$:	maxY = minimaxY.max;

	$: minX = history[0][0];
	$: maxX = history[history.length - 1][0];

	$: path = `M${history.map(p => `${xScale(p[0])},${yScale(p[1])}`).join('L')}`;
	// $: area = `${path}L${xScale(maxX)},${yScale(0)}L${xScale(minX)},${yScale(0)}Z`;

</script>

<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
	<svg {width} {height}>
		<!-- data -->
		<path class="path-line" d={path}></path>
	</svg>
</div>

<style>
	.chart {
		width: 100%;
		max-width: 500px;
		margin-left: auto;
		margin-right: auto;
	}

	svg {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: visible;
		background: #000;
	}

	.path-line {
		fill: none;
		stroke: hsl(150,70%,50%);
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 5;
	}

</style>
