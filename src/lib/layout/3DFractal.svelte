<script lang="ts">
  import { onMount } from "svelte";

  let canvasEl: HTMLCanvasElement;
  let angle = 0;
  const shaderPos = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  const shaderCol = new Uint8Array([255, 0, 0, 0, 255, 0, 0, 0, 255]);

  function handleWheel(event) {
    if(event.deltaY < 0) {
      angle += 0.1;
      draw();
    } else if(event.deltaY > 0) {
      angle -= 0.1;
      draw();
    }
  }

  function compileShader(gl, type, src) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      console.error("Shader failed to compile: " + gl.getShaderInfoLog(shader));

    return shader;
  }

  function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if(!gl.getProgramParameter(program, gl.LINK_STATUS))
      console.error("Program failed to link: " + gl.getProgramInfoLog(program));

    return program;
  }

  let m3 = {
    rotation: function(angleInRad) {
      let c = Math.cos(angleInRad);
      let s = Math.sin(angleInRad);
      return [c, -s, 0, s, c, 0, 0, 0, 1];
    },
  };

  function draw() {
    const gl = canvasEl.getContext("webgl2")!;

    const progGeoBfr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, progGeoBfr);
    gl.bufferData(gl.ARRAY_BUFFER, shaderPos, gl.STATIC_DRAW);
    const progColBfr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, progColBfr);
    gl.bufferData(gl.ARRAY_BUFFER, shaderCol, gl.STATIC_DRAW);

    const vertShader = compileShader(gl, gl.VERTEX_SHADER, `#version 300 es
    #pragma vscode_glsllint_stage: vert
    precision mediump float;
    
    in vec3 vertCol;
    in vec2 vertPos;
    out vec3 fragCol;
    uniform mat3 uMat;
    
    void main() {
      fragCol = vertCol;
      gl_Position = vec4((uMat * vec3(vertPos, 1.)).xy, 0., 1.);
    }`);
    const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, `#version 300 es
    #pragma vscode_glsllint_stage: frag
    precision mediump float;
    
    in vec3 fragCol;
    out vec4 outCol;

    void main() {
      outCol = vec4(fragCol, 1.);
    }`);

    const prog = createProgram(gl, vertShader, fragShader);
    const posAttrLoc = gl.getAttribLocation(prog, "vertPos");
    const colAttrLoc = gl.getAttribLocation(prog, "vertCol");
    const matLoc = gl.getUniformLocation(prog, "uMat");

    let mat = m3.rotation(angle);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, canvasEl.width, canvasEl.height);

    gl.useProgram(prog);

    gl.enableVertexAttribArray(posAttrLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, progGeoBfr);
    gl.vertexAttribPointer(posAttrLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colAttrLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, progColBfr);
    gl.vertexAttribPointer(colAttrLoc, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    gl.uniformMatrix3fv(matLoc, false, mat);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  onMount(() => draw());
</script>

<canvas
  width=700
  height=700
  class="bg-blue-500 pointer-events-auto"
  bind:this={canvasEl}
  on:wheel={(e) => handleWheel(e)}
/>