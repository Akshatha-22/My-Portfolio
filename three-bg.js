// === THREE.JS SCENE FACTORIES (Nebula Edition) ===

function createStarfield(canvas) {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 1;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Stars with vertex colors
  var starGeo = new THREE.BufferGeometry();
  var starCount = 3000;
  var starPos = new Float32Array(starCount * 3);
  var starColors = new Float32Array(starCount * 3);

  // Pallete: White, Violet, Blue, Gold
  var palette = [
    new THREE.Color(0xF0EEFF), // White
    new THREE.Color(0xC77DFF), // Violet
    new THREE.Color(0x4FC3F7), // Blue
    new THREE.Color(0xFFD166)  // Gold
  ];

  for (var i = 0; i < starCount * 3; i += 3) {
    starPos[i] = (Math.random() - 0.5) * 1600;
    starPos[i+1] = (Math.random() - 0.5) * 1600;
    starPos[i+2] = (Math.random() - 0.5) * 1600;

    var color = palette[Math.floor(Math.random() * palette.length)];
    starColors[i] = color.r;
    starColors[i+1] = color.g;
    starColors[i+2] = color.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  var starMat = new THREE.PointsMaterial({
    size: 1.3,
    vertexColors: true,
    transparent: true,
    opacity: 0.85
  });

  var stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // Astrophage Particles (Green/Gold Mix)
  var astroGeo = new THREE.BufferGeometry();
  var astroCount = 120;
  var astroPos = new Float32Array(astroCount * 3);
  var astroColors = new Float32Array(astroCount * 3);

  var green = new THREE.Color(0x39FF8E);
  var gold = new THREE.Color(0xFFD166);

  for (var i = 0; i < astroCount * 3; i += 3) {
    astroPos[i] = (Math.random() - 0.5) * 800;
    astroPos[i+1] = (Math.random() - 0.5) * 800;
    astroPos[i+2] = (Math.random() - 0.5) * 400;

    var mix = Math.random();
    astroColors[i] = THREE.MathUtils.lerp(green.r, gold.r, mix);
    astroColors[i+1] = THREE.MathUtils.lerp(green.g, gold.g, mix);
    astroColors[i+2] = THREE.MathUtils.lerp(green.b, gold.b, mix);
  }

  astroGeo.setAttribute('position', new THREE.BufferAttribute(astroPos, 3));
  astroGeo.setAttribute('color', new THREE.BufferAttribute(astroColors, 3));

  var astroMat = new THREE.PointsMaterial({
    size: 2.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.75
  });

  var astrophage = new THREE.Points(astroGeo, astroMat);
  scene.add(astrophage);

  var mouseX = 0, mouseY = 0;
  var onMouseMove = function(e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  };
  window.addEventListener('mousemove', onMouseMove);

  var onResize = function() {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  };
  window.addEventListener('resize', onResize);

  var animId;
  function animate() {
    animId = requestAnimationFrame(animate);
    scene.rotation.y += 0.00015;
    scene.rotation.z += 0.00005;
    camera.position.x += (mouseX - camera.position.x) * 0.03;
    camera.position.y += (-mouseY - camera.position.y) * 0.03;

    var ap = astroGeo.attributes.position.array;
    for (var i = 1; i < ap.length; i += 3) {
      ap[i] += 0.09;
      if (ap[i] > 400) ap[i] = -400;
    }
    astroGeo.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  }
  animate();

  return function cleanup() {
    cancelAnimationFrame(animId);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResize);
    starGeo.dispose(); starMat.dispose();
    astroGeo.dispose(); astroMat.dispose();
    renderer.dispose();
  };
}

function createPlanet(canvas) {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 6;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(300, 300);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Dark violet base
  var planet = new THREE.Mesh(
    new THREE.SphereGeometry(2.2, 64, 64),
    new THREE.MeshPhongMaterial({
      color: 0x1A0A3A,
      emissive: 0x39FF8E,
      emissiveIntensity: 0.15,
      specular: 0x4FC3F7,
      shininess: 40
    })
  );
  scene.add(planet);

  // Gradient atmosphere ring (simplified as two colored rings)
  var ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(2.8, 0.08, 16, 100),
    new THREE.MeshBasicMaterial({ color: 0xC77DFF, transparent: true, opacity: 0.15 })
  );
  ring1.rotation.x = Math.PI / 2.2;
  scene.add(ring1);

  var ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.85, 0.05, 16, 100),
    new THREE.MeshBasicMaterial({ color: 0x4FC3F7, transparent: true, opacity: 0.1 })
  );
  ring2.rotation.x = Math.PI / 2.3;
  scene.add(ring2);

  scene.add(new THREE.AmbientLight(0x221144, 0.6));
  var pLight = new THREE.PointLight(0x39FF8E, 1.5, 20);
  pLight.position.set(4, 4, 4);
  scene.add(pLight);

  var animId;
  function animate() {
    animId = requestAnimationFrame(animate);
    planet.rotation.y += 0.005;
    ring1.rotation.z -= 0.001;
    ring2.rotation.z += 0.002;
    renderer.render(scene, camera);
  }
  animate();

  return function cleanup() {
    cancelAnimationFrame(animId);
    renderer.dispose();
  };
}

function createSolarSystem(canvas) {
  var w = canvas.clientWidth, h = canvas.clientHeight;
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.set(0, 5, 12);
  camera.lookAt(0, 0, 0);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Sun (Gold)
  var sun = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xFFD166 })
  );
  scene.add(sun);
  var sunLight = new THREE.PointLight(0xFFD166, 2.5, 20);
  scene.add(sunLight);
  scene.add(new THREE.AmbientLight(0x201535, 0.5));

  var orbits = [2.4, 3.5, 4.6, 5.8];
  // Palette: Blue (Languages), Green (Frameworks), Violet (AI/ML), Pink (Cloud)
  var colors = [0x4FC3F7, 0x39FF8E, 0xC77DFF, 0xFF4D8C];
  var speeds = [0.012, 0.009, 0.007, 0.005];
  var angles = [0, 1.5, 3.1, 4.7];
  var planets = [];

  for (var i = 0; i < 4; i++) {
    var orbitRing = new THREE.Mesh(
      new THREE.TorusGeometry(orbits[i], 0.01, 8, 120),
      new THREE.MeshBasicMaterial({ color: colors[i], transparent: true, opacity: 0.1 })
    );
    orbitRing.rotation.x = Math.PI / 2;
    scene.add(orbitRing);

    var p = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 24, 24),
      new THREE.MeshPhongMaterial({
         color: colors[i],
         emissive: colors[i],
         emissiveIntensity: 0.4,
         specular: 0xffffff,
         shininess: 30
      })
    );
    scene.add(p);
    planets.push(p);
  }

  var onResize = function() {
    var nw = canvas.clientWidth, nh = canvas.clientHeight;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  };
  window.addEventListener('resize', onResize);

  var animId;
  function animate() {
    animId = requestAnimationFrame(animate);
    for (var i = 0; i < 4; i++) {
      angles[i] += speeds[i];
      planets[i].position.x = Math.cos(angles[i]) * orbits[i];
      planets[i].position.z = Math.sin(angles[i]) * orbits[i];
    }
    sun.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();

  return function cleanup() {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', onResize);
    renderer.dispose();
  };
}
