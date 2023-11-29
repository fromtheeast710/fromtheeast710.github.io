<script>
	import '../app.postcss';
	import LayeredWaves from '$lib/assets/LayeredWaves.svelte';
	import Keybinds from '$lib/layout/Keybinds.svelte';
</script>

<slot/>

<Keybinds/>

<LayeredWaves className="layered-waves"/>