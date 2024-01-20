<script lang="ts">
  import { onMount } from "svelte";

  let canvasEl: HTMLCanvasElement;

  function draw() {
    const gl = canvasEl.getContext("webgl2")!;
    const triangleVerts = [0.0, 0.5, -0.5, -0.5, 0.5, -0.5];
    const triangleCols = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0];
    const triangleVertsCpuBfr = new Float32Array(triangleVerts);
    const triangleGeoBfr = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBfr);
    gl.bufferData(gl.ARRAY_BUFFER, triangleVertsCpuBfr, gl.STATIC_DRAW);

    function addKeywords(src, keywords: Array<any>) {
      if(keywords == null) return src;
      let keywordsStr = "";
      keywords.forEach((keyword) => {
        keywordsStr += "#define " + keyword + "\n";
      });
      return keywordsStr + src;
    }

    function compileShader(type, src, keywords: Array<any> = []) {
      src = addKeywords(src, keywords);

      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);

      if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        console.trace(gl.getShaderInfoLog(shader));

      return shader;
    }

    const vertShader = compileShader(gl.VERTEX_SHADER, `#version 300 es
      precision mediump float;
      in vec2 vertPos;

      void main() {
        gl_Position = vec4(vertPos, 0.0, 1.0);
      }`);

    const fragShader = compileShader(gl.FRAGMENT_SHADER, `#version 300 es
      precision mediump float;
      out vec4 outCol;

      void main() {
        outCol = vec4(0.3, 0.3, 0.3, 1.0);
      }`);

    const triangleShader = gl.createProgram()!;
    gl.attachShader(triangleShader, vertShader);
    gl.attachShader(triangleShader, fragShader);
    gl.linkProgram(triangleShader);
    const vertPosAttrLoc = gl.getAttribLocation(triangleShader, "vertPos");

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, canvasEl.width, canvasEl.height);
    gl.useProgram(triangleShader);
    gl.enableVertexAttribArray(vertPosAttrLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBfr);
    gl.vertexAttribPointer(vertPosAttrLoc, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  onMount(() => {
    try {
      draw();
    } finally {}
  });
</script>

<canvas
  width="700"
  height="700"
  class="bg-blue-500 pointer-events-auto"
  bind:this={canvasEl}
/>