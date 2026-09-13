/* ============================================================
   Solar System — liquid-chrome primary CTA
   Vanilla WebGL re-creation of the "LiquidChrome" effect (21st.dev
   ChromeButton). The original component's source wasn't provided and
   is purely decorative, so this is a faithful re-author, not a byte
   copy: a flowing metallic domain-warp, recoloured teal-black and
   kept restrained. Applied to exactly ONE primary CTA per view.

   Graceful fallback: without WebGL/JS the button keeps its amber
   .btn--primary styling, so the call-to-action never depends on this.
   ============================================================ */
(function () {
  "use strict";
  var btn = document.getElementById("primaryCta");
  if (!btn) return;

  /* skip on low-power devices — the cosmic background already runs one
     WebGL context; a second full-rate one here (plus the 16 orbit
     transforms) is what makes cheap phones stutter. Same heuristic as
     js/background.js. The amber .btn--primary styling remains untouched,
     so the CTA never depends on this enhancement. */
  var nav = window.navigator || {};
  var lowPower =
    (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) ||
    (nav.deviceMemory && nav.deviceMemory <= 4) ||
    (nav.connection && nav.connection.saveData) || false;
  if (lowPower) return; // amber pill remains

  var canvas = document.createElement("canvas");
  var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) return; // amber pill remains

  /* move the button's label/icon into a layer above the canvas */
  var label = document.createElement("span");
  label.className = "liquid-label";
  while (btn.firstChild) label.appendChild(btn.firstChild);
  canvas.className = "liquid-canvas";
  canvas.setAttribute("aria-hidden", "true");
  btn.appendChild(canvas);
  btn.appendChild(label);
  btn.classList.add("has-liquid");

  var VERT = "attribute vec2 position; void main(){ gl_Position = vec4(position,0.0,1.0); }";
  var FRAG = [
    "precision highp float;",
    "uniform vec2  u_res;",
    "uniform float u_time;",
    "uniform vec3  u_base;",
    "uniform float u_amp;",
    "void main(){",
    "  vec2 uv = gl_FragCoord.xy / u_res;",
    "  vec2 p = uv * 3.0;",
    "  for(float i = 1.0; i < 6.0; i++){",
    "    p.x += u_amp/i * sin(i*3.0*p.y + u_time) + u_time*0.08;",
    "    p.y += u_amp/i * cos(i*3.0*p.x + u_time*0.9);",
    "  }",
    "  float v = 0.5 + 0.5*sin(p.x + p.y);",
    "  vec3 teal = vec3(0.16, 0.45, 0.5);",
    "  vec3 spec = vec3(0.85, 0.97, 0.97);",
    "  vec3 col = u_base + teal * smoothstep(0.25, 0.95, v);",
    "  col += spec * pow(v, 9.0) * 0.5;",     // sharp metallic glints
    "  gl_FragColor = vec4(col, 1.0);",
    "}",
  ].join("\n");

  function compile(t, s) { var sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh); return sh; }

  /* GL resources behind a re-runnable setup, so a lost context can be rebuilt
     rather than leaving a permanently blank canvas (see the handlers below). */
  var prog, buf, pos, loc;
  function setupGL() {
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
    gl.useProgram(prog);

    buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    pos = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    loc = {
      res: gl.getUniformLocation(prog, "u_res"),
      time: gl.getUniformLocation(prog, "u_time"),
      base: gl.getUniformLocation(prog, "u_base"),
      amp: gl.getUniformLocation(prog, "u_amp"),
    };
    gl.viewport(0, 0, canvas.width, canvas.height);
    return true;
  }
  if (!setupGL()) { btn.classList.remove("has-liquid"); return; }

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.max(1, Math.floor(btn.clientWidth * dpr));
    var h = Math.max(1, Math.floor(btn.clientHeight * dpr));
    if (canvas.width === w && canvas.height === h) return false;
    canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h);
    return true;
  }
  /* Same clear-on-resize trap as js/background.js, and it fires on virtually
     every load: the web fonts land after this script runs, which changes the
     button's width. Under reduced motion there is no loop to repaint, so the
     metallic surface would be wiped within a second of load. */
  function onResize() { if (resize() && reduce) draw(1200); }
  if (window.ResizeObserver) new ResizeObserver(onResize).observe(btn); else window.addEventListener("resize", onResize);
  resize();

  function draw(t) {
    gl.uniform2f(loc.res, canvas.width, canvas.height);
    gl.uniform1f(loc.time, t * 0.001 * 2.0);   // speed ≈ 2
    gl.uniform3f(loc.base, 0.031, 0.078, 0.078); // near-black teal
    gl.uniform1f(loc.amp, 0.32);                 // restrained amplitude
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var raf = null, visible = true;
  function loop(t) { if (visible) draw(t); raf = window.requestAnimationFrame(loop); }

  if (reduce) {
    draw(1200); // one static frame with some warp
  } else {
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(btn);
    }
    raf = window.requestAnimationFrame(loop);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { if (raf) { window.cancelAnimationFrame(raf); raf = null; } }
      else if (!raf) { raf = window.requestAnimationFrame(loop); }
    });
  }

  /* Context loss: stop the loop and allow restoration. On failure the button
     keeps its solid .has-liquid pill styling, so the CTA stays readable. */
  canvas.addEventListener("webglcontextlost", function (e) {
    e.preventDefault();
    if (raf) { window.cancelAnimationFrame(raf); raf = null; }
  }, false);
  canvas.addEventListener("webglcontextrestored", function () {
    if (!setupGL()) { btn.classList.remove("has-liquid"); return; }
    if (reduce) draw(1200);
    else if (!raf) raf = window.requestAnimationFrame(loop);
  }, false);
})();
