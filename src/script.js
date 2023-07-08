/* This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
window.addEventListener("DOMContentLoaded", async () => {
  async function e(t) {
    let a = t.getAttribute("data-include"),
      l = await fetch(a),
      n = await l.text(),
      r = document.createElement("template");
    r.innerHTML = n.trim();
    let i = r.content.cloneNode(!0),
      o = t.parentElement;
    if (o) {
      let c = t.innerHTML.trim(),
        d = i.querySelectorAll("[data-content]"),
        m = Array.from(
          d,
          (e) =>
            new Promise((t) => {
              let a = e.tagName.toLowerCase();
              (e["input" === a || "textarea" === a ? "value" : "innerHTML"] =
                c),
                t();
            })
        );
      await Promise.all(m);
      let u = document.createDocumentFragment(),
        f = Array.from(i.childNodes);
      f.forEach((e) => u.appendChild(e)), o.insertBefore(u, t), t.remove();
    }
    let w = document.querySelectorAll("[data-include]");
    await Promise.all(Array.from(w, e));
  }
  let t = document.querySelectorAll("[data-include]");
  await Promise.all(Array.from(t, e));
});
