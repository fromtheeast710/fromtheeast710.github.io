// @ts-nocheck
import { writable } from "svelte/store";

export let pageNo = writable(0);
export let isUp = writable(Array(4).fill(false));

export function tide(n) {
  let w1 = document.getElementById("wave1")!;
  let w2 = document.getElementById("wave2")!;
  let w3 = document.getElementById("wave3")!;
  let w4 = document.getElementById("wave4")!;
  const tideRise = [{ transform: "translateY(-84.73%)" }];
  const tideFall = [{ transform: "translateY(0%)" }];
  const tideTiming = {
    duration: 1000,
    easing: "ease-in-out",
    iterations: 1,
    fill: "forwards",
  };

  if(n === 1) {
    w1.animate(tideRise, tideTiming);
    w2.animate(tideFall, { duration: 1400, easing: "ease-out", fill: "forwards" });
    w3.animate(tideFall, { duration: 1200, easing: "ease-out", fill: "forwards" });
    w4.animate(tideFall, { duration: 1000, easing: "ease-out", fill: "forwards" });
  } else if(n === 2) {
    w1.animate(tideRise, tideTiming);
    w2.animate(tideRise, tideTiming);
    w3.animate(tideFall, { duration: 1200, easing: "ease-out", fill: "forwards" });
    w4.animate(tideFall, { duration: 1000, easing: "ease-out", fill: "forwards" });
  } else if(n === 3) {
    w1.animate(tideRise, tideTiming);
    w2.animate(tideRise, tideTiming);
    w3.animate(tideRise, tideTiming);
    w4.animate(tideFall, { duration: 1000, easing: "ease-out", fill: "forwards" });
  } else if(n === 4) {
    w1.animate(tideRise, tideTiming);
    w2.animate(tideRise, tideTiming);
    w3.animate(tideRise, tideTiming);
    w4.animate(tideRise, tideTiming);
  } else if(n === 0) {
    w1.animate(tideFall, { duration: 1600, easing: "ease-out", fill: "forwards" });
    w2.animate(tideFall, { duration: 1400, easing: "ease-out", fill: "forwards" });
    w3.animate(tideFall, { duration: 1200, easing: "ease-out", fill: "forwards" });
    w4.animate(tideFall, { duration: 1000, easing: "ease-out", fill: "forwards" });
  }
}