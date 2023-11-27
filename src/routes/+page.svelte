<script>
  import Page0 from "$lib/layout/Page0.svelte";
  import Page1 from "$lib/layout/Page1.svelte";
  import Page2 from "$lib/layout/Page2.svelte";
  import Page3 from "$lib/layout/Page3.svelte";
  import Page4 from "$lib/layout/Page4.svelte";
  import { pageNo } from "$lib/scripts/utils";
</script>

<div class="container mx-0 flex">
  <div class="ml-[5rem] mt-11">
    {#if $pageNo == 0}
      <Page0/>
    {:else if $pageNo == 1}
      <Page1/>
    {:else if $pageNo == 2}
      <Page2/>
    {:else if $pageNo == 3}
      <Page3/>
    {:else if $pageNo == 4}
      <Page4/>
    {/if}
  </div>
</div>