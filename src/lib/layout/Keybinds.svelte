<script lang="ts">
  // @ts-nocheck
  import { pageNo } from "$lib/scripts/utils";

  function handleKey({ keyCode }) {
    function pageReset() {
      if($pageNo === -1) $pageNo = 4;
      else if($pageNo === 5) $pageNo = 0;
    }

    switch(keyCode) {
      case 38:
        $pageNo--;
        pageReset();
        break;

      case 40:
        $pageNo++;
        pageReset();
        break;

      default:
        break;
    }

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

<svelte:window on:keydown={handleKey}/>