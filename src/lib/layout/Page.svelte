<script>
  import { cubicInOut } from "svelte/easing";
  import { fade, fly } from "svelte/transition";

  export let title = "";
  export let offsetX;
</script>

<!-- TODO: Items fade out transition -->
{#key title}
  <section class="container" style="padding-top: {offsetX}px">
    <h1
      class="h1"
      in:fly={{ x: 200, duration: 1000, easing: cubicInOut }}
      out:fade
    >
      {title}
    </h1>
    <section
      class="content"
      in:fly={{ y: 200, duration: 1000, easing: cubicInOut }}
      out:fade
    >
      <slot/>
    </section>
  </section>
{/key}