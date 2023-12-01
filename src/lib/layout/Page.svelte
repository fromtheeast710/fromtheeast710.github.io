<script>
  import { cubicInOut } from "svelte/easing";
  import { fade, fly } from "svelte/transition";

  export let title = "";
  export let offsetX;
</script>

<div class="container" style="padding-top: {offsetX}px">
  <h1
    class="h1"
    in:fly={{ x: 200, duration: 1000, easing: cubicInOut }}
    out:fly={{ x: -200, duration: 1000, easing: cubicInOut }}
  >
    {title}
  </h1>
  <div
    class="content"
    in:fly={{ y: 200, duration: 1000, easing: cubicInOut }}
    out:fade
  >
    <slot/>
  </div>
</div>
