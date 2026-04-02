// ====================================
// Ghost Cursor — Vanilla JS (converted from Reactbits)
// Three.js smoky cursor trail effect
// ====================================

(function () {
  'use strict';

  // Skip on mobile / touch devices
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch) return;

  // --- Config ---
  const CONFIG = {
    color: '#B19EEF',
    brightness: 2,
    edgeIntensity: 0,
    trailLength: 35,
    inertia: 0.5,
    grainIntensity: 0.05,
    bloomStrength: 0.1,
    bloomRadius: 1.0,
    bloomThreshold: 0.025,
    fadeDelayMs: 1000,
    fadeDurationMs: 1500,
    maxDevicePixelRatio: 0.5,
    pixelBudget: 1.3e6,
    zIndex: 1
  };

  // --- Wait for Three.js ---
  function waitForThree(cb, retries) {
    retries = retries || 100;
    if (window.THREE) {
      cb();
    } else if (retries > 0) {
      setTimeout(function () { waitForThree(cb, retries - 1); }, 50);
    }
  }

  waitForThree(function () { init(); });

  function init() {
    var THREE = window.THREE;

    // --- Create container ---
    var container = document.createElement('div');
    container.id = 'ghostCursor';
    container.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9990;overflow:hidden;mix-blend-mode:screen;opacity:0.7;';
    document.body.appendChild(container);

    // --- State ---
    var trailBuf = [];
    var head = 0;
    var maxTrail = Math.max(1, Math.floor(CONFIG.trailLength));
    for (var i = 0; i < maxTrail; i++) {
      trailBuf.push(new THREE.Vector2(0.5, 0.5));
    }

    var currentMouse = new THREE.Vector2(0.5, 0.5);
    var smoothMouse = new THREE.Vector2(0.5, 0.5);
    var velocity = new THREE.Vector2(0, 0);
    var fadeOpacity = 1.0;
    var lastMoveTime = performance.now();
    var pointerActive = false;
    var running = false;
    var hasValidSize = false;
    var rafId = null;

    // --- Renderer ---
    var renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      premultipliedAlpha: false,
      preserveDrawingBuffer: false
    });
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.mixBlendMode = 'screen';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    // --- Scene ---
    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    var baseColor = new THREE.Color(CONFIG.color);

    // --- Shaders ---
    var vertexShader = [
      'varying vec2 vUv;',
      'void main() {',
      '  vUv = uv;',
      '  gl_Position = vec4(position, 1.0);',
      '}'
    ].join('\n');

    var fragmentShader = [
      '#define MAX_TRAIL_LENGTH ' + maxTrail,
      'uniform float iTime;',
      'uniform vec3  iResolution;',
      'uniform vec2  iMouse;',
      'uniform vec2  iPrevMouse[MAX_TRAIL_LENGTH];',
      'uniform float iOpacity;',
      'uniform float iScale;',
      'uniform vec3  iBaseColor;',
      'uniform float iBrightness;',
      'uniform float iEdgeIntensity;',
      'varying vec2  vUv;',
      '',
      'float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7))) * 43758.5453123); }',
      'float noise(vec2 p){',
      '  vec2 i = floor(p), f = fract(p);',
      '  f *= f * (3. - 2. * f);',
      '  return mix(mix(hash(i + vec2(0.,0.)), hash(i + vec2(1.,0.)), f.x),',
      '             mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.,1.)), f.x), f.y);',
      '}',
      'float fbm(vec2 p){',
      '  float v = 0.0;',
      '  float a = 0.5;',
      '  mat2 m = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));',
      '  for(int i=0;i<5;i++){',
      '    v += a * noise(p);',
      '    p = m * p * 2.0;',
      '    a *= 0.5;',
      '  }',
      '  return v;',
      '}',
      'vec3 tint1(vec3 base){ return mix(base, vec3(1.0), 0.15); }',
      'vec3 tint2(vec3 base){ return mix(base, vec3(0.8, 0.9, 1.0), 0.25); }',
      '',
      'vec4 blob(vec2 p, vec2 mousePos, float intensity, float activity) {',
      '  vec2 q = vec2(fbm(p * iScale + iTime * 0.1), fbm(p * iScale + vec2(5.2,1.3) + iTime * 0.1));',
      '  vec2 r = vec2(fbm(p * iScale + q * 1.5 + iTime * 0.15), fbm(p * iScale + q * 1.5 + vec2(8.3,2.8) + iTime * 0.15));',
      '  float smoke = fbm(p * iScale + r * 0.8);',
      '  float radius = 0.25 + 0.1 * (1.0 / iScale);',
      '  float distFactor = 1.0 - smoothstep(0.0, radius * activity, length(p - mousePos));',
      '  float alpha = pow(smoke, 2.5) * distFactor;',
      '  vec3 c1 = tint1(iBaseColor);',
      '  vec3 c2 = tint2(iBaseColor);',
      '  vec3 color = mix(c1, c2, sin(iTime * 0.5) * 0.5 + 0.5);',
      '  return vec4(color * alpha * intensity, alpha * intensity);',
      '}',
      '',
      'void main() {',
      '  vec2 uv = (gl_FragCoord.xy / iResolution.xy * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);',
      '  vec2 mouse = (iMouse * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);',
      '  vec3 colorAcc = vec3(0.0);',
      '  float alphaAcc = 0.0;',
      '  vec4 b = blob(uv, mouse, 1.0, iOpacity);',
      '  colorAcc += b.rgb;',
      '  alphaAcc += b.a;',
      '  for (int i = 0; i < MAX_TRAIL_LENGTH; i++) {',
      '    vec2 pm = (iPrevMouse[i] * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);',
      '    float t = 1.0 - float(i) / float(MAX_TRAIL_LENGTH);',
      '    t = pow(t, 2.0);',
      '    if (t > 0.01) {',
      '      vec4 bt = blob(uv, pm, t * 0.8, iOpacity);',
      '      colorAcc += bt.rgb;',
      '      alphaAcc += bt.a;',
      '    }',
      '  }',
      '  colorAcc *= iBrightness;',
      '  vec2 uv01 = gl_FragCoord.xy / iResolution.xy;',
      '  float edgeDist = min(min(uv01.x, 1.0 - uv01.x), min(uv01.y, 1.0 - uv01.y));',
      '  float distFromEdge = clamp(edgeDist * 2.0, 0.0, 1.0);',
      '  float k = clamp(iEdgeIntensity, 0.0, 1.0);',
      '  float edgeMask = mix(1.0 - k, 1.0, distFromEdge);',
      '  float outAlpha = clamp(alphaAcc * iOpacity * edgeMask, 0.0, 1.0);',
      '  gl_FragColor = vec4(colorAcc, outAlpha);',
      '}'
    ].join('\n');

    // --- Material ---
    var material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector3(1, 1, 1) },
        iMouse: { value: new THREE.Vector2(0.5, 0.5) },
        iPrevMouse: { value: trailBuf.map(function (v) { return v.clone(); }) },
        iOpacity: { value: 1.0 },
        iScale: { value: 1.0 },
        iBaseColor: { value: new THREE.Vector3(baseColor.r, baseColor.g, baseColor.b) },
        iBrightness: { value: CONFIG.brightness },
        iEdgeIntensity: { value: CONFIG.edgeIntensity }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });

    var geom = new THREE.PlaneGeometry(2, 2);
    var mesh = new THREE.Mesh(geom, material);
    scene.add(mesh);

    // --- Post-processing ---
    var EffectComposer = THREE.EffectComposer;
    var RenderPass = THREE.RenderPass;
    var ShaderPass = THREE.ShaderPass;
    var UnrealBloomPass = THREE.UnrealBloomPass;

    var composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    var bloomPass = new UnrealBloomPass(
      new THREE.Vector2(1, 1),
      CONFIG.bloomStrength,
      CONFIG.bloomRadius,
      CONFIG.bloomThreshold
    );
    composer.addPass(bloomPass);

    // Film grain pass
    var FilmGrainShader = {
      uniforms: {
        tDiffuse: { value: null },
        iTime: { value: 0 },
        intensity: { value: CONFIG.grainIntensity }
      },
      vertexShader: [
        'varying vec2 vUv;',
        'void main(){',
        '  vUv = uv;',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform sampler2D tDiffuse;',
        'uniform float iTime;',
        'uniform float intensity;',
        'varying vec2 vUv;',
        'float hash1(float n){ return fract(sin(n)*43758.5453); }',
        'void main(){',
        '  vec4 color = texture2D(tDiffuse, vUv);',
        '  float n = hash1(vUv.x*1000.0 + vUv.y*2000.0 + iTime) * 2.0 - 1.0;',
        '  color.rgb += n * intensity * color.rgb;',
        '  gl_FragColor = color;',
        '}'
      ].join('\n')
    };
    var filmPass = new ShaderPass(FilmGrainShader);
    composer.addPass(filmPass);

    // Unpremultiply pass
    var UnpremultiplyShader = {
      uniforms: { tDiffuse: { value: null } },
      vertexShader: [
        'varying vec2 vUv;',
        'void main(){',
        '  vUv = uv;',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform sampler2D tDiffuse;',
        'varying vec2 vUv;',
        'void main(){',
        '  vec4 c = texture2D(tDiffuse, vUv);',
        '  float a = max(c.a, 1e-5);',
        '  vec3 straight = c.rgb / a;',
        '  gl_FragColor = vec4(clamp(straight, 0.0, 1.0), c.a);',
        '}'
      ].join('\n')
    };
    composer.addPass(new ShaderPass(UnpremultiplyShader));

    // --- Resize ---
    function calculateScale() {
      var base = 600;
      var current = Math.min(Math.max(1, window.innerWidth), Math.max(1, window.innerHeight));
      return Math.max(0.5, Math.min(2.0, current / base));
    }

    function resize() {
      var w = window.innerWidth;
      var h = window.innerHeight;
      if (w <= 0 || h <= 0) { hasValidSize = false; return; }

      var dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxDevicePixelRatio);
      var need = w * h * dpr * dpr;
      var scale = need <= CONFIG.pixelBudget ? 1 : Math.max(0.5, Math.min(1, Math.sqrt(CONFIG.pixelBudget / Math.max(1, need))));
      var pixelRatio = dpr * scale;

      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(w, h);
      if (composer.setPixelRatio) composer.setPixelRatio(pixelRatio);
      composer.setSize(w, h);

      var wpx = Math.max(1, Math.floor(w * pixelRatio));
      var hpx = Math.max(1, Math.floor(h * pixelRatio));
      material.uniforms.iResolution.value.set(wpx, hpx, 1);
      material.uniforms.iScale.value = calculateScale();
      bloomPass.setSize(wpx, hpx);

      hasValidSize = true;
    }

    resize();
    window.addEventListener('resize', resize);

    // --- Animation loop ---
    var startTime = performance.now();

    function animate() {
      if (!hasValidSize) {
        rafId = requestAnimationFrame(animate);
        return;
      }

      var now = performance.now();
      var t = (now - startTime) / 1000;

      // Instantly snap to mouse position — no smoothing lag
      material.uniforms.iMouse.value.copy(currentMouse);

      if (pointerActive) {
        fadeOpacity = 1.0;
      } else {
        velocity.multiplyScalar(CONFIG.inertia);
        if (velocity.lengthSq() > 1e-6) {
          material.uniforms.iMouse.value.add(velocity);
        }
        var dt = now - lastMoveTime;
        if (dt > CONFIG.fadeDelayMs) {
          var k = Math.min(1, (dt - CONFIG.fadeDelayMs) / CONFIG.fadeDurationMs);
          fadeOpacity = Math.max(0, 1 - k);
        }
      }

      // Update trail
      head = (head + 1) % maxTrail;
      trailBuf[head].copy(material.uniforms.iMouse.value);
      var arr = material.uniforms.iPrevMouse.value;
      for (var j = 0; j < maxTrail; j++) {
        var srcIdx = (head - j + maxTrail) % maxTrail;
        arr[j].copy(trailBuf[srcIdx]);
      }

      material.uniforms.iOpacity.value = fadeOpacity;
      material.uniforms.iTime.value = t;
      if (filmPass.uniforms && filmPass.uniforms.iTime) {
        filmPass.uniforms.iTime.value = t;
      }

      composer.render();

      if (!pointerActive && fadeOpacity <= 0.001) {
        running = false;
        rafId = null;
        return;
      }

      rafId = requestAnimationFrame(animate);
    }

    function ensureLoop() {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(animate);
      }
    }

    // --- Mouse events (use document for full-page tracking) ---
    document.addEventListener('pointermove', function (e) {
      var x = e.clientX / Math.max(1, window.innerWidth);
      var y = 1 - e.clientY / Math.max(1, window.innerHeight);
      currentMouse.set(
        Math.max(0, Math.min(1, x)),
        Math.max(0, Math.min(1, y))
      );
      pointerActive = true;
      lastMoveTime = performance.now();
      ensureLoop();
    }, { passive: true });

    document.addEventListener('pointerleave', function () {
      pointerActive = false;
      lastMoveTime = performance.now();
      ensureLoop();
    }, { passive: true });

    document.addEventListener('pointerenter', function () {
      pointerActive = true;
      ensureLoop();
    }, { passive: true });

    ensureLoop();
  }
})();
