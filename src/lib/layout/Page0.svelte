<script>
  import {
    IconArrowBigDownLinesFilled,
    IconArrowBigUpLinesFilled,
    IconArrowBigLeftLinesFilled,
  } from "@tabler/icons-svelte";
</script>

<h1>Welcome</h1>
<ul class="content justify-center justify-items-center align-middle">
  <p>This is my personal page. Work in progress.</p>
  <p>
    Press <IconArrowBigDownLinesFilled class="icon"/> to move down the
    <i class="gradient-text">waves</i>.
  </p>
  <p>
    Press <IconArrowBigUpLinesFilled class="icon"/> to move up the
    <i class="gradient-text">waves</i>.
  </p>
  <p>
    Press <IconArrowBigLeftLinesFilled class="icon"/> to show the navbar.
  </p>
</ul>

<style lang="postcss">
  .gradient-text {
    @apply bg-clip-text text-transparent box-decoration-clone
           bg-gradient-to-br
           from-primary-300 via-tertiary-500 to-secondary-500;
  }
</style>