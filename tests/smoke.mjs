import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { activities, levels, states, statsForState } from "../script.js";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../styles.css", import.meta.url), "utf8");

assert.match(html, /Partido de la Caca/);
assert.match(html, /assets\/favicon\.png/);
assert.match(html, /caca-mascot\.png/);
assert.match(html, /id="registro"/);
assert.match(html, /id="actividades"/);
assert.match(css, /position: fixed/);
assert.match(css, /@media \(max-width: 560px\)/);
assert.equal((await stat(new URL("../assets/caca-mascot.png", import.meta.url))).isFile(), true);
assert.equal((await stat(new URL("../assets/favicon.png", import.meta.url))).isFile(), true);
assert.equal(states.includes("Quintana Roo"), true);
assert.equal(activities.length, 6);
assert.equal(levels.at(-1)[0], "Leyenda del cagadero");
assert.equal(statsForState("Jalisco").volunteers > 0, true);
