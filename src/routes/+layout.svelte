<script>
	import '../app.postcss';
	import LayeredWaves from '$lib/assets/layered-waves.svelte';
</script>

<slot/>

<LayeredWaves class="stack"/>

<style>
	.stack {
		aspect-ratio: 960/300;
		width: 100%;
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
	}
</style>