<script>
  import Page from "./Page.svelte";
</script>

<Page title="Credits" offsetX="95">
  <p class="pt-[100px]">
    This website is made with these incredible technologies:
  </p>
  <div class="text-center">
    <a href="https://svelte.dev/">
      <img src="https://svelte.dev/favicon.png" alt="Svelte"/>
    </a>
    <a href="https://tailwindcss.com/">
      <img
        src="https://tailwindcss.com/favicons/favicon-32x32.png?v=3"
        alt="TailwindCSS"
      />
    </a>
    <a href="https://www.skeleton.dev/">
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
    margin: 9px;
    margin-bottom: 29px;
  }
</style>