// === THREE.JS SCENE FACTORIES (no JSX, pure JS) ===

function createStarfield(canvas) {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 1;
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Stars
  var starGeo = new THREE.BufferGeometry();
  var starCount = 2500;
  var starPos = new Float32Array(starCount * 3);
  for (var i = 0; i < starCount * 3; i += 3) {
    starPos[i] = (Math.random() - 0.5) * 1600;
    starPos[i+1] = (Math.random() - 0.5) * 1600;
    starPos[i+2] = (Math.random() - 0.5) * 1600;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  var starMat = new THREE.PointsMaterial({ size: 1.2, color: 0xE8F4FF, transparent: true, opacity: 0.85 });
  var stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // Astrophage particles
  var astroGeo = new THREE.BufferGeometry();
  var astroCount = 100;
  var astroPos = new Float32Array(astroCount * 3);
  for (var i = 0; i < astroCount * 3; i += 3) {
    astroPos[i] = (Math.random() - 0.5) * 800;
    astroPos[i+1] = (Math.random() - 0.5) * 800;
    astroPos[i+2] = (Math.random() - 0.5) * 400;
  }
  astroGeo.setAttribute('position', new THREE.BufferAttribute(astroPos, 3));
  var astroMat = new THREE.PointsMaterial({ size: 2.5, color: 0xFFB347, transparent: true, opacity: 0.7 });
  var astrophage = new THREE.Points(astroGeo, astroMat);
  scene.add(astrophage);

  var mouseX = 0, mouseY = 0;
  var onMouseMove = function(e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.6;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.6;
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
    scene.rotation.y += 0.0001;
    scene.rotation.x += 0.00005;
    camera.position.x += (mouseX - camera.position.x) * 0.02;
    camera.position.y += (-mouseY - camera.position.y) * 0.02;

    // Drift astrophage upward
    var ap = astroGeo.attributes.position.array;
    for (var i = 1; i < ap.length; i += 3) {
      ap[i] += 0.08;
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

  var planet = new THREE.Mesh(
    new THREE.SphereGeometry(2.2, 64, 64),
    new THREE.MeshPhongMaterial({ color: 0x1A3A5C, emissive: 0x00FFB2, emissiveIntensity: 0.15, specular: 0xFFB347, shininess: 30 })
  );
  scene.add(planet);

  var ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.8, 0.1, 16, 100),
    new THREE.MeshBasicMaterial({ color: 0x00FFB2, transparent: true, opacity: 0.2 })
  );
  ring.rotation.x = Math.PI / 2.5;
  scene.add(ring);

  scene.add(new THREE.AmbientLight(0x334455, 0.5));
  var pLight = new THREE.PointLight(0x00FFB2, 1.2, 20);
  pLight.position.set(3, 3, 3);
  scene.add(pLight);

  var animId;
  function animate() {
    animId = requestAnimationFrame(animate);
    planet.rotation.y += 0.004;
    ring.rotation.z += 0.002;
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
  camera.position.set(0, 4, 10);
  camera.lookAt(0, 0, 0);
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Sun
  var sun = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xFFB347 })
  );
  scene.add(sun);
  var sunLight = new THREE.PointLight(0xFFB347, 2, 15);
  scene.add(sunLight);
  scene.add(new THREE.AmbientLight(0x223344, 0.4));

  var orbits = [2.2, 3.2, 4.2, 5.0];
  var colors = [0x4FC3F7, 0x00FFB2, 0xFF8A65, 0xB39DDB];
  var speeds = [0.012, 0.009, 0.007, 0.005];
  var angles = [0, Math.PI/2, Math.PI, Math.PI*1.5];
  var planets = [];

  for (var i = 0; i < 4; i++) {
    var orbitRing = new THREE.Mesh(
      new THREE.TorusGeometry(orbits[i], 0.008, 8, 120),
      new THREE.MeshBasicMaterial({ color: 0x00FFB2, transparent: true, opacity: 0.15 })
    );
    orbitRing.rotation.x = Math.PI / 2;
    scene.add(orbitRing);

    var p = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 16, 16),
      new THREE.MeshPhongMaterial({ color: colors[i], emissive: colors[i], emissiveIntensity: 0.3 })
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
    sun.rotation.y += 0.005;
    renderer.render(scene, camera);
  }
  animate();

  return function cleanup() {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', onResize);
    renderer.dispose();
  };
}
