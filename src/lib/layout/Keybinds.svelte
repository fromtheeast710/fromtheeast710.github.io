<script lang="ts">
  import { pageNo, tide } from "$lib/scripts/utils";

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

  tide($pageNo);
  }
</script>

<svelte:window on:keydown={handleKey}/>