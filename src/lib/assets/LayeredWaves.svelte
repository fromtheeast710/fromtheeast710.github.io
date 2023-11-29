<script>
  // @ts-nocheck
  import { pageNo, isUp } from "$lib/scripts/utils";

  export let className = "";

  function tide() { 
    var wave1 = document.getElementById("wave1");
    var wave2 = document.getElementById("wave2");
    var wave3 = document.getElementById("wave3");
    var wave4 = document.getElementById("wave4");
    const tideRise = [{ transform: "translateY(-81.5vh)" }];
    const tideFall = [{ transform: "translateY(0vh)" }];
    const tideTiming = {
      duration: 1000,
      easing: "ease-in-out",
      iterations: 1,
      fill: "forwards",
    };

    if($pageNo === 1) {
      wave1?.animate(tideRise, tideTiming);
      wave2?.animate(tideFall, tideTiming);
      wave3?.animate(tideFall, tideTiming);
      wave4?.animate(tideFall, tideTiming);
    } else if($pageNo === 2) {
      wave1?.animate(tideRise, tideTiming);
      wave2?.animate(tideRise, tideTiming);
      wave3?.animate(tideFall, tideTiming);
      wave4?.animate(tideFall, tideTiming);
    } else if($pageNo === 3) {
      wave1?.animate(tideRise, tideTiming);
      wave2?.animate(tideRise, tideTiming);
      wave3?.animate(tideRise, tideTiming);
      wave4?.animate(tideFall, tideTiming);
    } else if($pageNo === 4) {
      wave1?.animate(tideRise, tideTiming);
      wave2?.animate(tideRise, tideTiming);
      wave3?.animate(tideRise, tideTiming);
      wave4?.animate(tideRise, tideTiming);
    } else if($pageNo === 0) {
      wave1?.animate(tideFall, tideTiming);
      wave2?.animate(tideFall, tideTiming);
      wave3?.animate(tideFall, tideTiming);
      wave4?.animate(tideFall, tideTiming);
    }
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
<svg
  id="waves"
  viewBox="0 0 960 2700"
  xmlns="http://www.w3.org/2000/svg"
  class={className}
>
  <rect
    id="wave0"
    width=960
    height=2700
    x=0
    y=0
    style="opacity:0"
    on:click={() => pageNo.set(0)}
  />
  <path
    id="wave1"
    d="m 0.00224141,1161.7111 22.80000059,-1.0424 c 22.9,-1.1726 68.5,-3.2574 114.200008,-8.9903 45.7,-5.6027 91.3,-14.7233 137,-21.4987 45.7,-6.645 91.3,-11.075 137.2,-3.2573 45.8,7.8176 91.8,27.8831 137.6,39.349 45.9,11.466 91.5,14.593 137.2,15.2445 45.70002,0.6515 91.30002,-1.1727 137,-6.7753 45.7,-5.6027 91.3,-15.2445 114.2,-19.9351 l 22.8,-4.8209 V 2702.819 l -29.1765,1.0097 -107.8235,-0.061 -137,0.1317 -137.2,-1.8986 -137.6,0.6687 -137.2,0.3132 -137,-0.7547 -114.200008,0.6994 -22.80000059,-0.4609 z"
    fill="#6198ff"
    on:click={() => pageNo.set(1)}
  />
  <path
    id="wave2"
    d="m 0,1161.6676 22.8,5.7337 c 22.9,5.7337 68.5,17.2011 114.2,21.4058 45.7,4.3321 91.3,1.2741 137,-2.5483 45.7,-3.8224 91.3,-8.4094 137.2,-8.0272 45.8,0.3823 91.8,5.9885 137.6,7.645 45.9,1.6564 91.5,-0.3823 137.2,-5.479 45.7,-5.0966 91.3,-13.2511 137,-13.6334 45.7,-0.3822 91.3,6.753 114.2,10.4481 l 22.8,3.5676 V 2703.8831 H 937.2 823 686 548.8 411.2 274 137 22.8 0 Z"
    fill="#2d77ff"
    on:click={() => pageNo.set(2)}
  />
  <path
    id="wave3"
    d="m 0,1224.6564 22.8,-0.6538 c 22.9,-0.6537 68.5,-1.9612 114.2,1.9612 45.7,3.9223 91.3,13.0745 137,11.7671 45.7,-1.3075 91.3,-13.0745 137.2,-13.7283 45.8,-0.6537 91.8,9.806 137.6,10.8519 45.9,1.1767 91.5,-7.191 137.2,-14.1206 45.7,-6.9294 91.3,-12.6822 137,-12.4208 45.7,0.2615 91.3,6.2758 114.2,9.4137 l 22.8,3.0071 V 2703.8805 H 937.2 823 686 548.8 411.2 274 137 22.8 0 Z"
    fill="#005de8"
    on:click={() => pageNo.set(3)}
  />
  <path
    id="wave4"
    d="M 0,1256.6777 V 2703.8786 H 22.800781 137 274 411.19922 548.80078 686 823 937.19922 960 V 1277.0737 l -22.80078,-2.0401 c -22.89998,-1.9197 -68.49927,-5.9986 -114.19922,-6.1187 -45.69995,-0.2399 -91.30005,3.3605 -137,2.4006 -45.69995,-1.0798 -91.29926,-6.5989 -137.19922,-9.8384 -45.79995,-3.2395 -91.80161,-3.9606 -137.60156,0.3587 -45.89996,4.4392 -91.49927,14.0377 -137.19922,17.9972 -45.69995,4.0793 -91.30005,2.4004 -137,-2.3988 -45.699954,-4.7992 -91.299242,-12.7176 -114.199219,-16.797 z"
    fill="#004cbb"
    on:click={() => pageNo.set(4)}
  />
</svg>

<svelte:window on:click={tide}/>