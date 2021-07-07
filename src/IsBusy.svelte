<script lang="ts">
	export let active: boolean = false;
	export let msg: string = 'Loading ...'
</script>

<template lang="pug">

	.overlay(class:active)
		.box
			.loader
				.timer
			.msg {msg}

</template>

<style lang="stylus">
	.overlay
		position fixed
		top 0
		left 0
		bottom 0
		right 0
		display none
		background-color rgba(0,0,0,.5)

		&.active
			display flex

	.box
		display flex
		flex-flow column
		width 100px
		background-color rgba(0, 0, 0, 0.5)
		border-radius 0.3rem
		text-align center
		margin auto
		padding .5rem

	.msg
		color white

	.loader
		width 100px
		height @width
		margin auto
		display flex

		& > *
			margin auto

		/* Timer */
		.timer
			width 90%
			height @width
			background-color transparent
			box-shadow inset 0px 0px 0px 2px #fff
			border-radius 50%
			position relative
			margin auto

			/* Not necessary- its only for layouting */
			&:after, &:before
				position absolute
				content ''
				background-color #fff
				height 2px
				top 50%
				left @top
				transform-origin 1px 1px

			&:after
				width 40%
				animation minhand 2s linear infinite

			&:before
				width 30%
				animation hrhand 8s linear infinite

		@keyframes minhand
			0%
				transform rotate(0deg)

			100%
				transform rotate(360deg)

		@keyframes hrhand
			0%
				transform rotate(0deg)

			100%
				transform rotate(360deg)


</style>
