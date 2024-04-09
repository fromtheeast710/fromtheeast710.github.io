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
    <p>Work still in progress.</p>
    <p>Welcome to my personal page, a place for me to show off my work.</p>
    <p>
      Press <IconArrowBigDownLinesFilled class="icon"/>, <IconArrowBigUpLinesFilled class="icon"/> or click <IconHandClick class="icon"/> to navigate the
      <i class="bg-clip-text text-transparent box-decoration-clone
                bg-gradient-to-br
                from-primary-300 via-tertiary-500 to-secondary-500
                hover:drop-shadow-2xl"
      >waves</i>.
    </p>
  </ul>
</Page>