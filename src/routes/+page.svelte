<script>
  import Page0 from "$lib/layout/Page0.svelte";
  import { pageNo } from "$lib/scripts/page";
</script>

<div class="container mx-0 flex">
  <div class="ml-[5rem] mt-9">
    {#if $pageNo == 0}
      <Page0/>
    {:else if $pageNo == 1}
      <h1>About me</h1>
      <p>I am an ICT student.</p>
    {:else if $pageNo == 2}
      <h1>Interests</h1>
    {:else if $pageNo == 3}
      <h1>Gallery</h1>
    {:else if $pageNo == 4}
      <h1>Credits</h1>
    {/if}
  </div>
</div>