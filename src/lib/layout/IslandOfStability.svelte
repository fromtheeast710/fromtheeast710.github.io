<script lang="ts">
  import { writable } from "svelte/store";
  import { elements } from "$lib/assets/halflife.json";
  import viridis from "$lib/assets/viridis.json";

  let elCharge = ["H", 1, "Ca", 20, "Zr", 40, "Nd", 60, "Hg", 80, "Fm", 100, "Og", 118];
  let elNeutron = [1, 30, 60, 90, 120, 150, 177];
  let xTick = 450 / 6.01
  let yTick = 460 / 6.15

  let symbol = writable("H")
  let mass = writable(1)
  let proton = writable(1)
  let neutron = writable(0)
  let halflife = writable("Stable")

  function viridisCol(m: string): string {
    return m == "Stable" ? viridis[0]
                         : Number(m) >= 10e9
                         ? viridis[9]
                         : Number(m) <= 10e-11 || m == "None"
                         ? viridis[255]
                         : viridis[254 - Math.round(251*(Math.log10(Number(m)) + 10)/20)];
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions a11y-mouse-events-have-key-events -->
<svg width=500 height=500 class="pointer-events-auto">
  <g id="table">
  {#each elements as el}
    {#if el.state == "m" || el.state == "o"}
      <rect style="display:none"/>
    {:else}
      <rect
        x={(500 / 129) * el.charge + 37}
        y={(500 / 194.3) * (178 - (el.mass - el.charge))}
        width=4
        height=3
        fill={viridisCol(el.halflife)}
        on:mouseover={() => {
          symbol.set(el.symbol),
          mass.set(el.mass),
          proton.set(el.charge),
          neutron.set(el.mass - el.charge)
          halflife.set(el.halflife)
        }}
      />
    {/if}
  {/each}
  </g>
  <g id="info">
    <rect x=55 y=10 width=265 height=150 rx=15 ry=15 fill="teal"/>
    <text x=185 y=65 text-anchor="middle" font-size=35>{$symbol}</text>
    <text x=160 y=50 text-anchor="end" font-size=20>{$mass}</text>
    <text x=160 y=75 text-anchor="end" font-size=20>{$proton}</text>
    <text x=210 y=75 text-anchor="start" font-size=20>{$neutron}</text>
    <text x=185 y=115 text-anchor="middle" text-decoration="underline" font-size=22
      >Halflife (seconds)</text>
    <text x=185 y=140 text-anchor="middle" font-size=18>{$halflife}</text>
  </g>
  <g id="scale">
    <line x1=35 y1=9 x2=35 y2=460/>
    <line x1=39 y1=470 x2=490 y2=470/>
    {#each elNeutron.reverse() as _, i}
      <line x1=30 y1={10 + i*yTick} x2=35 y2={10 + i*yTick}/>
      <text x=26 y={15 + i*yTick} font-size=16 text-anchor="end" font-style="italic"
        >{elNeutron[i]}</text>
    {/each}
    {#each elCharge.filter((c) => typeof c == "string") as _, i}
      <line x1={40 + i*xTick} y1=470 x2={40 + i*xTick} y2=475/>
      <text x={32 + i*xTick} y=495 font-size=16>{elCharge[i*2]}</text>
      <text x={29 + i*xTick} y=499 font-size=12 text-anchor="end" font-style="italic"
        >{elCharge[i*2+1]}</text>
    {/each}
  </g>
</svg>

<style lang="postcss">
  line {
    stroke: white;
    stroke-width: 2;
  }
  text {
    fill: white;
  }
  #info>text {
    fill: white;
  }
</style>