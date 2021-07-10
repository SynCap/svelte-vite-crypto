<script lang="ts">
	// src/App.svelte

	import type {TCoin, TCoinList, TFetchQuery} from './global';
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

svlete:head
	title Crypto Tracker

main
	h1 {name}

	article.coinlist
		+each('coins as coin')
			CoinCard({coin})

	+if('coins.length')
		+barControls

footer
	.hellobuddy
		a(href='https://github.com/syncap/svelte-vite-crypto' target='_blank')
			i.github
			| GitHub

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

		.hellobuddy

			a
				text-decoration none

			.github
				content ''
				display inline-block
				vertical-align middle
				background url('data:image/svg+xml;charset=UT-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 fill-rule=%22evenodd%22 stroke-linejoin=%22round%22 stroke-miterlimit=%222%22 clip-rule=%22evenodd%22 viewBox=%220 0 400 400%22%3e%3cg fill-rule=%22nonzero%22%3e%3cpath fill=%22%23016ec5%22 d=%22M200 400C89.5 400 0 310.5 0 200S89.5 0 200 0s200 89.5 200 200-89.6 200-200 200z%22/%3e%3cpath fill=%22%23002b59%22 d=%22M391.589 142.4C397.061 160.638 400 179.974 400 200c0 110.5-89.6 200-200 200-73.54 0-137.778-39.641-172.524-98.731L391.589 142.4z%22/%3e%3cpath fill=%22%23fff%22 d=%22M200 400C89.5 400 0 310.5 0 200S89.5 0 200 0s200 89.5 200 200-89.6 200-200 200zm-.1-388c-102.7 0-186 83.3-186 186 0 82.2 53.3 151.9 127.2 176.5 9.3 1.7 12.7-4 12.7-8.9 0-4.4-.2-19.1-.3-34.6-51.8 11.3-62.7-22-62.7-22-8.5-21.5-20.7-27.2-20.7-27.2-16.9-11.5 1.3-11.3 1.3-11.3 18.7 1.3 28.5 19.2 28.5 19.2 16.6 28.4 43.5 20.2 54.1 15.5 1.7-12 6.5-20.2 11.8-24.9-41.3-4.7-84.8-20.7-84.8-91.9 0-20.3 7.3-36.9 19.2-49.9-1.9-4.7-8.3-23.6 1.8-49.2 0 0 15.6-5 51.2 19.1 14.8-4.1 30.8-6.2 46.6-6.3 15.8.1 31.7 2.1 46.6 6.3 35.5-24.1 51.1-19.1 51.1-19.1 10.1 25.6 3.8 44.5 1.8 49.2 11.9 13 19.1 29.6 19.1 49.9 0 71.5-43.5 87.2-84.9 91.8 6.7 5.8 12.6 17.1 12.6 34.5 0 24.9-.2 44.9-.2 51.1 0 5 3.3 10.8 12.8 8.9 73.9-24.6 127.1-94.3 127.1-176.5C386 95.3 302.7 12 199.9 12z%22/%3e%3c/g%3e%3c/svg%3e') no-repeat
				background-size contain
				height 1.5rem
				width @height

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
