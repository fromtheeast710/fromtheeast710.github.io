<script lang="ts">
  import { pageNo, showNavbar } from "$lib/scripts/utils";

  function handleKey({ keyCode }) {
    function pageReset() {
      if($pageNo === -1) $pageNo = 4;
      else if($pageNo === 5) $pageNo = 0;
    }

    switch(keyCode) {
      case 37:
        $showNavbar = !$showNavbar;
        break;

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
  }

  function handleClick() {
    var wave1 = document.getElementById("wave1");
    var wave2 = document.getElementById("wave2");
    var wave3 = document.getElementById("wave3");
    var wave4 = document.getElementById("wave4");
    const tideRise = [
      { transform: "translateY(-800px)" },
    ];
    const tideFall = [
    ]
    const tideTiming = {
      duration: 1000,
      easing: "ease-in-out",
      iterations: 1,
      fill: "forwards",
    };

    if($pageNo === 1) {
      wave1?.animate(tideRise, tideTiming);
    } else if($pageNo === 2) {
      wave2?.animate(tideRise, tideTiming);
    } else if($pageNo === 3) {
      wave3?.animate(tideRise, tideTiming);
    } else if($pageNo === 4) {
      wave4?.animate(tideRise, tideTiming);
    }
  }
</script>

<svelte:window on:keydown={handleKey} on:click={handleClick}/>