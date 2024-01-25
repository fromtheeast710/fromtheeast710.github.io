<script lang="ts">
  import { onMount } from "svelte";

  let canvasEl: HTMLCanvasElement;

  function draw() {
    const gl = canvasEl.getContext("webgl2")!;
    const triangleVerts = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    const triangleCols = new Uint8Array([255, 0, 0, 0, 255, 0, 0, 0, 255]);
    const triangleGeoBfr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBfr);
    gl.bufferData(gl.ARRAY_BUFFER, triangleVerts, gl.STATIC_DRAW);
    const triangleColBfr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleColBfr);
    gl.bufferData(gl.ARRAY_BUFFER, triangleCols, gl.STATIC_DRAW);

    function compileShader(type, src) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);

      if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        console.error(gl.getShaderInfoLog(shader));

      return shader;
    }

    const vertShader = compileShader(gl.VERTEX_SHADER, `#version 300 es
      precision mediump float;
      in vec2 vertPos;
      in vec3 vertCol;
      out vec3 fragCol;

      void main() {
        fragCol = vertCol;
        gl_Position = vec4(vertPos, 0.0, 1.0);
      }`);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, `#version 300 es
      #pragma vscode_glsllint_stage: frag
      precision mediump float;
      in vec3 fragCol;
      out vec4 outCol;

      void main() {
        outCol = vec4(fragCol, 1.0);
      }`);

    const triangleShader = gl.createProgram()!;
    gl.attachShader(triangleShader, vertShader);
    gl.attachShader(triangleShader, fragShader);
    gl.linkProgram(triangleShader);
    const vertPosAttrLoc = gl.getAttribLocation(triangleShader, "vertPos");
    const vertColAttrLoc = gl.getAttribLocation(triangleShader, "vertCol");

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, canvasEl.width, canvasEl.height);
    gl.useProgram(triangleShader);

    gl.enableVertexAttribArray(vertPosAttrLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBfr);
    gl.vertexAttribPointer(vertPosAttrLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertColAttrLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleColBfr);
    gl.vertexAttribPointer(vertColAttrLoc, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  onMount(() => {
    try { draw(); } finally {}
  });
</script>

<canvas width="700" height="700" class="bg-blue-500 pointer-events-auto" bind:this={canvasEl}/>