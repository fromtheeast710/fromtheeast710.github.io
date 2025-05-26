<script>
  import {
    IconBrandGithub,
    IconBrandLinkedin,
    IconBrandDiscord,
    IconBrandMatrix,
    IconBrandHackerrank,
  } from "@tabler/icons-svelte";
  import Page from "./Page.svelte";
  import Btn from "./Btn.svelte";

  let contacts = [
    { link: "https://github.com/fromtheeast710", icon: IconBrandGithub },
    {
      link: "https://www.linkedin.com/in/đông-phương-phạm-a65192270%2f",
      icon: IconBrandLinkedin,
    },
    {
      link: "https://www.discordapp.com/users/yeast710",
      icon: IconBrandDiscord,
    },
    {
      link: "https://matrix.to/#/@fromtheeast:matrix.org",
      icon: IconBrandMatrix,
    },
    {
      link: "https://www.hackerrank.com/profile/fromtheeast710",
      icon: IconBrandHackerrank,
    },
  ];
</script>

<Page title="Contacts & Resume" offsetX="35">
  <p class="pt-[50px]">Check out my other works and contacts at:</p>
  <section class="flex p-10 grid-cols-[{contacts.length}]">
    {#each contacts as c}
      <Btn link={c.link} icon={c.icon} />
    {/each}
  </section>

  <p>
    And here's my
    <a
      href="https://drive.proton.me/urls/8NE5036BER#MxCjhigfsIEy"
      class="pointer-events-auto transition-colors hover:text-red-300 hover:underline hover:decoration-wavy"
      >Resume</a
    >.
  </p>
</Page>

<style>
  button {
    width: 5rem;
    height: 5rem;
    border-radius: 1rem;
    pointer-events: all;
    align-items: center;
    align-self: center;
    margin: auto;
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
