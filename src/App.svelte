<script lang="ts">
	// src/App.svelte

	import CoinCard from './CoinCard.svelte';
	import IsBusy from './IsBusy.svelte';
	import ThemeSwitch from './ThemeSwitch.svelte';
	import { onMount } from 'svelte';

	let name: string = 'Crypto Tracker';

	let gridRows: number = 3;
	let fetchStart: number = 0;
	let fetchLimit: number = 10;
	let lenCoinList: number = 0;
	let isLoading: boolean = false;

	let coins: TCoin[] = [];

	$: {
		lenCoinList = coins.length ? coins.length : 0;
	}

	const urlFetch = (q: TFetchQuery = { start: fetchStart, limit: fetchLimit }): string =>
		`https://api.coinstats.app/public/v1/coins?skip=${q.start}&limit=${q.limit}`;

	function calcFetchLimit(): void {
		fetchLimit = gridRows * (0 | (document.querySelector('.coinlist').clientWidth / 336));
		console.log('fetchLimit: %d', fetchLimit);
	}

	async function fetchCoins(q: TFetchQuery = { start: fetchStart, limit: fetchLimit }): Promise<TCoinList> {

		isLoading = true;

		const res = await fetch(urlFetch(q))
			.then((response) => response.json())
			.then((data) => data.coins);

		window.setTimeout(ensureInView, 700);

		isLoading = false;

		return res;
	}

	async function fetchFirst(): Promise<void> {
		coins = await fetchCoins({ start: 0, limit: fetchLimit });
	}

	async function fetchMore(q: TFetchQuery = {start: fetchStart, limit: fetchLimit}): Promise<void> {
		if (q.start < 0) q.start = 0;
		fetchStart = q.start ?? fetchStart + fetchLimit;
		coins = await fetchCoins({ start: fetchStart, limit: q.limit ?? fetchLimit });
	}

	function fetchBack() {
		fetchMore({ start: fetchStart - fetchLimit });
	}

	function fetchThis() {
		fetchMore()
	}

	function ensureInView() {
		document.getElementById('controls').scrollIntoView({
			behavior: 'smooth',
			block: 'end',
			inline: 'nearest',
		});
	}

	function debounce(func: () => void, wait: number = 1000, immediate: boolean = false) {
		var timeout: ReturnType<typeof setTimeout>;
		return function () {
			var context = this,
				args = arguments;
			clearTimeout(timeout);
			timeout = setTimeout(function () {
				timeout = null;
				if (!immediate) func.apply(context, args);
			}, wait);
			if (immediate && !timeout) func.apply(context, args);
		};
	}

	onMount(() => {
		calcFetchLimit();
		fetchFirst();

		window.onresize = debounce(handleOnResize);
	});

	function handleOnResize() {
		calcFetchLimit();
		fetchMore({ limit: fetchLimit - (coins.length % fetchLimit) });
	}
</script>

<template lang="pug">
mixin barControls
	#controls.controls
		button(on:click='{ fetchFirst }') &lang;&lang; &lang;&lang;
		button(on:click='{ fetchBack }') &lang;&lang;
		button(on:click='{ fetchMore }') &rang;&rang;
		button(on:click='{ fetchThis }') &#10227;

main
	h1 {name}

	article.coinlist
		+each('coins as coin')
			CoinCard({coin})

	+if('coins.length')
		+barControls

footer
	.hellobuddy &copy;2021,
		=' '
		a(href='https://syncap.tk') SynCap

	.knobs
		ThemeSwitch

IsBusy(active='{isLoading}')

</template>

<style lang="stylus">

	a
		color var(--color-primary)

	h1
		text-align center
		font-size 4rem
		font-weight 400
		color var(--color-accent)

	footer
		margin 0 auto
		min-width 20rem
		padding 1rem 0
		display flex
		box-shadow 0 -.5rem 1rem rgba(0,0,0,.2)
		border-radius .5rem

		& > *
			margin auto

	.coinlist
		display grid
		grid-template-columns repeat(auto-fit, minmax(20rem, 1fr))
		gap 1rem

	.controls
		display flex
		justify-content center
		column-gap 2rem
		margin 2rem 0

		button
			font-weight bold
			background-color blue
			border 2px solid transparent
			border-radius 1rem
			color white
			padding 1rem 2rem
			line-height 1
			box-shadow 0 .5rem 1rem rgba(0,0,0,0.4)
			cursor pointer

</style>
