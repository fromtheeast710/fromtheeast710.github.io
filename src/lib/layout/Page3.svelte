<script>
  import Page from "./Page.svelte";
</script>

<Page title="Projects" offsetX=15>
  <div
    class="content grid gap-4"
    style="grid-template-columns: repeat(4, 9rem); grid-template-rows: repeat(4, 9rem);"
  >
    <div class="item-1">1</div>
    <div>2</div>
    <div>3</div>
    <div class="item-4">4</div>
    <div>5</div>
    <div class="item-6">6</div>
    <div>7</div>
  </div>
</Page>

<style lang="postcss">
  .item-1 {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 3;
  }
  .item-4 {
    grid-column-start: 3;
    grid-column-end: 5;
    grid-row-start: 2;
    grid-row-end: 3;
  }
  .item-6 {
    grid-column-start: 2;
    grid-column-end: 4;
    grid-row-start: 3;
    grid-row-end: 3;
  }

  div > div {
    padding: 1.25rem;
    pointer-events: auto;
    @apply card card-hover;
  }
</style>