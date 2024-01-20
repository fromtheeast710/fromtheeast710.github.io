<script lang="ts">
  import { computePosition, autoUpdate, offset, shift, flip, arrow
  } from "@floating-ui/dom";
  import { scaleLinear } from "d3-scale"
  import { popup, storePopup } from "@skeletonlabs/skeleton";
  import { elements } from "$lib/assets/halflive.json";
  import viridis from "$lib/assets/viridis.json"; // 256 values

  const padding = { top: 20, right: 15, bottom: 20, left: 25 };
  const yTicks = [0, 2, 4, 6, 8];
	const xTicks = [1980, 1990, 2000, 2010];
  let width = 700, height = 700;
  let minH = 1e-19, maxH = 2.4298832416320004e+32;

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  // $: xScale = scaleLinear()
	// 	.domain([minX, maxX])
	// 	.range([padding.left, width - padding.right]);

  // $: yScale = scaleLinear()
 	// .domain([Math.min.apply(null, yTicks), Math.max.apply(null, yTicks)])
 	// .range([height - padding.bottom, padding.top]);

  function setColor(m: any) {
    return 255 - Math.round(Math.log(Number(m) + 1) * 3);
  }

  function viridisColor(m: any) {
    if(m == "Stable") {
      return viridis[0];
    } else {
      // return viridis[setColor(m)];
      if(Number(m) <= 1)
        return m;
      else
        return m;
    }
  }
</script>

<ol class="table">
  {#each elements as e, i}
    {#if e.state == "m" || e.state == "o" || e.halflife == "None"}
      <li style="display: none"/>
    {:else}
      <button
        type="button"
        class="element-btn"
        style="grid-column: {e.charge}; 
               grid-row: {178 - (e.mass - e.charge)}; 
               background-color: {viridisColor(e.halflife)}"
        use:popup={{ event: 'hover', target: 'e-' + i, placement: 'right' }}
      />
      <section class="card p-2 shadow-lg variant-filled-secondary" data-popup="e-{i}">
        <div class="arrow variant-filled-secondary"/>
        <span>
          <span class="numbers">
            <sup>{e.mass}</sup><sub>{e.charge}</sub>
          </span>
          {e.symbol}
          <sub class="numbers">{e.mass - e.charge}</sub>
        </span>
        <p>Halflife: {e.halflife}</p>
        <p>Viridis: {setColor(e.halflife)}</p>
      </section>
    {/if}
  {/each}
</ol>

<style>
  .table {
    width: 700px;
    height: 700px;
    position: absolute;
    display: grid;
    pointer-events: auto;
    padding: 9px;
    background-color: transparent;
  }
  .numbers {
    flex-direction: column;
  }
  p {
    @apply text-base pb-0 whitespace-nowrap overflow-hidden;
  }
  span {
  display: flex;
  align-items: center;
  }
  sup, sub {
    @apply p-[.1rem]
  }
  [data-popup] {
    transition-property: none;
	  transition-duration: 0s
  }
</style>