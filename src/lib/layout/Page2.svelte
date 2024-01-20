<script lang="ts">
  import Page from "./Page.svelte";

  let elemCarousel: HTMLDivElement;
  const unsplashIds = [ "vjUokUWbFOs", "1aJuPtQJX_I", "Jp6O3FFRdEI", "I3C_eojFVQY", "s0fXOuyTH1M", "z_X0PxmBuIQ" ];

  function carouselLeft(): void {
    const x =
      elemCarousel.scrollLeft === 0
        ? elemCarousel.clientWidth * elemCarousel.childElementCount // loop
        : elemCarousel.scrollLeft - elemCarousel.clientWidth; // step left
    elemCarousel.scroll(x, 0);
  }

  function carouselRight(): void {
    const x =
      elemCarousel.scrollLeft ===
      elemCarousel.scrollWidth - elemCarousel.clientWidth
        ? 0 // loop
        : elemCarousel.scrollLeft + elemCarousel.clientWidth; // step right
    elemCarousel.scroll(x, 0);
  }

  function carouselThumbnail(index: number) {
    elemCarousel.scroll(elemCarousel.clientWidth * index, 0);
  }
</script>

<Page title="Gallery" offsetX="30">
  <section class="p-4 grid grid-cols-[auto_1fr_auto] gap-4 items-center pointer-events-auto">
    <!-- Full Image -->
    <div
      bind:this={elemCarousel}
      class="snap-center snap-mandatory scroll-smooth flex overflow-x-auto"
    >
      {#each unsplashIds as unsplashId}
        <img
          class="snap-center w-[1024px] rounded-container-token"
          src="https://source.unsplash.com/{unsplashId}/1024x768"
          alt={unsplashId}
          loading="lazy"
        />
      {/each}
    </div>
  </section>
  <!-- Thumbnails -->
  <section class="p-4 grid grid-cols-6 gap-4 pointer-events-auto">
    {#each unsplashIds as unsplashId, i}
      <button type="button" on:click={() => carouselThumbnail(i)}>
        <img
          class="rounded-container-token"
          src="https://source.unsplash.com/{unsplashId}/256x256"
          alt={unsplashId}
          loading="lazy"
        />
      </button>
    {/each}
  </section>
</Page>