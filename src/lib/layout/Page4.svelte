<script>
  import {
    IconBrandGithub, IconBrandLinkedin, IconBrandDiscord, IconBrandMatrix, IconBrandLeetcode
    // IconBrandHackerrank
  } from "@tabler/icons-svelte";
  import Page from "./Page.svelte";
</script>

<Page title="Contacts & Resume" offsetX=35>
  <p class="pt-[50px]">
  Check out my other works and contacts at:
  </p>
  <section class="flex p-10 grid-cols-4">
    <button type="button" class="btn-icon variant-ghost"
      on:click={() => location.href = "https://github.com/fromtheeast710"}
    ><IconBrandGithub/></button>
    <button type="button" class="btn-icon variant-ghost"
      on:click={() => location.href = "https://www.linkedin.com/in/đông-phương-phạm-a65192270%2f"}
    ><IconBrandLinkedin/></button>
    <button type="button" class="btn-icon variant-ghost"
      on:click={() => location.href = "https://www.discordapp.com/users/yeast710"}
    ><IconBrandDiscord/></button>
    <button type="button" class="btn-icon variant-ghost"
      on:click={() => location.href = "https://matrix.to/#/@fromtheeast:matrix.org"}
    ><IconBrandMatrix/></button>
    <button type="button" class="btn-icon variant-ghost"
      on:click={() => location.href = "https://www.hackerrank.com/profile/fromtheeast710"}
    ><IconBrandLeetcode/></button>
  </section>

  <!-- <p>And here's my
    <a href="https://google.com" class="pointer-events-auto hover:italic hover:underline">Resume</a>.</p> -->
</Page>

<style>
  button {
    width: 5rem;
    height: 5rem;
    border-radius: 1rem;
    pointer-events: all;
    align-items: center;
    align-self: center;
    margin:auto;
  }
  a:hover#svelte {
    filter: drop-shadow(0 0 2em #e26c1eaa);
  }
  a:hover#tailwind {
    filter: drop-shadow(0 0 2em #23ffffaa);
  }
  a:hover#skeleton {
    filter: drop-shadow(0 0 2em #17107eaa);
  }
</style>
