<script lang="ts">
  import { pageNo, showNavbar } from "$lib/scripts/page";

  function handleKey({ keyCode }) {
    if(keyCode != 38 && keyCode != 40 && keyCode != 37) return;

    function pageChange() {
      let newPage;

      if($pageNo === -1) $pageNo = 4;
      else if($pageNo >= 5) $pageNo = 0;
    }

    switch(keyCode) {
      case 37:
        $showNavbar = !$showNavbar;
        break;

      case 38:
        $pageNo++;
        pageChange();
        console.log($pageNo)
        break;

      case 40:
        $pageNo--;
        pageChange();
        console.log($pageNo)
        break;

      default:
        break;
    }
  }
</script>

<svelte:window on:keydown={handleKey}/>