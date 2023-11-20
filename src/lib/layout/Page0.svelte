<script>
  import {
    IconArrowBigDownLinesFilled,
    IconArrowBigUpLinesFilled,
    IconArrowBigLeftLinesFilled,
  } from "@tabler/icons-svelte";
</script>

<h1>Welcome</h1>
<ul class="justify-center justify-items-center align-middle">
  <p>This is my personal page.</p>
  <p>
    Press <IconArrowBigDownLinesFilled class="icon" /> to move down the
    <i class="gradient-text">waves</i>.
  </p>
  <p>
    Press <IconArrowBigUpLinesFilled class="icon" /> to move up the
    <i class="gradient-text">waves</i>.
  </p>
  <p>
    Press <IconArrowBigLeftLinesFilled class="icon" /> to show the navbar.
  </p>
</ul>

<style>
  .gradient-text {
    @apply bg-clip-text text-transparent box-decoration-clone;
    @apply bg-gradient-to-br;
    @apply from-primary-300 via-tertiary-500 to-secondary-500;
  }
</style>