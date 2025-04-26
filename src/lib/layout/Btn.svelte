<script>
  export let link = "";
  export let icon;
</script>

<button
  type="button"
  class="w-20 m-2 rounded-2xl btn-icon variant-ghost pointer-events-auto"
  on:click={() => (location.href = link)}
>
  <svelte:component this={icon} />
</button>
