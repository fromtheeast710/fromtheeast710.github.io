<script lang="ts">
  import { onMount } from "svelte";

  let canvasEl: HTMLCanvasElement;
  let rotate = [0, 0];
  let isDragging = false;
  let oldPos = { x: 0, y: 0 };

  const shaderPos = new Float32Array([
    0.0, 0.0, -1.0,
    0.0, 0.9428, 0.3333,
    -0.8165, -0.4714, 0.3333,

    0.8165, -0.4714, 0.3333,
    0.0, 0.9428, 0.3333,
    -0.8165, -0.4714, 0.3333,

    0.0, 0.0, -1.0,
    0.0, 0.9428, 0.3333,
    -0.8165, -0.4714, 0.3333,
  ]);
  const shaderCol = new Uint8Array([
    255, 0, 0,
    0, 255, 0,
    0, 0, 255,

    255, 0, 255,
    0, 255, 0,
    0, 0, 255,

    0, 255, 255,
    255, 255, 0,
    255, 0, 255,
  ]);

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
    identity: function() {
      return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ];
    },

    multiply: function(a, b) {
      let a00 = a[0 * 4 + 0];
      let a01 = a[0 * 4 + 1];
      let a02 = a[0 * 4 + 2];
      let a03 = a[0 * 4 + 3];
      let a10 = a[1 * 4 + 0];
      let a11 = a[1 * 4 + 1];
      let a12 = a[1 * 4 + 2];
      let a13 = a[1 * 4 + 3];
      let a20 = a[2 * 4 + 0];
      let a21 = a[2 * 4 + 1];
      let a22 = a[2 * 4 + 2];
      let a23 = a[2 * 4 + 3];
      let a30 = a[3 * 4 + 0];
      let a31 = a[3 * 4 + 1];
      let a32 = a[3 * 4 + 2];
      let a33 = a[3 * 4 + 3];
      let b00 = b[0 * 4 + 0];
      let b01 = b[0 * 4 + 1];
      let b02 = b[0 * 4 + 2];
      let b03 = b[0 * 4 + 3];
      let b10 = b[1 * 4 + 0];
      let b11 = b[1 * 4 + 1];
      let b12 = b[1 * 4 + 2];
      let b13 = b[1 * 4 + 3];
      let b20 = b[2 * 4 + 0];
      let b21 = b[2 * 4 + 1];
      let b22 = b[2 * 4 + 2];
      let b23 = b[2 * 4 + 3];
      let b30 = b[3 * 4 + 0];
      let b31 = b[3 * 4 + 1];
      let b32 = b[3 * 4 + 2];
      let b33 = b[3 * 4 + 3];

      return [
        b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
        b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
        b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
        b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
        b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
        b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
        b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
        b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
        b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
        b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
        b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
        b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
        b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
        b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
        b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
        b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
      ];
    },

    xRotation: function(angle) {
      let c = Math.cos(angle);
      let s = Math.sin(angle);

      return [
        1, 0, 0, 0,
        0, c, s, 0,
        0, -s, c, 0,
        0, 0, 0, 1
      ];
    },

    yRotation: function(angle) {
      let c = Math.cos(angle);
      let s = Math.sin(angle);

      return [
        c, 0, -s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1
      ];
    },

    zRotation: function(angle) {
      let c = Math.cos(angle);
      let s = Math.sin(angle);

      return [
        c, s, 0, 0,
        -s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ];
    },

    xRotate: function(m, angle) {
      return m4.multiply(m, m4.xRotation(angle));
    },

    yRotate: function(m, angle) {
      return m4.multiply(m, m4.yRotation(angle));
    },

    zRotate: function(m, angle) {
      return m4.multiply(m, m4.zRotation(angle));
    },
  };

  function handleMouseUp() {
    isDragging = false;
  }

  function handleMouseDown(event: any) {
    isDragging = true;
    oldPos = { x: event.pageX, y: event.pageY };

    return false;
  }

  function handleMouseMove(event: any) {
    if (!isDragging) return false;

    const dx = event.pageX - oldPos.x;
    const dy = event.pageY - oldPos.y;

    oldPos = { x: event.pageX, y: event.pageY };

    rotate[0] = event.pageX / 700;
    rotate[1] = event.pageY / 700;

    draw();
  }

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
    }`,);
    const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, `#version 300 es
    #pragma vscode_glsllint_stage: frag
    precision mediump float;

    in vec3 fragCol;
    out vec4 outCol;

    void main() {
      outCol = vec4(fragCol, 1.);
    }`,);

    const prog = createProgram(gl, vertShader, fragShader);
    const posAttrLoc = gl.getAttribLocation(prog, "vertPos");
    const colAttrLoc = gl.getAttribLocation(prog, "vertCol");
    const matLoc = gl.getUniformLocation(prog, "uMat");

    let xRotateMat = m4.xRotation(rotate[0]);
    let yRotateMat = m4.yRotation(rotate[1]);

    // let mat = m4.identity();
    let mat = m4.multiply(xRotateMat, yRotateMat);

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

    gl.drawArrays(gl.TRIANGLES, 0, 2 * 3);
  }

  onMount(() => draw());
</script>

<canvas
  width=500
  height=500
  class="bg-blue-500 pointer-events-auto"
  on:mouseup={() => handleMouseUp()}
  on:mousedown|preventDefault={(e) => handleMouseDown(e)}
  on:mousemove|preventDefault={(e) => handleMouseMove(e)}
  bind:this={canvasEl}
/>