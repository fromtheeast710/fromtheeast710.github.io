<script lang="ts">
  import { onMount } from "svelte";

  let canvasEl: HTMLCanvasElement;
  let scale = 1;
  let rotate = [0, 0];
  let isDragging = false;
  let oldX: any, oldY: any;
  let dX = 0, dY = 0;

  const shaderPos = new Float32Array([
    0.0000, 0.0000, -1.0000,
    0.0000, 0.9428, 0.3333,
    -0.8165, -0.4714, 0.3333,

    0.8165, -0.4714, 0.3333,
    0.0000, 0.9428, 0.3333,
    -0.8165, -0.4714, 0.3333,

    0.0000, 0.0000, -1.0000,
    0.0000, 0.9428, 0.3333,
    -0.8165, -0.4714, 0.3333,
  ]);
  const shaderCol = new Uint8Array([
    255, 0, 0, 0, 255, 0, 0, 0, 255,

    255, 0, 255, 0, 255, 0, 0, 0, 255,

    0, 255, 255, 255, 255, 0, 255, 0, 255
  ]);

  function hex2Rgb(hex: string): number[] {
    return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
                       ,(r, g, b) => '#' + r + r + g + g + b + b)
              .substring(1).match(/.{2}/g)
              .map(x => parseInt(x, 16));
  }

  function handleWheel(event: any) {
    if(event.deltaY < 0) {
      scale >= 1 ? scale = 1 : scale += 0.01;
      draw();
    } else if(event.deltaY > 0) {
      scale <= 0 ? scale = 0 : scale -= 0.01;
      draw();
    }
  }

  function handleMouseUp() {
    isDragging = false;
  }

  function handleMouseDown(event: any) {
    isDragging = true;
    oldX = event.pageX, oldY = event.pageY;

    event.preventDefault();

    return false;
  }

  function handleMouseMove(event: any) {
    if(!isDragging) return false;

    dX = (event.pageX - oldX)*2*Math.PI/700;
    dY = (event.pageY - oldY)*2*Math.PI/700;
    oldX = event.pageX, oldY = event.pageY;

    event.preventDefault();

    draw();
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
    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if(!gl.getProgramParameter(program, gl.LINK_STATUS))
      console.error("Program failed to link: " + gl.getProgramInfoLog(program));

    return program;
  }

  let m4 = {
    xRotation: function (angleInRad) {
      let c = Math.cos(angleInRad);
      let s = Math.sin(angleInRad);

      return [ 1, 0, 0, 0, 
               0, c, s, 0, 
               0, -s, c, 0, 
               0, 0, 0, 1 ];
    },
    yRotation: function (angleInRad) {
      let c = Math.cos(angleInRad);
      let s = Math.sin(angleInRad);

      return [ c, 0, -s, 0, 
               0, 1, 0, 0, 
               s, 0, c, 0, 
               0, 0, 0, 1 ];
    },
    scaling: function (sx, sy, sz) {
      return [ sx, 0, 0, 0,
               0, sy, 0, 0,
               0, 0, sz, 0,
               0, 0, 0, 1 ];
    }
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
    in vec4 vertPos;
    out vec3 fragCol;
    uniform mat4 uMat;
    
    void main() {
      fragCol = vertCol;
      gl_Position = uMat * vertPos;
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

    // let mat = m4.xRotation(angle);
    let mat = m4.xRotation(rotate[0]);
    mat = m4.yRotation(rotate[1]);
    mat = m4.scaling(scale, scale, scale);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, canvasEl.width, canvasEl.height);

    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(prog);

    gl.enableVertexAttribArray(posAttrLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, progGeoBfr);
    gl.vertexAttribPointer(posAttrLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colAttrLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, progColBfr);
    gl.vertexAttribPointer(colAttrLoc, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    gl.uniformMatrix4fv(matLoc, false, mat);

    gl.drawArrays(gl.TRIANGLES, 0, 3*3);
  }

  onMount(() => draw());
</script>

<canvas
  width=700
  height=700
  class="bg-blue-500 pointer-events-auto"
  on:mouseup={() => handleMouseUp()}
  on:mousedown={(e) => handleMouseDown(e)}
  on:mousemove={(e) => handleMouseMove(e)}
  on:wheel={(e) => handleWheel(e)}
  bind:this={canvasEl}
/>