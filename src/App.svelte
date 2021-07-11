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
			font-weight 100

			&:before
				content '\0a'
				background transparent no-repeat center / cover
				background-image url('data:image/svg+xml;charset=UT-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2243%22 height=%2242%22%3e%3cg fill=%22none%22 fill-rule=%22evenodd%22%3e%3cpath fill=%22%23FFB347%22 d=%22M9.844 30.739l-4.328 4.292C1.958 31.19 0 26.172 0 20.888c0-5.61 2.178-10.859 6.133-14.78a21.186 21.186 0 018.55-5.15l1.337 5.954a15.041 15.041 0 00-5.574 3.492 14.698 14.698 0 00-4.37 10.165 14.696 14.696 0 003.768 10.17%22/%3e%3cpath fill=%22%23FF9332%22 d=%22M21.026 20.882L16.449.487a21.22 21.22 0 0110.395.344 21.414 21.414 0 019.141 5.357 20.715 20.715 0 015.415 9.29c.876 3.244.949 6.687.212 9.962l-20.586-4.558z%22/%3e%3cpath fill=%22%23EA5237%22 d=%22M31.557 38.954c-4.9 2.805-10.572 3.559-15.974 2.125a21.228 21.228 0 01-8.806-4.799l4.328-4.291a14.981 14.981 0 009.92 3.725 14.914 14.914 0 0010.567-4.342 14.868 14.868 0 003.518-5.518l6.027 1.334c-1.578 4.956-4.977 9.13-9.58 11.766%22/%3e%3c/g%3e%3c/svg%3e')
				display inline-block
				width 1em
				margin-right 0.25em
				height 1em
				margin 0 .25em
				vertical-align text-bottom

			b
				font-weight 400

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
