<script lang="ts">
	// src/ConCard.svelte

	import LineSpark from './LineSpark.svelte';

	import type {TCoin} from './global';

	export let coin: TCoin;

	let neg: boolean = false;
	$: {neg = coin.priceChange1d < 0}

</script>

<template lang="pug">
.card
	h3.title()
		span.rank { coin.rank }
		img.icon(src='{coin.icon}' alt='{coin.name} icon')
		+if('coin.websiteUrl !== undefined')
			a(href='{ coin.websiteUrl }' target='_new') {coin.name}
			+else()
				span.name {coin.name}
		span.symbol {coin.symbol}
	.visual
		//- LineSpark(history='{coin.history}')
	.data
		.volume(title='Volume') { (coin.volume).toLocaleString('en-us', {style:'currency', currency: 'usd'}) }
		.change(title='change' class:neg) { coin.priceChange1d }%
		.price(title='Price, USD') { (coin.price).toLocaleString('en-us',{style: 'currency', currency: 'usd'}) }
</template>

<style lang="stylus">
	.card
		min-width 20rem
		margin auto
		box-shadow 0 0.5rem 1rem rgba(0 0 0 , .3)
		padding 1rem
		border-radius .5rem
		border-top 0.15px solid silver

		.visual
			overflow auto
			resize vertical
			height 3rem
			min-height 2.5rem
			max-height 7rem
			margin .3rem 0

		.title
			display flex
			gap 1rem
			font-weight 700
			font-size 1.3rem

			.icon
				height 1.5rem

			a
				text-decoration underline
				color inherit
				text-decoration-style dotted
				flex-grow 1

			.symbol
				color gray
				text-align right

		.data
			font-size .9rem
			font-weight 300
			display flex
			justify-content space-between

		.volume
			color green

		.change, .rank
			color #fff
			padding 0 0.5em

		.rank
			background-color: #bbb;
			color var(--color-bg)
			border-radius: 0.4rem;
			font-size: 0.7rem;
			font-weight: 300;
			line-height: 1.5;
			align-self: flex-start;

		.change
			background-color green
			border-radius .25em
			font-weight 700

			&.neg
				background-color hsl(0deg 80% 40%)

		.price
			font-weight 700
</style>
