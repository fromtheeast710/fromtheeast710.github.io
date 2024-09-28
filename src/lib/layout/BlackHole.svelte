<script lang="ts">
  import { onMount } from "svelte";
  import { compileShader, createProgram } from "$lib/scripts/webgl";

  let canvasEl: HTMLCanvasElement;
  let radius = 1.0;

  const triVerts = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  const triCols = new Uint8Array([]);
  const texCoords = new Float32Array([
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
  ]);

  function handleWheel() {}

  function handleMouseOver() {}

  function handleMouseOut() {}

  function handleMouseMove(event: any) {}

  function draw(image) {
    const gl = canvasEl.getContext("webgl2");

    const vertShader = compileShader(gl, gl.VERTEX_SHADER, `#version 300 es
    #pragma vscode_glsllint_stage: vert

    in vec2 vertPos;
    in vec2 aTexCoord;
    out vec2 vTexCoord;

    void main() {
      gl_Position = vec4(vertPos, 0., 1.);
      vTexCoord = aTexCoord;
    }`);
    const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, `#version 300 es
    #pragma vscode_glsllint_stage: frag
    precision highp float;

    uniform sampler2D uImg;

    in vec2 vTexCoord;
    out vec4 outCol;

    void main() {
      outCol = texture(uImg, vTexCoord);
    }`);

    const prog = createProgram(gl, vertShader, fragShader);
    const posAttrLoc = gl.getAttribLocation(prog, "vertPos");
    const colAttrLoc = gl.getAttribLocation(prog, "vertCol");
    const texCoordAttrLoc = gl.getAttribLocation(prog, "aTexCoord");
    const imgLoc = gl.getUniformLocation(prog, "uImg");

    const triGeoBfr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triGeoBfr);
    gl.bufferData(gl.ARRAY_BUFFER, triVerts, gl.STATIC_DRAW);
    const triColBfr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triColBfr);
    gl.bufferData(gl.ARRAY_BUFFER, triCols, gl.STATIC_DRAW);
    const texCoordBfr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBfr);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordAttrLoc);

    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + 0);
    gl.bindTexture(gl.TEXTURE_2D, tex);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.viewport(0, 0, canvasEl.width, canvasEl.height);

    gl.useProgram(prog);

    gl.uniform1i(imgLoc, 0);

    gl.enableVertexAttribArray(posAttrLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, triGeoBfr);
    gl.vertexAttribPointer(posAttrLoc, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  onMount(async () => {
    const img = new Image();
    img.src = "/src/lib/assets/james_webb_1.png";
    img.onload = () => { };

    draw(img);
  });
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<canvas
  width="1000"
  height="1000"
  class="bg-blue-500 pointer-events-auto"
  on:wheel={() => handleWheel()}
  on:mouseover={() => handleMouseOver()}
  on:mouseout={() => handleMouseOut()}
  on:mousemove|preventDefault={(e) => handleMouseMove(e)}
  bind:this={canvasEl}
/>
