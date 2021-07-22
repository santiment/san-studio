const sveltePreprocess = require('svelte-preprocess')
const cssModules = require('svelte-preprocess-cssmodules')

module.exports = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [cssModules(), sveltePreprocess()],
}
