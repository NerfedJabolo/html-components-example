/*
MIT License

Copyright (c) 2023 Sten Kahu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
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
