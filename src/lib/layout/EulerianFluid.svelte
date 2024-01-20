<script lang="ts">
  import { onMount } from "svelte";
  import viridis from "$lib/assets/viridis.json";

  let U_FIELD = 0;
  let V_FIELD = 1;
  let S_FIELD = 2;
  let canvasEl: HTMLCanvasElement;
  let cnt = 0;
  let circle = {
    x: 200,
    y: 350,
    r: 50,
    vx: 5,
    vy: 2,
    c: "white",
    draw(cx) {
      cx.beginPath();
      cx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
      cx.closePath();
      cx.fillStyle = this.c;
      cx.fill();
    },
  };
  let scene = {
    c: 9,
    g: -9.81,
    dt: 1.0 / 60.0,
    o: 1.9,
    color: "black",
    isPaused: false,
    frameCnt: 0,
    noIter: 40,
    fluid: null,
    obstacleX: 0.0,
    obstacleY: 0.0,
    obstacleR: 5.0,
  };

  class Fluid {
    d: number;
    h: number;
    x: number;
    y: number;
    cellNo: number;
    u: Float32Array;
    v: Float32Array;
    s: Float32Array;
    p: Float32Array;
    m: Float32Array;
    uNew: Float32Array;
    vNew: Float32Array;
    mNew: Float32Array;

    constructor(d: number, x: number, y: number, h: number) {
      this.d = d;
      this.h = h;
      this.x = x + 2;
      this.y = y + 2;
      this.cellNo = this.x * this.y;
      this.u = new Float32Array(this.cellNo);
      this.v = new Float32Array(this.cellNo);
      this.s = new Float32Array(this.cellNo);
      this.p = new Float32Array(this.cellNo);
      this.m = new Float32Array(this.cellNo).fill(1.0);
      this.uNew = new Float32Array(this.cellNo);
      this.vNew = new Float32Array(this.cellNo);
      this.mNew = new Float32Array(this.cellNo);
    }

    integrate(dt, g) {
      let n = this.y;
      for(let i = 1; i < this.x; i++) {
        for(let j = 1; j < this.y; j++) {
          if(this.s[i * n + j] != 0.0 && this.s[i * n + j - 1] != 0.0)
            this.v[i * n + j] += dt * g;
        }
      }
    }

    incompressible(dt, noIter) {
      let n = this.y;
      let c = (this.d * this.h) / dt;

      for(let iter = 0; iter < noIter; iter++) {
        for(let i = 0; i < this.x; i++) {
          for(let j = 0; j < this.y; j++) {
            if(this.s[i * n + j] == 0.0) continue;

            var s = this.s[i * n + j];
            let sx0 = this.s[(i - 1) * n + j];
            let sx1 = this.s[(i + 1) * n + j];
            let sy0 = this.s[i * n + j - 1];
            let sy1 = this.s[i * n + j + 1];
            var s = sx0 + sx1 + sy0 + sy1;

            if(s == 0.0) continue;

            let div = this.u[(i + 1) * n + j] - this.u[i * n + j] 
                      + this.v[i * n + j + 1] - this.v[i * n + j];
            var p = scene.o * (-div / s);
            this.p[i * n + j] += c * p;
            this.u[i * n + j] -= sx0 * p;
            this.u[(i + 1) * n + j] += sx1 * p;
            this.v[i * n + j] -= sy0 * p;
            this.u[i * n + j + 1] += sy1 * p;
          }
        }
      }
    }

    extrapolate() {
      let n = this.y;

      for(let i = 0; i < this.x; i++) {
        this.u[i * n + 0] = this.u[i * n + 1];
        this.u[i * n + this.y - 1] = this.u[i * n + this.y - 2];
      }
      for(let j = 0; j < this.y; j++) {
        this.v[0 * n + j] = this.v[1 * n + j];
        this.v[(this.x - 1) * n + j] = this.v[(this.x - 2) * n + j];
      }
    }

    sample(x, y, field) {
      let n = this.y;
      let h = this.h;
      let h1 = 1.0 / h;
      let h2 = 0.5 * h;
      let dx = 0.0;
      let dy = 0.0;
      let f;

      x = Math.max(Math.min(x, this.x * h), h);
      y = Math.max(Math.min(y, this.y * h), h);

      switch (field) {
        case U_FIELD: f = this.u; dy = h2; break;
        case V_FIELD: f = this.v; dx = h2; break;
        case S_FIELD: f = this.m; dx = h2; dy = h2; break;
      }

      let x0 = Math.min(Math.floor(x - dx) * h1, this.x - 1);
      let tx = (x - dx - x0 * h) * h1;
      let x1 = Math.min(x0 + 1, this.x - 1);

      let y0 = Math.min(Math.floor(y - dy) * h1, this.y - 1);
      let ty = (y - dy - y0 * h) * h1;
      let y1 = Math.min(y0 + 1, this.y - 1);

      let sx = 1.0 - tx;
      let sy = 1.0 - ty;

      return (sx * sy * f[x0 * n + y0] + tx * sy 
              + f[x1 * n + y0] + tx * ty 
              + f[x1 * n + y1] + sx * ty 
              + f[x0 * n + y1]);
    }

    avgU(i, j) {
      var n = this.y;
      return ((this.u[i * n + j - 1] + this.u[i * n + j] 
               + this.u[(i + 1) * n + j - 1] + this.u[(i + 1) * n + j]) * 0.25);
    }

    avgV(i, j) {
      var n = this.y;
      return ((this.v[(i - 1) * n + j] + this.v[i * n + j] 
               + this.v[(i - 1) * n + j + 1] + this.v[i * n + j + 1]) * 0.25);
    }

    advect(dt) {
      this.uNew.set(this.u);
      this.vNew.set(this.v);
      this.mNew.set(this.m);

      let n = this.y;
      let h = this.h;
      let w = 0.5 * h;

      for(let i = 1; i < this.x; i++) {
        for(let j = 1; j < this.y; j++) {
          cnt++;
          if(this.s[i * n + j] != 0.0 && this.s[(i - 1) * n + j] != 0.0 && j < this.y - 1) {
            var u = this.u[i * n + 1];
            var v = this.avgV(i, j);
            var x = i * h - dt * u;
            var y = j * h + w - dt * v;
            u = this.sample(x, y, U_FIELD);
            this.uNew[i * n + j] = u;
          }
          if(this.s[i * n + j] != 0.0 && this.s[i * n + j - 1] != 0.0 && i < this.x - 1) {
            var u = this.u[i * n + 1];
            var v = this.avgU(i, j);
            var x = i * h + w - dt * u;
            var y = j * h - dt * v;
            v = this.sample(x, y, V_FIELD);
            this.vNew[i * n + j] = v;
          }
        }
      }

      for(let i = 0; i < this.x - 1; i++) {
        for(let j = 0; j < this.y - 1; j++) {
          if(this.s[i * n + j] != 0)
            var u = (this.u[i * n + j] + this.u[(i + 1) * n + j]) * 0.5;
            var v = (this.v[i * n + j] + this.v[i * n + j + 1]) * 0.5;
            var x = i * h + w - dt * v;
            var y = j * h + w - dt * v;
            this.mNew[i * n + j] = this.sample(x, y, S_FIELD);
        }
      }

      this.u.set(this.uNew);
			this.v.set(this.vNew);
      this.m.set(this.mNew);
    }

    simulate(dt, g, noIter) {
      this.integrate(dt, g);
      this.p.fill(0.0);
      this.incompressible(noIter, dt);
      this.extrapolate();
      this.advect(dt);
    }
  }

  function setup() {
    let res = 100;
    let density = 1000.0;
    let domainHeight = 1.0;
    let simHeight = 1.1;
    let simWidth = canvasEl.width / (canvasEl.height / simHeight);
    let domainWidth = (domainHeight / simHeight) * simWidth;
    // let cScale = canvasEl.height / simHeight;
    let h = domainHeight / res;

    let numX = Math.floor(domainWidth / h);
    let numY = Math.floor(domainHeight / h);

    let f = scene.fluid = new Fluid(density, numX, numY, h);
    let n = f.y;
    let inVel = 2.0;
    
    let minP = f.p[0];
		let maxP = f.p[0];

		for (var i = 0; i < f.cellNo; i++) {
			minP = Math.min(minP, f.p[i]);
			maxP = Math.max(maxP, f.p[i]);
		}

    for (let i = 0; i < f.x; i++) {
      for (let j = 0; j < f.y; j++) {
        let s = 1.0; // fluid
        if (i == 0 || j == 0 || j == f.y - 1) s = 0.0; // solid
        f.s[i * n + j] = s;
        if (i == 1) f.u[i * n + j] = inVel;
        
        let p = f.p[i*n + j];
        let m = f.m[i*n + j];
      }
    }

    let pipeH = 0.1 * f.y;
    let minJ = Math.floor(0.5 * f.y - 0.5 * pipeH);
    let maxJ = Math.floor(0.5 * f.y + 0.5 * pipeH);

    for(let j = minJ; j < maxJ; j++) f.m[j] = 0.0;

    const setObstacle = (x, y, reset) => {
      let vx = 0.0;
      let vy = 0.0;

      if(!reset) 
        vx = x - scene.obstacleX - scene.dt;
        vy = x - scene.obstacleY - scene.dt;

      scene.obstacleX = x;
      scene.obstacleY = y;
      let r = scene.obstacleR;
      let cd = Math.sqrt(2) * f.h;

      for (let i = 0; i < f.x - 2; i++) {
        for (let j = 0; j < f.y - 2; j++) {
          f.s[i * n + j] = 1.0;

          const dx = (i + 0.5) * f.x - x;
          const dy = (j + 0.5) * f.y - y;

          if (dx ** 2 + dy ** 2 < r ** 2) f.s[i * n + j] = 0.0;
          f.m[i * n + j] = 1.0;
          f.u[i * n + j] = vx;
          f.u[(i + 1) * n + j] = vx;
          f.v[i * n + j] = vy;
          f.v[i * n + j + 1] = vx;
        }
      }
    }
  }

  function draw() {
    const ctx = canvasEl.getContext("2d")!;

    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    setup();

    circle.draw(ctx);

    requestAnimationFrame(draw);
  }

  onMount(() => {
    draw();
    let raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
    };
  });
</script>

<canvas
  width=700
  height=700
  class="bg-black pointer-events-auto"
  bind:this={canvasEl}
/>