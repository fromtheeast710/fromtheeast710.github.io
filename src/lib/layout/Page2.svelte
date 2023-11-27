<h1>Projects</h1>
<div 
  class="content grid gap-4" 
  style="grid-template-columns: repeat(4, 9rem); grid-template-rows: repeat(2, 9rem);"
>
    <div class="item-1 card py-5 px-5">1</div>
    <div class="card py-5 px-5">2</div>
    <div class="card py-5 px-5">3</div>
    <div class="item-4 card py-5 px-5">4</div>
</div>

<style>
  .item-1 {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 3;
  }
  .item-4 {
    grid-column-start: 3;
    grid-column-end: 5;
    grid-row-start: 2;
    grid-row-end: 3;
  }
</style>