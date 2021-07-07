import { defineConfig } from 'vite';
import { svelte } from './lib/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';

const production = process.env.NODE_ENV === 'production';

export default defineConfig({
	root: 'src/',
	build: {
		outDir: '../dist/',
		emptyOutDir: true,
	},
	server: {
		host: process.VITE_HOST ?? 'localhost',
		port: process.VITE_PORT ?? 3000,
	},
	plugins: [
		svelte({
			preprocess: sveltePreprocess({}),
			dev: !production,
			stylus: {
				prependData: `@import 'src/styles/global.styl'`
			},
			postcss: {
				plugins: [require('autoprefixer')()]
			}
		}),
	],
});
