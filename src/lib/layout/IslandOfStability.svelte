<script lang="ts">
  import { computePosition, autoUpdate, offset, shift, flip, arrow
  } from "@floating-ui/dom";
  import { popup, storePopup } from "@skeletonlabs/skeleton";
  import { elements } from "$lib/assets/halflive.json";
  import viridis from "$lib/assets/viridis.json";

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  let elCharge = ["H", 1, "Ca", 20, "Zr", 40, "Nd", 60, "Hg", 80, "Fm", 100, "Og", 118];
  let elNeutron = [177, 150, 120, 90, 60, 30, 1];
  let xTick = 49.6
  let yTick = 99.8

  function viridisCol(m: string): string {
    return m == "Stable" ? viridis[0] 
                         : m == "None"
                         ? ""
                         : Number(m) >= 10e9
                         ? viridis[9]
                         : Number(m) <= 10e-11
                         ? viridis[255]
                         : viridis[254 - Math.round(251*(Math.log10(Number(m)) + 10)/20)];
  }
</script>

<!-- TODO: change <button> to <rect> -->
<ol class="table">
  {#each elements as el, i}
    {#if el.state == "m" || el.state == "o" || el.halflife == "None"}
      <li style="display: none"/>
    {:else}
      <button
        type="button"
        class="element-btn"
        style="grid-column: {el.charge}; 
               grid-row: {178 - (el.mass - el.charge)}; 
               background-color: {viridisCol(el.halflife)}"
        use:popup={{ event: 'hover', target: 'el-' + i, placement: 'right' }}
      />
      <section class="card p-2 shadow-lg variant-filled-secondary" data-popup="el-{i}">
        <div class="arrow variant-filled-secondary"/>
        <span>Element: 
          <span class="numbers">
            <sup>{el.mass}</sup><sub>{el.charge}</sub>
          </span>
          {el.symbol}
          <sub class="numbers">{el.mass - el.charge}</sub>
        </span>
        <p>Halflife: {el.halflife}</p>
      </section>
    {/if}
  {/each}
</ol>

<svg width=700 height=700>
  <g>
    <line x1=55 y1=40 x2=55 y2=640/>
    <line x1=65 y1=650 x2=660 y2=650/>
    {#each elNeutron as _, i }
      <line x1=45 y1={40 + i*yTick} x2=56 y2={40 + i*yTick}/>
      <text x=40 y={45 + i*yTick} font-size=16 
        text-anchor="end">{elNeutron[i]}</text>
    {/each}
    {#each elCharge as _, i }
      {#if typeof(elCharge[i]) == "string"}
        <line x1={65 + i*xTick} y1=649 x2={65 + i*xTick} y2=660/>
        <text x={60 + i*xTick} y=683 font-size=16>{elCharge[i]}</text>
        <text x={58 + i*xTick} y=675 font-size=12 font-style="italic" 
          text-anchor="end">{elCharge[i+1]}</text>
      {/if}
    {/each}
  </g>
</svg>

<style lang="postcss">
  .table {
    width: 700px;
    height: 700px;
    position: absolute;
    display: grid;
    pointer-events: auto;
    padding: 42px;
    padding-left: 67px;
    padding-bottom: 62px;
    background-color: transparent;
  }
  .numbers {
    flex-direction: column;
  }
  text {
    fill: gray;
  }
  line {
    stroke: gray;
    stroke-width: 2;
  }
  p {
    font-size: 1rem;
    line-height: 1.5rem;
    padding-bottom: 0px;
    white-space: nowrap;
    overflow: hidden;
  }
  span {
    display: flex;
    align-items: center;
  }
  sup, sub {
    padding: 0.1rem;
  }
  [data-popup] {
    transition-property: none;
	  transition-duration: 0s
  }
</style>