import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
const SVELTE_IMPORTS = [
	'svelte/animate',
	'svelte/easing',
	'svelte/internal',
	'svelte/motion',
	'svelte/store',
	'svelte/transition',
	'svelte'
];

export default defineConfig(({ command, mode }) => {
	console.log('command: %s, mode: %s', command, mode);
	const isProduction = mode === 'production';
	return {
		root: 'src/',
		build: {
			outDir: '../dist/',
			emptyOutDir: true,
		},
		server: {
			host: process.env.VITE_HOST ?? 'localhost',
			port: process.env.VITE_PORT ?? 3000,
			minify: isProduction,
		},
		optimizeDeps: {
			include: [...SVELTE_IMPORTS]
		},
		plugins: [
			svelte({
				useVitePreprocess: true,
				preprocess: sveltePreprocess({
					sourceMap: !isProduction,
					stylus: {
						prependData: `@require 'src/styles/global.styl'\n`,
					},
					postcss: {
						plugins: [require('autoprefixer')()]
					},
					pug: {
						compileDebug: !isProduction,
						pretty: !isProduction,
					}
				}),
			}),
		],
	}
});
