/* @copyright Stadt Wien - Wiener Melange v2 */
import{x as t}from"./lit-element-a22611a3.js";import{e as s,i as e,t as i}from"./directive-19e462f3.js";
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const n=s(class extends e{constructor(t){var s;if(super(t),t.type!==i.ATTRIBUTE||"class"!==t.name||(null===(s=t.strings)||void 0===s?void 0:s.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((s=>t[s])).join(" ")+" "}update(s,[e]){var i,n;if(void 0===this.nt){this.nt=new Set,void 0!==s.strings&&(this.st=new Set(s.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in e)e[t]&&!(null===(i=this.st)||void 0===i?void 0:i.has(t))&&this.nt.add(t);return this.render(e)}const r=s.element.classList;this.nt.forEach((t=>{t in e||(r.remove(t),this.nt.delete(t))}));for(const t in e){const s=!!e[t];s===this.nt.has(t)||(null===(n=this.st)||void 0===n?void 0:n.has(t))||(s?(r.add(t),this.nt.add(t)):(r.remove(t),this.nt.delete(t)))}return t}});export{n as o};
