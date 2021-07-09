import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import { transformSync } from 'esbuild';

const production = process.env.NODE_ENV === 'production';

console.log('READ vite.config.js');

export default defineConfig({
	root: 'src/',
	build: {
		outDir: '../dist/',
		emptyOutDir: true,
	},
	server: {
		host: process.env.VITE_HOST ?? 'localhost',
		port: process.env.VITE_PORT ?? 3000,
		minify: production,
	},
	plugins: [
		svelte({
			useVitePreprocess: true,
			preprocess: sveltePreprocess({
				sourceMap: !production,
				stylus: {
					prependData: `@require 'src/styles/global.styl'\n`,
				},
				postcss: {
					plugins: [require('autoprefixer')()]
				}
			}),
		}),
	],
});
