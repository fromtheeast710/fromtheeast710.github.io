<script lang="ts">
  import { onMount } from "svelte";

  let canvasEl: HTMLCanvasElement;

  function handleMouseOver() {}

  function handleMouseOut() {}

  function handleMouseMove(event: any) {}

  function draw() {
    const gl = canvasEl.getContext("webgl");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  onMount(() => draw());
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<canvas
  width=1000
  height=1000
  class="bg-blue-500 pointer-events-auto"
  on:mouseover={() => handleMouseOver()}
  on:mouseout={() => handleMouseOut()}
  on:mousemove|preventDefault={(e) => handleMouseMove(e)}
  bind:this={canvasEl}
/>
