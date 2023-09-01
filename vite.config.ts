import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import '$lib/assets/scss/abstracts/_variables.scss';
          @import '$lib/assets/scss/abstracts/_mixins.scss';
        `,
      }
    },
  },
});
