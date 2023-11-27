<script>
	import '../app.postcss';
	import LayeredWaves from '$lib/assets/LayeredWaves.svelte';
	import Keybinds from '$lib/layout/Keybinds.svelte';
	import Navbar from '$lib/layout/Navbar.svelte';
	import { showNavbar } from '$lib/scripts/utils';
</script>

<slot/>

{#if $showNavbar}
	 <Navbar/>
{/if}

<Keybinds/>

<LayeredWaves className="layered-waves"/>