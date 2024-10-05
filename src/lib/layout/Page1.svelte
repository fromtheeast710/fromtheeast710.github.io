<script>
  import Page from "./Page.svelte";
</script>

<Page title="Skills" offsetX="5">
  <p>
    I have epxeriences in designing software with the following languages:
    <span id="c-lang">C/C++</span>, <span id="py-lang">Python</span>,
    <span id="rs-lang">Rust</span> along with the web stack
    <span id="html-lang">HTML</span>/<span id="css-lang">CSS</span>/<span
      id="ts-lang">TS</span
    >
    and <span id="sv-lang">Svelte</span>.
  </p>

  <p>
    In my free time, I experiment on functional programming with <span
      id="nix-lang">Nix</span
    >, <span id="ml-lang">OCaml</span> and is planning to learn
    <span id="v-lang">SystemVerilog</span>
    for FPGAs design.
  </p>

  <p>
    I extensively utilize open-source tools and libraries such as Git, Linux,
    Docker, etc for my projects. I'm currently working as an open-source
    developer and contributer.
  </p>

  <p>Other than dev work, I enjoy playing ping-pong and meeting new people.</p>
</Page>

<style>
  span {
    font-weight: bold;
    font-style: italic;
  }
</style>
