import { writable } from "svelte/store";

export let pageNo = writable(0);
export let isUp = writable(Array(4).fill(false));