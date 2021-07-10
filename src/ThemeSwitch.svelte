<script lang='ts'>
// src/ThemeSwitch.svelte

type TThemeName = 'dark' | 'light'

const themeVarName: string = 'theme';

const checkTheme = (): TThemeName =>
	localStorage.getItem(themeVarName) ??
	window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';

let isDarkTheme: boolean = (checkTheme() === 'dark');

function setTheme(themeName: string): void {
	localStorage.setItem(themeVarName, themeName);
	document.documentElement.setAttribute('data-theme', themeName);
}

function toggleTheme(): void {
	isDarkTheme = !isDarkTheme;
	setTheme((isDarkTheme ? 'dark' : 'light'))
}

// set the theme on load

setTheme(checkTheme());

</script>

<template lang="pug">

	label.theme-switcher
		input#theme-switcher(type='checkbox', on:change='{toggleTheme}')
		span.slider

</template>

<style lang="stylus">

:global(:root)
	--color-fg: #333
	--color-bg: #fbfbfe
	--color-primary: #36c
	--color-accent: tomato

:global([data-theme='dark'])
	--color-fg: #eee
	--color-bg: #222
	--color-primary: #17ed90
	--color-accent: orange

:global(body)
	background-color var(--color-bg)
	color var(--color-fg)

/* The switch - the box around the slider */
.theme-switcher
	position: relative
	display: inline-block
	font-size: 5px
	width: 8em
	height: 4em

	/* The look of switcher */
	.slider
		position: absolute
		cursor: pointer
		top: 0
		left: 0
		right: 0
		bottom: 0
		background-color: #ccc
		transition: 0.4s
		font: inherit
		width: 100%
		border-radius: 2em

		// The thumb of switcher
		&:before
			position: absolute
			content: ''
			height: 5em
			width: @height
			left: 0px
			bottom: 0.1em
			top: 0
			bottom: 0
			margin: auto 0
			transition: 0.4s
			box-shadow: 0 0 0.25em #2020203d
			display: block
			border-radius: 50%
			box-shadow: 0.3em 0.3em 0.3em alpha(black, 0.3)
			background-color: #003
			background-repeat: no-repeat
			background-position: center
			background-size: 100%
			background-image: url('data:image/svg+xml;charset=UT-8,%3csvg viewBox=%220 0 300 300%22 version=%221.1%22 xmlns=%22http://www.w3.org/2000/svg%22 fill=%22%23ccc%22%3e%3cpath d=%22M56.824 65.705c-13.837 39.526-20.209 91.479 33.384 141.876 58.257 54.783 118.221 48.591 158.245 20.494-23.028 28.992-58.585 47.597-98.453 47.597-69.36 0-125.672-56.312-125.672-125.672 0-32.426 12.307-62 32.496-84.295zM242.958 108.705l7.072 21.766h22.887l-18.516 13.452 7.073 21.766-18.516-13.452-18.515 13.452 7.072-21.766L213 130.471h22.886l7.072-21.766zM146.39 37.213l7.073 21.766h22.886l-18.516 13.452 7.073 21.766-18.516-13.452-18.515 13.452 7.072-21.766-18.515-13.452h22.886l7.072-21.766z%22/%3e%3cpath d=%22M150.001 125.705l7.072 21.766h22.886l-18.515 13.452 7.072 21.766-18.515-13.452-18.516 13.452 7.073-21.766-18.516-13.452h22.887l7.072-21.766z%22/%3e%3c/svg%3e')

		[data-theme='dark'] &
			background-color: #2196f3

			&:before
				transform: translateX(3em)
				box-shadow: -0.3em 0.3em 0.3em alpha(black, 0.3)
				background-color: #fff
				background-image: url('data:image/svg+xml;charset=UT-8,%3csvg viewBox=%220 0 300 300%22 xmlns=%22http://www.w3.org/2000/svg%22 fill=%22%23fd0%22%3e%3cpath d=%22M150 299.999l-14.217-43.37c4.65.616 9.396.933 14.217.933 4.82 0 9.567-.317 14.216-.933L150 300zM238.36 271.946l-37.435-27.198a108.014 108.014 0 0023.145-16.782l14.29 43.98zM75.929 227.966a107.974 107.974 0 0023.145 16.782l-37.435 27.198 14.29-43.98zM150 62.48c48.856 0 88.52 39.216 88.52 87.52 0 48.302-39.664 87.518-88.52 87.518-48.857 0-88.522-39.216-88.522-87.519 0-48.303 39.665-87.518 88.522-87.518zM44.266 169.833a106.643 106.643 0 008.825 26.864l-45.437-.118 36.612-26.746zM292.345 196.58l-45.437.117a106.689 106.689 0 008.825-26.864l36.612 26.746zM52.816 103.874a106.717 106.717 0 00-8.674 26.964L7.028 103.874h45.788zM255.857 130.838a106.684 106.684 0 00-8.674-26.964h45.788l-37.114 26.964zM98.471 55.577a108.045 108.045 0 00-22.635 16.546L62.025 29.242l36.446 26.335zM224.163 72.123a107.996 107.996 0 00-22.635-16.546l36.446-26.335-13.81 42.88zM164.086 43.353A108.278 108.278 0 00150 42.437c-4.773 0-9.475.311-14.087.916L149.999 0l14.087 43.353z%22/%3e%3c/svg%3e')

	input
		/* Hide default HTML checkbox */
		display: none
		opacity: 0
		width: 0
		height: 0

</style>
