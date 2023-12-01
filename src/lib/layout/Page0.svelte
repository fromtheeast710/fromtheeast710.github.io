<script>
  import {
    IconArrowBigDownLinesFilled,
    IconArrowBigUpLinesFilled,
    IconHandClick
  } from "@tabler/icons-svelte";
  import Page from "./Page.svelte";
</script>

<Page title="Welcome" offsetX=0>
  <ul class="content justify-center justify-items-center align-middle">
    <p>This is my personal page, a place for me to show off my work.</p>
    <p>
      Press <IconArrowBigDownLinesFilled class="icon"/>, <IconArrowBigUpLinesFilled class="icon"/> or click <IconHandClick class="icon"/> to navigate the
      <i class="gradient-text">waves</i>.
    </p>
  </ul>
</Page>

<style lang="postcss">
  .gradient-text {
    @apply bg-clip-text text-transparent box-decoration-clone
           bg-gradient-to-br
           from-primary-300 via-tertiary-500 to-secondary-500;
  }
</style>