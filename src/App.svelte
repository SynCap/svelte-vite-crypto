<script lang="ts">
	// src/App.svelte

	import type {TCoin, TCoinList, TCoinQuery, THistoryQuery, TChartPeriod} from './global';
	import CoinCard from './CoinCard.svelte';
	import IsBusy from './IsBusy.svelte';
	import ThemeSwitch from './ThemeSwitch.svelte';
	import GithubCorner from './GithubCorner.svelte';
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

	const defaultPeriod: TChartPeriod = '1w';
	const defaultCoinId: string = 'bitcoin';

	const urlCoins = (q: TCoinQuery = { start: fetchStart, limit: fetchLimit }): string =>
		`https://api.coinstats.app/public/v1/coins?skip=${q.start}&limit=${q.limit}`;

	const urlHistory = (q: THistoryQuery = {period: defaultPeriod, coinId: defaultCoinId}): string =>
		`https://api.coinstats.app/public/v1/charts?period=${q.period}&coinId=${q.coinId}`;

	function calcFetchLimit(): void {
		fetchLimit = gridRows * (0 | (document.querySelector('.coinlist').clientWidth / 336));
		console.log('fetchLimit: %d', fetchLimit);
	}

	async function fetchCoins(q: TCoinQuery = { start: fetchStart, limit: fetchLimit }): Promise<TCoinList> {

		isLoading = true;

		const res = await fetch(urlCoins(q))
			.then((response) => response.json())
			.then((data) => data.coins);

		res.history = await fetch(urlHistory({coinId: res.id}))
			.then((response) => response.json())
			.then(data => data.chart)

		window.setTimeout(ensureInView, 700);

		isLoading = false;

		return res;
	}

	async function fetchFirst(): Promise<void> {
		coins = await fetchCoins({ start: 0, limit: fetchLimit });
	}

	async function fetchMore(q: TCoinQuery = {start: fetchStart, limit: fetchLimit}): Promise<void> {
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
	.info
		| Data by
		=' '
		a.coinstats(href='https://www.coinstats.app' target='_new') Coin
			b Stats
	.knobs
		ThemeSwitch

IsBusy(active='{isLoading}')
GithubCorner

</template>

<style lang="stylus">

	a
		color var(--color-primary)

		&.coinstats
			color var(--color-accent)

			&:before
				content '\0a'
				background-image url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MyIgaGVpZ2h0PSI0MiI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjRkZCMzQ3IiBkPSJNOS44NDQgMzAuNzM5bC00LjMyOCA0LjI5MkMxLjk1OCAzMS4xOSAwIDI2LjE3MiAwIDIwLjg4OGMwLTUuNjEgMi4xNzgtMTAuODU5IDYuMTMzLTE0Ljc4YTIxLjE4NiAyMS4xODYgMCAwMTguNTUtNS4xNWwxLjMzNyA1Ljk1NGExNS4wNDEgMTUuMDQxIDAgMDAtNS41NzQgMy40OTIgMTQuNjk4IDE0LjY5OCAwIDAwLTQuMzcgMTAuMTY1IDE0LjY5NiAxNC42OTYgMCAwMDMuNzY4IDEwLjE3Ii8+PHBhdGggZmlsbD0iI0ZGOTMzMiIgZD0iTTIxLjAyNiAyMC44ODJMMTYuNDQ5LjQ4N2EyMS4yMiAyMS4yMiAwIDAxMTAuMzk1LjM0NCAyMS40MTQgMjEuNDE0IDAgMDE5LjE0MSA1LjM1NyAyMC43MTUgMjAuNzE1IDAgMDE1LjQxNSA5LjI5Yy44NzYgMy4yNDQuOTQ5IDYuNjg3LjIxMiA5Ljk2MmwtMjAuNTg2LTQuNTU4eiIvPjxwYXRoIGZpbGw9IiNFQTUyMzciIGQ9Ik0zMS41NTcgMzguOTU0Yy00LjkgMi44MDUtMTAuNTcyIDMuNTU5LTE1Ljk3NCAyLjEyNWEyMS4yMjggMjEuMjI4IDAgMDEtOC44MDYtNC43OTlsNC4zMjgtNC4yOTFhMTQuOTgxIDE0Ljk4MSAwIDAwOS45MiAzLjcyNSAxNC45MTQgMTQuOTE0IDAgMDAxMC41NjctNC4zNDIgMTQuODY4IDE0Ljg2OCAwIDAwMy41MTgtNS41MThsNi4wMjcgMS4zMzRjLTEuNTc4IDQuOTU2LTQuOTc3IDkuMTMtOS41OCAxMS43NjYiLz48L2c+PC9zdmc+')
				display inline-block
				margin-right .25em

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
