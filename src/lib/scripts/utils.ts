import { writable } from "svelte/store";

export let pageNo = writable(0);
export let showNavbar = writable(false);