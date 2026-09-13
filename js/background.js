/* ============================================================
   Solar System — cosmic background
   Vanilla WebGL port of the "Velaris" living-gradient (21st.dev).
   The GLSL is kept verbatim; only the React wrapper is replaced.
   Recoloured to the teal palette and heavily restrained per the
   project's cosmic-environment + performance rules:
     • speed 0.25, grain 0.15 (subtle, not a colourful texture)
     • prefers-reduced-motion → one static frame, no loop
     • pauses when the tab is hidden
     • resolution capped (blurry noise needs no more)
     • no WebGL / no JS → the CSS .cosmos__fallback shows instead
   ============================================================ */
(function () {
  "use strict";
  var canvas = document.getElementById("bg");
  if (!canvas) return;
  var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) return; // CSS fallback remains visible

  var VERT = [
    "attribute vec2 position;",
    "varying vec2 vUv;",
    "void main(){ vUv = position * 0.5 + 0.5; gl_Position = vec4(position,0.0,1.0); }",
  ].join("\n");

  var FRAG = [
    "precision highp float;",
    "varying vec2 vUv;",
    "uniform vec2  u_resolution;",
    "uniform float u_time;",
    "uniform float u_grain;",
    "uniform vec3  u_colors[4];",
    "uniform vec3  u_bg;",
    "vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }",
    "float snoise(vec2 v){",
    "  const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);",
    "  vec2 i = floor(v + dot(v, C.yy));",
    "  vec2 x0 = v - i + dot(i, C.xx);",
    "  vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);",
    "  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;",
    "  i = mod(i, 289.0);",
    "  vec3 p = permute( permute( i.y + vec3(0.0,i1.y,1.0)) + i.x + vec3(0.0,i1.x,1.0));",
    "  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);",
    "  m = m*m; m = m*m;",
    "  vec3 x = 2.0 * fract(p * C.www) - 1.0;",
    "  vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5); vec3 a0 = x - ox;",
    "  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);",
    "  vec3 g; g.x = a0.x*x0.x + h.x*x0.y; g.yz = a0.yz*x12.xz + h.yz*x12.yw;",
    "  return 130.0 * dot(m, g);",
    "}",
    "void main(){",
    "  vec2 uv = vUv;",
    "  float ratio = u_resolution.x / u_resolution.y;",
    "  vec2 p = uv - 0.5; p.x *= ratio;",
    "  float t = u_time * 0.1;",
    "  float n1 = snoise(p*0.4 + vec2(t*0.2,-t*0.3));",
    "  float n2 = snoise(p*0.55 + vec2(-t*0.15,t*0.25) + n1*0.25);",
    "  float n3 = snoise(p*0.75 + vec2(t*0.1,-t*0.2) + n2*0.2);",
    "  vec3 col = u_bg;",
    "  float dist = length(p) * 1.5;",
    "  float vignette = 1.0 - smoothstep(0.3,1.2,dist);",
    "  col = mix(col, u_colors[0], smoothstep(-0.2,0.5,n1)*0.85);",
    "  col = mix(col, u_colors[1], smoothstep(-0.1,0.6,n2)*0.7);",
    "  col = mix(col, u_colors[2], smoothstep(-0.3,0.4,n3)*0.6);",
    "  col = mix(col, u_colors[3], smoothstep(0.0,0.7,n1*n2)*0.5);",
    "  float glow = smoothstep(0.8,0.0,dist)*0.3; col += u_colors[1]*glow;",
    "  col = mix(col*0.2, col, vignette);",
    "  float grain = fract(sin(dot(uv, vec2(12.9898,78.233)))*43758.5453 + u_time);",
    "  col += (grain - 0.5) * u_grain * 0.1;",
    "  gl_FragColor = vec4(col, 1.0);",
    "}",
  ].join("\n");

  function compile(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }

  /* All GL resources live behind setupGL() so they can be rebuilt from scratch.
     A lost context invalidates every program, buffer and uniform location, so
     recovery is only possible if creating them can be re-run (see the
     webglcontextrestored handler at the bottom of this file). */
  var program, buffer, pos, loc;
  function setupGL() {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false; // fallback stays
    gl.useProgram(program);

    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    pos = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    loc = {
      res: gl.getUniformLocation(program, "u_resolution"),
      time: gl.getUniformLocation(program, "u_time"),
      grain: gl.getUniformLocation(program, "u_grain"),
      colors: gl.getUniformLocation(program, "u_colors"),
      bg: gl.getUniformLocation(program, "u_bg"),
    };
    gl.viewport(0, 0, canvas.width, canvas.height);
    return true;
  }
  if (!setupGL()) return; // CSS fallback remains visible

  function hexToRgb(hex) {
    var h = hex.replace("#", "");
    return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255];
  }

  /* restrained teal configuration (recolour of the green default) */
  var SPEED = 0.25, GRAIN = 0.15;
  var BG = hexToRgb("#08110f");
  var COLORS = new Float32Array(
    ["#0a2630", "#123f49", "#1e6e7e", "#0c2a33"].reduce(function (acc, c) { return acc.concat(hexToRgb(c)); }, [])
  );

  /* adaptive quality — the noise is soft, so a smaller backing store
     upscales invisibly. Low-power devices (few cores / little memory /
     data-saver) render at reduced resolution to protect the frame rate. */
  var nav = window.navigator || {};
  var lowPower =
    (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) ||
    (nav.deviceMemory && nav.deviceMemory <= 4) ||
    (nav.connection && nav.connection.saveData) || false;
  var QUALITY = lowPower ? 0.7 : 1;
  var DPR_CAP = lowPower ? 1.0 : 1.5;

  function resize() {
    var dpr = Math.min((window.devicePixelRatio || 1) * QUALITY, DPR_CAP);
    var w = Math.max(1, Math.floor(window.innerWidth * dpr));
    var h = Math.max(1, Math.floor(window.innerHeight * dpr));
    if (canvas.width === w && canvas.height === h) return false;
    canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h);
    return true;
  }
  /* Resizing a canvas CLEARS its drawing buffer. The animation loop naturally
     repaints on the next frame — but under reduced motion there is no loop, so
     without this redraw the background would vanish for good the first time the
     viewport changed. On mobile that is guaranteed: the first scroll collapses
     the URL bar and fires resize. */
  window.addEventListener("resize", function () {
    if (resize() && reduce) draw(0);
  }, { passive: true });
  resize();

  function draw(t) {
    gl.uniform2f(loc.res, canvas.width, canvas.height);
    gl.uniform1f(loc.time, t * 0.001 * SPEED);
    gl.uniform1f(loc.grain, GRAIN);
    gl.uniform3fv(loc.colors, COLORS);
    gl.uniform3f(loc.bg, BG[0], BG[1], BG[2]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var raf = null;
  function loop(t) { draw(t); raf = window.requestAnimationFrame(loop); }

  if (reduce) {
    draw(0); // one static frame, no continuous work
  } else {
    raf = window.requestAnimationFrame(loop);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { if (raf) { window.cancelAnimationFrame(raf); raf = null; } }
      else if (!raf) { raf = window.requestAnimationFrame(loop); }
    });
  }

  /* This page runs two WebGL contexts (see js/liquid-chrome.js), so a forced
     context loss is realistic: a GPU process restart, a driver reset, mobile
     backgrounding, or the browser reclaiming contexts. Without preventDefault
     the context can never be restored, and the rAF loop would otherwise spin
     forever issuing no-op calls against a dead context. */
  canvas.addEventListener("webglcontextlost", function (e) {
    e.preventDefault();
    if (raf) { window.cancelAnimationFrame(raf); raf = null; }
  }, false);
  canvas.addEventListener("webglcontextrestored", function () {
    if (!setupGL()) return;          // give up quietly; the CSS gradient shows
    if (reduce) draw(0);
    else if (!raf) raf = window.requestAnimationFrame(loop);
  }, false);
})();
