<script lang="ts">
  import { pageNo, showNavbar } from "$lib/scripts/page";

  function handleKey({ keyCode }) {
    if(keyCode != 37 && keyCode != 38 && keyCode != 40) return;

    function pageChange() {
      if($pageNo === -1) $pageNo = 4;
      else if($pageNo === 5) $pageNo = 0;
    }

    switch(keyCode) {
      case 37:
        $showNavbar = !$showNavbar;
        break;

      case 38:
        $pageNo--;
        pageChange();
        break;

      case 40:
        $pageNo++;
        pageChange();
        break;
    }
  }
</script>

<svelte:window on:keydown={handleKey}/>