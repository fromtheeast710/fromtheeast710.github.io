<script>
  import Page from "./Page.svelte";
</script>

<Page title="Skills" offsetX=5>
  <p>
    I have epxeriences programming with the following languages:
    <span id="c-lang">C/C++</span>, <span id="py-lang">Python</span>,
    <span id="rs-lang">Rust</span>, <span id="nix-lang">Nix</span>
    and the web stack <span id="html-lang">HTML</span>/<span id="css-lang"
      >CSS</span
    >/<span id="ts-lang">TS</span>
    and <span id="sv-lang">Svelte</span>.
  </p>

  <p>
    Planning to learn:
    <span id="ml-lang">OCaml</span>, <span id="v-lang">SystemVerilog</span>.
  </p>

  <p>
    I am familiar with Git for version control along with VSCodium and Artix
    Linux™ for my development environment.
  </p>

  <p>
    I extensively use open-source libraries in my projects and is currently
    working as an open-source developer and contributor.
  </p>
</Page>

<style>
  span {
    font-weight: bold;
    font-style: italic;
  }
  #c-lang {
    color: hsl(208 100% 29%);
  }
  #rs-lang {
    color: hsl(18 100% 48%);
  }
  #nix-lang {
    color: hsl(239 47% 53%);
  }
  #html-lang {
    color: hsl(18 88% 56%);
  }
  #css-lang {
    color: hsl(223 86% 55%);
  }
  #ts-lang {
    color: hsl(211 60% 49%);
  }
  #py-lang {
    color: hsl(47 100% 70%);
  }
  #sv-lang {
    color: hsl(15 100% 53%);
  }
  #ml-lang {
    color: hsl(27 90% 49%);
  }
  #v-lang {
    color: hsl(0 0% 29%);
  }
</style>
