<script lang="ts">
  import { onMount } from "svelte";
  import { compileShader, createProgram} from "$lib/scripts/webgl";

  let canvasEl: HTMLCanvasElement;
  let isDragging = false;
  let rotate = [0, 0];
  let oldPos = { x: 0, y: 0 };
  let frac = 1;

  let shaderPos = new Float32Array([
    1, 0, -1/Math.sqrt(2),
    -1, 0, -1/Math.sqrt(2),
    0, 1, 1/Math.sqrt(2),

    1, 0, -1/Math.sqrt(2),
    -1, 0, -1/Math.sqrt(2),
    0, -1, 1/Math.sqrt(2),

    1, 0, -1/Math.sqrt(2),
    0, 1, 1/Math.sqrt(2),
    0, -1, 1/Math.sqrt(2),

    -1, 0, -1/Math.sqrt(2),
    0, 1, 1/Math.sqrt(2),
    0, -1, 1/Math.sqrt(2),
  ]);
  let shaderCol = new Uint8Array([
    255, 0, 0,
    0, 255, 0,
    0, 0, 255,

    255, 0, 0,
    0, 255, 0,
    0, 0, 255,

    255, 0, 0,
    0, 255, 0,
    0, 0, 255,

    255, 0, 0,
    0, 255, 0,
    0, 0, 255,
  ]);

  let m4 = {
    multiply: function(a: any, b: any) {
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
        b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
      ];
    },

    xRotate: function(angle: any) {
      let c = Math.cos(angle);
      let s = Math.sin(angle);

      return [
        1, 0, 0, 0,
        0, c, s, 0,
        0, -s, c, 0,
        0, 0, 0, 1
      ];
    },

    yRotate: function(angle: any) {
      let c = Math.cos(angle);
      let s = Math.sin(angle);

      return [
        c, 0, -s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1
      ];
    },
  };

  function handleWheel(event: any) {
    function calcMidPoint(a: any, b: any, c: any) {
      return [(a + b)/2, (b + c)/2, (c + a)/2];
    }

    if(event.deltaY < 0) {
      frac >= 9 ? frac = 9 : frac += 1;

      // shaderPos = new Float32Array([...shaderPos, calcMidPoint(shaderPos[1], shaderPos[2], shaderPos[3]))]);
      // shaderCol = new Uint8Array([...shaderCol, ]);
      console.log(shaderPos);

      draw();
    } else {
      frac <= 1 ? frac = 1 : frac -= 1;

      console.log(frac);

      draw();
    }
  }

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

    rotate[0] += dy * 0.01;
    rotate[1] += dx * 0.01;

    draw();
  }

  function draw() {
    const gl = canvasEl.getContext("webgl2")!;

    const progGeoBfr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, progGeoBfr);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      Float32Array.from(shaderPos, z => z * 1/1.22),
      gl.STATIC_DRAW
    );
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

    let xRotateMat = m4.xRotate(rotate[0]);
    let yRotateMat = m4.yRotate(rotate[1]);
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

    gl.drawArrays(gl.TRIANGLES, 0, frac *  4 * 3);
  }

  onMount(() => draw());
</script>

<canvas
  width=500
  height=500
  class="bg-blue-500 pointer-events-auto"
  on:wheel={(e) => handleWheel(e)}
  on:mouseup={() => handleMouseUp()}
  on:mousedown|preventDefault={(e) => handleMouseDown(e)}
  on:mousemove|preventDefault={(e) => handleMouseMove(e)}
  bind:this={canvasEl}
/>