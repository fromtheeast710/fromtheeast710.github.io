<script lang="ts">
  import Page from "./Page.svelte";

  import Fractal3D from "./3DFractal.svelte";
  import IslandOfStability from "./IslandOfStability.svelte";

  let id = 0;
  let carouselEl: HTMLElement;
  let carouselIds = [
    {component: Fractal3D, name: "Fractal3D"},
    {component: IslandOfStability, name: "IslandOfStability"},
  ];

  function carouselThumb(index: number) {
    carouselEl.scroll(carouselEl.clientWidth * index, 0);

    id = index;
  }
</script>

<Page title="Gallery" offsetX=10>
  <section
    class="p-3 pl-12 grid grid-cols-[auto_1fr_auto] gap-0 items-center pointer-events-auto"
    bind:this={carouselEl}
  >
    <svelte:component this={carouselIds[id].component}/>
  </section>
  <section class="card p-4 grid grid-cols-6 gap-4 pointer-events-auto">
    {#each carouselIds as id, i}
      <button type="button" on:click={() => carouselThumb(i)}>
        <img
          class="rounded-container-token"
          src="/{id.name}.png"
          alt="{id.name} thumbnail"
          loading="lazy"
        />
      </button>
    {/each}
  </section>
</Page>