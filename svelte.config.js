import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			// Le dossier 'build' sera généré pour le déploiement
			pages: 'build',
			assets: 'build',
			fallback: null
		}),
		paths: {
			base: '/apex-timing-viewer'
		}
	}
};

export default config;
