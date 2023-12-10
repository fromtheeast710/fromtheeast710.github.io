<script>
  import Page from "./Page.svelte";
</script>

<Page title="Credits" offsetX="95">
  <p class="pt-[100px]">
    This website is made with these incredible technologies:
  </p>
  <div class="text-center">
    <a id="svelte" href="https://svelte.dev/">
      <img src="https://svelte.dev/favicon.png" alt="Svelte"/>
    </a>
    <a id="tailwind" href="https://tailwindcss.com/">
      <img
        src="https://tailwindcss.com/favicons/favicon-32x32.png?v=3"
        alt="TailwindCSS"
      />
    </a>
    <a id="skeleton" href="https://www.skeleton.dev/">
      <img src="https://www.skeleton.dev/favicon.png" alt="SkeletonUI"/>
    </a>
  </div>
  <p>
    Many thanks to the developers, contributors and community members that made it possible.
  </p>
</Page>

<style>
  img {
    width: 48px;
    display: inline;
    margin: 10px;
    margin-bottom: 30px;
  }
  a {
    pointer-events: all;
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