<script lang='ts'>
	// src/LineSpark.svelte

	import type {TCoinHistory, TMinMax} from './global';

	import { scaleLinear } from 'd3-scale';
	export let history: TCoinHistory;

	let width: number = 250;
	let height: number = 50;

	// const xScale = v => v * width / (maxX - minX)

	const padding: number = 1;

	$: xScale =	scaleLinear()
		.domain([minX, maxX])
		.range([padding, width - padding]);

	$: yScale = scaleLinear()
		.domain([minY, maxY])
		.range([height - padding, padding]);

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
	$: area = `${path}L${xScale(maxX)},${yScale(minY)}L${xScale(minX)},${yScale(minY)}Z`;

</script>

<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
	<svg preserveAspectRatio="none" {width} {height}>
		<path class="path-line" d={path} />
		<path class="path-area" d={area} />
	</svg>
</div>

<style lang='stylus'>

	.chart
		width 100%
		max-width 500px
		margin-left auto
		margin-right auto

	svg
		position relative
		width 100%
		height 100%
		overflow visible
		background #000

	.path

		&-line
			fill none
			stroke hsl(150,70%,50%)
			stroke-linejoin round
			stroke-linecap round
			stroke-width 2.5

		&-area
			fill hsla(170,70%,50%,.3)
			stroke none

</style>
