<script lang="ts">
  import { onMount } from "svelte";
  import viridis from "$lib/assets/viridis.json";

  let canvasEl: HTMLCanvasElement;
  let scene = {
    g: 0.,
    o: 1.,
    dt: 1./120.,
    cnt: 0,
    fluid: undefined,
  }

  enum Field {
    U_FIELD,
    V_FIELD,
    S_FIELD,
  }

  class Fluid {
    d: number;
    h: number;
    numX: number;
    numY: number;
    numC: number;
    u: Float32Array;
    v: Float32Array;
    s: Float32Array;
    p: Float32Array;
    m: Float32Array;
    newV: Float32Array;
    newU: Float32Array;
    newM: Float32Array;

    constructor(d: number, numX: number, numY: number, h: number) {
      this.d = d;
      this.h = h;
      this.numX = numX + 2;
      this.numY = numY + 2;
      this.numC = this.numX * this.numY;
      this.u = new Float32Array(this.numC);
      this.v = new Float32Array(this.numC);
      this.p = new Float32Array(this.numC);
      this.s = new Float32Array(this.numC);
      this.m = new Float32Array(this.numC).fill(1.0);
      this.newV = new Float32Array(this.numC);
      this.newU = new Float32Array(this.numC);
      this.newM = new Float32Array(this.numC);
    }

    integrate(dt: number, g: number) {
      let n = this.numY;

      for(let i = 1; i < this.numX; i++)
        for(let j = 1; j < this.numY - 1; j++)
          if(this.s[i*n + j] != 0. && this.s[i*n + j - 1] != 0.)
            this.v[i*n + j] += g*dt;
    }
    
    incompressible(numIters: number, dt: number) {
      let n = this.numY;
      let c = this.d*this.h / dt;

      for(let iter = 0; iter < numIters; iter++) {
        for(let i = 1; i < this.numX - 1; i++) {
          for(let j = 1; j < this.numY  - 1; j++) {
            if(this.s[i*n + j] == 0.)
              continue;

            let s = this.s[i*n + j];
            let sx0 = this.s[(i - 1)*n + j];
            let sx1 = this.s[(i - 1)*n + j];
            let sy0 = this.s[i*n + j - 1];
            let sy1 = this.s[i*n + j + 1];

            if(s == 0.)
              continue;

            let div = this.u[(i + 1)*n + j] - this.u[i*n + j] + this.v[i*n + j + 1] - this.v[i*n + j]; 
            let p = -div/s;

            p *= scene.o;
            this.p[i*n + j] += c*p;
            this.u[i*n + j] -= sx0 * p;
            this.u[(i + 1)*n + j] += sx1 * p;
            this.v[i*n + j] -= sy0 * p;
            this.v[i+n + j + 1] += sy1 * p;
          }
        }
      }
    }

    extrapolate() {
      let n = this.numY;

      for(let i = 0; i < this.numX; i++) {
        this.u[i*n] - this.u[i*n + 1];
        this.u[i*n + this.numY - 1] = this.u[i*n + this.numY - 2];
      }
      for(let j = 0; j < this.numY; j++) {
        this.v[0*n + j] = this.v[n + j];
        this.v[(this.numX - 1)*n + j] = this.v[(this.numX - 2)*n + j];
      }
    }

    sampleField(x: number, y: number, field: number) {
      let n = this.numY;
      let h = this.h;
      let h1 = 1.0/h;
      let h2 = h/2;
      let dx = 0.;
      let dy = 0.;
      let f;

      x = Math.max(Math.min(x, this.numX * h), h);
      y = Math.max(Math.min(y, this.numY * h), h);
    
      switch(field) {
        case Field.U_FIELD: f = this.u; dy = h2; break;
        case Field.V_FIELD: f = this.v; dx = h2; break;
        case Field.S_FIELD: f = this.m; dx = h2; dy = h2; break;
      }

      let x0 = Math.min(Math.floor((x - dx)*h1), this.numX - 1);
      let tx = ((x - dx) - x0*h)*h1;
      let x1 = Math.min(x0 + 1, this.numX - 1);

      let y0 = Math.min(Math.floor((y - dy)*h1), this.numY - 1);
      let ty = ((y - dy) - y0*h)*h1;
      let y1 = Math.min(y0 + 1, this.numY - 1);

      let sx = 1. - tx;
      let sy = 1. - ty;

      let val = sx*sy*f[x0*n + y0] + tx*sy*f[x1*n + y0] + tx*ty*f[x1*n + y1] + sx*ty*f[x0*n + y1];
    
      return val;
    }

    avgU(i: number, j: number) {
      let n = this.numY;
      return (this.u[i*n + j - 1] + this.u[i*n + j] + this.u[(i + 1)*n + j - 1] + this.u[(i + 1)*n + j])*0.25;
    }

    avgV(i: number, j: number) {
      let n = this.numY;
      return (this.v[(i - 1)*n + j] + this.v[i*n + j] + this.v[(i - 1)*n + j + 1] + this.v[i*n + j + 1])*0.25;
    }

    advectVel(dt: number) {
      this.newU.set(this.u);
      this.newV.set(this.v);

      let n = this.numY;
      let h = this.h;
      let h2 = h / 2;

      for(let i = 1; i < this.numX; i++) {
        for(let j = 1; j < this.numY; j++) {
          scene.cnt++;

          if(this.s[i*n + j] != 0. && this.s[(i - 1)*n + j] != 0. && j < this.numY - 1) {
            let x = i*h;
            let y = j*h + h2;
            let u = this.u[i*n + j];
            let v = this.avgV(i, j);

            x -= dt*u;
            y -= dt*v;
            u = this.sampleField(x, y, Field.U_FIELD);
            this.newU[i*n + j] = u;
          }
          if(this.s[i*n + j] != 0. && this.s[i*n + j - 1] != 0. && i < this.numX - 1) {
            let x = i*h + h2;
            let y = j*h;
            let u = this.avgU(i, j);
            let v = this.v[i*n + j];

            x -= dt*u;
            y -= dt*v;
            v = this.sampleField(x, y, Field.V_FIELD);
            this.newV[i*n + j] = v;
          }
        }
      }

      this.u.set(this.newU);
      this.v.set(this.newV);
    }

    advectSmoke(dt: number) {
      this.newM.set(this.m);

      let n = this.numY;
      let h = this.h;
      let h2 = h/2;

      for(let i = 1; i < this.numX - 1; i++) {
        for(let j = 1; j < this.numY - 1; j++) {
          if(this.s[i*n + j] != 0.) {
            let u = (this.u[i*n + j] + this.u[(i + i)*n + j])*0.5;
            let v = (this.v[i*n + j] + this.v[i*n + j + 1])*0.5;
            let x = i*h + h2 - dt*u;
            let y = j* h2 - dt*v;

            this.newM[i*n + j] = this.sampleField(x, y, Field.S_FIELD);
          }
        }
      }
      this.m.set(this.newM);
    }

    simulate(dt: number, g: number, numIters: number) {
      this.integrate(dt, g);

      this.p.fill(0.);
      this.incompressible(numIters, dt);

      this.extrapolate();
      this.advectVel(dt);
      this.advectSmoke(dt);
    }
  }

  function draw() {
    const ctx = canvasEl.getContext("2d")!;
    let height = 5;
    let numX = 100;
    let numY = 100;
    let density = 1000.0;
    let simW = numX * height;
    let simH = numY * height;

    let f = scene.fluid = new Fluid(density, numX, numY, height);
    let n = f.numY;

    // Setup the obstacle
    for(let i = 1; i < f.numX - 2; i++) {
      for(let j = 1; j < f.numX - 2; i++) {
        f.s[i*n + j] = 1.;
      }
    }

    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    requestAnimationFrame(draw);
  }

  onMount(() => {
    draw();

    return () => {
      cancelAnimationFrame(requestAnimationFrame(draw));
    };
  });
</script>

<canvas 
  width=500 
  height=500 
  class="bg-black pointer-events-auto" 
  bind:this={canvasEl}
/>