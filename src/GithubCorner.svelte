<script lang="ts">
	export let user: string ='SynCap';
	export let project: string = 'svelte-vite-crypto';
	export let title: string = 'Fork me on GitHub';
</script>

<template lang="pug">

a.github-corner(
	href='https://github.com/{user}/{project}'
	target='_blank'
	'{title}'
)
	svg(viewbox='0 0 64 64')
		path(d='M0 0h64v64')
		path.octo-arm(d='M32.614 28.16c-3.737-2.355-2.406-4.992-2.406-4.992.768-1.792.384-2.816.384-2.816-.256-1.587.768-.512.768-.512 1.024 1.203.512 2.816.512 2.816-.563 2.662 1.28 3.789 2.304 4.147')
		path.octo-body(d='M28.98 29.26s.92.41 1.202.154l3.84-3.507c.768-.614 1.536-.768 2.1-.691-2.048-2.867-3.584-6.4.768-10.496a6.06 6.06 0 014.147-1.638c.153-.41.921-1.87 3.02-2.74 0 0 1.153.692 1.741 4.224a16.69 16.69 0 013.072 2.51c.845.895 1.716 2.047 2.202 3.148 3.584.768 4.3 2.048 4.3 2.048-.87 2.048-2.406 2.816-2.918 2.816 0 1.485-.588 2.816-1.92 3.968-4.198 4.096-7.68 2.304-10.24.051 0 .768-.256 1.792-1.33 2.816l-3.406 2.816c-.256.256.128 1.357.205 1.28l-6.784-6.758z')

</template>

<style lang="stylus">

.github-corner
	--color-octocat #eeeeee
	--color-corner alpha(#333, .6)
	display block
	width 10vmin
	height @width
	position absolute
	right 0
	top 0
	clip-path polygon(0 0, 100% 0, 100% 100%)

	svg
		color var(--color-octocat)
		fill var(--color-corner)
		opacity .7

		[data-theme='dark'] &
			mix-blend-mode soft-light

		.octo-arm
			fill var(--color-octocat)

		.octo-body
			fill var(--color-octocat)

	&:hover .octo-arm
		animation: octocat-wave 2s infinite

@keyframes octocat-wave
	0%, 100%
		transform: rotateZ(0)
	20%, 60%
		transform: rotateZ(-20deg) translate(-12px, 12px)
	40%, 80%
		transform: rotateZ(10deg) translate(6px, -6px)

</style>
