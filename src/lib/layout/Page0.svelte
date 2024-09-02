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

    <p>
      Welcome to my personal page! My name is Phạm Đông Phương, nicknamed <i>East</i>. I am a second-year Computer
      Science student at Western Sydney University in <b>Sydney, Australia</b> 🇦🇺.
    </p>

    <p>I have a passion for learning about technology, programming and mathematics.</p>

    <p>I am currently focusing on <b>programminng in <i class="text-orange-500">Rust</i></b> through my projects.</p>

    <p>
      Press <IconArrowBigDownLinesFilled class="icon kbd"/>, <IconArrowBigUpLinesFilled class="icon kbd"/> or click
      <IconHandClick class="icon kbd"/> to navigate the
      <i class="bg-clip-text text-transparent box-decoration-clone bg-gradient-to-br
                from-primary-300 via-tertiary-500 to-secondary-500
                hover:drop-shadow-2xl"
      >waves</i>.
    </p>
  </ul>
</Page>
