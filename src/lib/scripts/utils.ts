// @ts-nocheck
import { writable } from "svelte/store";

export let pageNo = writable(0);
export let isUp = writable(Array(4).fill(false));

export function tide(n) {
  var wave1 = document.getElementById("wave1");
  var wave2 = document.getElementById("wave2");
  var wave3 = document.getElementById("wave3");
  var wave4 = document.getElementById("wave4");
  const tideRise = [{ transform: "translateY(-81.5vh)" }];
  const tideFall = [{ transform: "translateY(0vh)" }];
  const tideTiming = {
    duration: 1000,
    easing: "ease-in-out",
    iterations: 1,
    fill: "forwards",
  };

  if(n === 1) {
    wave1?.animate(tideRise, tideTiming);
    wave2?.animate(tideFall, { duration: 1400, easing: "ease-out", fill: "forwards" });
    wave3?.animate(tideFall, { duration: 1200, easing: "ease-out", fill: "forwards" });
    wave4?.animate(tideFall, { duration: 1000, easing: "ease-out", fill: "forwards" });
  } else if(n === 2) {
    wave1?.animate(tideRise, tideTiming);
    wave2?.animate(tideRise, tideTiming);
    wave3?.animate(tideFall, { duration: 1200, easing: "ease-out", fill: "forwards" });
    wave4?.animate(tideFall, { duration: 1000, easing: "ease-out", fill: "forwards" });
  } else if(n === 3) {
    wave1?.animate(tideRise, tideTiming);
    wave2?.animate(tideRise, tideTiming);
    wave3?.animate(tideRise, tideTiming);
    wave4?.animate(tideFall, { duration: 1000, easing: "ease-out", fill: "forwards" });
  } else if(n === 4) {
    wave1?.animate(tideRise, tideTiming);
    wave2?.animate(tideRise, tideTiming);
    wave3?.animate(tideRise, tideTiming);
    wave4?.animate(tideRise, tideTiming);
  } else if(n === 0) {
    wave1?.animate(tideFall, { duration: 1600, easing: "ease-out", fill: "forwards" });
    wave2?.animate(tideFall, { duration: 1400, easing: "ease-out", fill: "forwards" });
    wave3?.animate(tideFall, { duration: 1200, easing: "ease-out", fill: "forwards" });
    wave4?.animate(tideFall, { duration: 1000, easing: "ease-out", fill: "forwards" });
  }
}