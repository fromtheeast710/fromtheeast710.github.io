<script>
  import { TableOfContents, tocCrawler } from "@skeletonlabs/skeleton";
</script>

<div use:tocCrawler={{ mode: 'generate' }}>
	<h2>Welcome</h2>
	<h2>About me</h2>
	<h2>Interests</h2>
	<h2>Gallery</h2>
	<h2>Credits</h2>
</div>

<TableOfContents class="navbar"/>

<style>
  h2 {
    display: none;
    /* @apply sr-only; */
  }
</style>