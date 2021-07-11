<script lang='ts'>
	// src/LineSpark.svelte

	import type {TCoinHistory, TMinMax} from './global';

	import { scaleLinear } from 'd3-scale';
	export let history: TCoinHistory = [];

	export let width: number = 250;
	export let height: number = 50;

	// const xScale = v => v * width / (maxX - minX)

	const padding: number = 1;

	$: xScale =	scaleLinear()
		.domain([minX, maxX])
		.range([padding, width - padding]);

	$: yScale = scaleLinear()
		.domain([minY, maxY])
		.range([height - 2*padding, 2*padding]);

	$: minimaxY = history.reduce( (m: TMinMax, v: number[]) => {
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

<svg class="line-spark" preserveAspectRatio="none" viewBox="0 0 {width} {height}">
	<path class="path-line" d={path} />
	<path class="path-area" d={area} />
</svg>

<style lang='stylus'>

	svg.line-spark
		width 100%
		height @width
		background alpha(black, .1)

	.path

		&-line
			fill none
			stroke var(--color-accent)
			stroke-linejoin round
			stroke-linecap round
			stroke-width 1px

		&-area
			fill var(--color-accent)
			opacity .2
			stroke none

</style>
