let scene, camera, renderer, group, spheres = [];
let mergeStage = 0, animating = false, level = 0;
let systemHistory = [];
const rFarMin = 500, rFarMax = 800;
let rFar = rFarMin + Math.random() * (rFarMax - rFarMin);
let confetti = [];
const confettiColors = [0xff0066, 0x66ff00, 0x00ff99, 0x0066ff, 0xffcc00, 0x9900ff, 0xffffff];
const mergeRadii = [rFar*3.5, rFar*2.5, rFar*1.7, rFar*1.4, rFar*1.25, rFar*1.1, rFar, rFar*0.93, rFar*0.87, rFar*0.8, rFar*0.73, rFar*0.65, 350, 300, 250, 200, 160, 120, 100, 80, 60, 45, 32, 20, 10, 5, 2, 0.5, 0];

const stagesText = ["Far Outer Space", "Outer System", "Outer Shell", "Ultra Wide system", "Super Wide system", "Extra Wide system", "Wide system", "Closer together", "More together", "Even more together", "Getting close", "Almost merged", "Merge step 1", "Merge step 2", "Merge step 3", "Merge step 4", "Merge step 5", "Merge step 6", "Merge step 7", "Merge step 8", "Merge step 9", "Merge step 10", "Merge step 11", "Merge step 12", "Merge step 13", "Merge step 14", "Merge step 15", "Merge step 16", "Ultra Merge"];
const container = document.getElementById('container');

let backWallCanvas, leftWallCanvas, rightWallCanvas;
let backWallTexture, leftWallTexture, rightWallTexture;
let backWallMesh, leftWallMesh, rightWallMesh;
let scrollMsg = "scroll — zoom in, click — rotate, scroll up — back  ";
let backWallTextOffset = 0;
let backWallTextOffsetObj = {value: 0};
let leftWallTextOffsetObj = {value: 0};
let rightWallTextOffsetObj = {value: 0};

function createBackWallText() {
  
  let width = 1024, height = 220;
  backWallCanvas = document.createElement('canvas');
  backWallCanvas.width = width;
  backWallCanvas.height = height;
  let ctx = backWallCanvas.getContext('2d');

  
  backWallTexture = new THREE.CanvasTexture(backWallCanvas);
  backWallTexture.minFilter = THREE.LinearFilter;
  backWallTexture.wrapS = THREE.RepeatWrapping;
  backWallTexture.wrapT = THREE.RepeatWrapping;

  
  let mat = new THREE.MeshBasicMaterial({ 
    map: backWallTexture, 
    side: THREE.FrontSide,
    transparent: false
});
let geo = new THREE.PlaneGeometry(1200, 260);
backWallMesh = new THREE.Mesh(geo, mat);
backWallMesh.position.set(0, 0, -590);
scene.add(backWallMesh);
}

function updateBackWallText() {
  updateWallText(backWallCanvas, backWallTexture, { value: backWallTextOffset });
}

function addRoomGrid(size = 1200, step = 120) {


  
  backWallTexture.needsUpdate = true;
}

function addRoomGrid(size = 1200, step = 120) {
  const color = 0xbbbbbb;
  const divisions = size / step;

  
  const lineMat = new THREE.LineBasicMaterial({ color });

  
  function makeGridPlane(width, height, udir, vdir, pos, rot) {
    const grid = new THREE.Group();
    
    for (let i = -width/2; i <= width/2; i += step) {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i, -height/2, 0),
        new THREE.Vector3(i,  height/2, 0)
      ]);
      grid.add(new THREE.Line(geo, lineMat));
    }
    
    for (let j = -height/2; j <= height/2; j += step) {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-width/2, j, 0),
        new THREE.Vector3( width/2, j, 0)
      ]);
      grid.add(new THREE.Line(geo, lineMat));
    }
    grid.position.copy(pos);
    grid.rotation.set(rot.x, rot.y, rot.z);
    scene.add(grid);
  }

  
  makeGridPlane(size, size, 'x', 'z',
    new THREE.Vector3(0, -size/2, 0),
    new THREE.Euler(-Math.PI/2, 0, 0)
  );

  
  makeGridPlane(size, size, 'x', 'z',
    new THREE.Vector3(0, size/2, 0),
    new THREE.Euler(-Math.PI/2, 0, 0)
  );

  
  makeGridPlane(size, size, 'z', 'y',
    new THREE.Vector3(-size/2, 0, 0),
    new THREE.Euler(0, Math.PI/2, 0)
  );

  
  makeGridPlane(size, size, 'z', 'y',
    new THREE.Vector3(size/2, 0, 0),
    new THREE.Euler(0, -Math.PI/2, 0)
  );

  
  makeGridPlane(size, size, 'x', 'y',
    new THREE.Vector3(0, 0, -size/2),
    new THREE.Euler(0, 0, 0)
  );

  
}

function setupScene() {
  scene = new THREE.Scene();
  const roomSize = 1200;
  camera = new THREE.PerspectiveCamera(
     80,
    container.clientWidth / container.clientHeight,
    0.1,
    3000
  );
  
  camera.position.set(roomSize * 0.15, roomSize * 0.32, roomSize * 0.48);
  
  camera.lookAt(roomSize * -0.08, -roomSize * 0.08, -roomSize * 0.18);

  renderer = renderer || new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0xf4f4f4);
  renderer.setSize(container.clientWidth, container.clientHeight);
  if (!renderer.domElement.parentNode) container.appendChild(renderer.domElement);

  let ambient = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambient);

  let dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(1, 2, 2);
  scene.add(dirLight);

  addRoomGrid(roomSize, 96);

  group = new THREE.Group();
  scene.add(group);

  
let backWallCanvasObj = {value: null}, backWallTextureObj = {value: null}, backWallMeshObj = {value: null};
createWallBanner(
  backWallCanvasObj, backWallTextureObj, backWallMeshObj,
  1024, 200,
  new THREE.Vector3(0, 0, -590),
  new THREE.Euler(0, 0, 0) 
);
backWallCanvas = backWallCanvasObj.value;
backWallTexture = backWallTextureObj.value;
backWallMesh = backWallMeshObj.value;


let leftWallCanvasObj = {value: null}, leftWallTextureObj = {value: null}, leftWallMeshObj = {value: null};
createWallBanner(
  leftWallCanvasObj, leftWallTextureObj, leftWallMeshObj,
  1024, 200,
  new THREE.Vector3(-600, 0, 0),
  new THREE.Euler(0, Math.PI/2, 0)
);
leftWallCanvas = leftWallCanvasObj.value;
leftWallTexture = leftWallTextureObj.value;
leftWallMesh = leftWallMeshObj.value;


let rightWallCanvasObj = {value: null}, rightWallTextureObj = {value: null}, rightWallMeshObj = {value: null};
createWallBanner(
  rightWallCanvasObj, rightWallTextureObj, rightWallMeshObj,
  1024, 200,
  new THREE.Vector3(600, 0, 0),
  new THREE.Euler(0, -Math.PI/2, 0)
);
rightWallCanvas = rightWallCanvasObj.value;
rightWallTexture = rightWallTextureObj.value;
rightWallMesh = rightWallMeshObj.value;

  createSpheres(30, mergeStage, false); 
}

function createSpheres(count, stage, centerMode = false) {
  spheres = [];
  while(group.children.length) group.remove(group.children[0]);
  let center = new THREE.Vector3(0,0,0);
  let geometry = new THREE.SphereGeometry(60, 36, 36); 
  let material = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.13,
    metalness: 0.55
  });
  let mainSphere = new THREE.Mesh(geometry, material);
  mainSphere.position.copy(center);
  mainSphere.userData = { isMain: true };
  group.add(mainSphere);
  spheres.push(mainSphere);

  
  const sphereColors = [
    0x66ff00, 
    0x9900ff, 
    0xff0066, 
    0x00ff99, 
    0x00ff66, 
    0xffcc00, 
    0x0066ff  
  ];

  let totalSpheres = count;
  for(let i=1;i<totalSpheres;i++){
    let phi = (i/totalSpheres)*Math.PI*2 + (Math.random()-0.5)*0.18;
    let theta = Math.PI/2 + (Math.random()-0.5)*0.18;
    let r = centerMode ? mergeRadii[mergeRadii.length-1] : mergeRadii[stage];
    let geo = new THREE.SphereGeometry(50 + 10 * Math.random(), 32, 32);

    
    let color = sphereColors[(i-1) % sphereColors.length];
    let mat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.05,   
      metalness: 0.1     
    });

    let s = new THREE.Mesh(geo, mat);
    s.userData = {
      isMain: false,
      phi, theta, radius: r,
      phiTarget: phi, thetaTarget: theta,
      timeToNewTarget: 0
    };
    s.position.set(
      Math.cos(s.userData.phi)*Math.sin(s.userData.theta)*s.userData.radius,
      Math.sin(s.userData.phi)*Math.sin(s.userData.theta)*s.userData.radius,
      Math.cos(s.userData.theta)*s.userData.radius*1.1
    );
    group.add(s);
    spheres.push(s);
  }
  


if (!group.getObjectByName('eventHorizon')) {
  const horizonRadius = 70; 
  const horizonGeo = new THREE.TorusGeometry(horizonRadius, 8, 32, 128);
  const horizonMat = new THREE.MeshBasicMaterial({
    color: 0x222222,
    transparent: true,
    opacity: 0.55,
    side: THREE.DoubleSide
  });
  const horizon = new THREE.Mesh(horizonGeo, horizonMat);
  horizon.name = 'eventHorizon';
  horizon.position.set(0, 0, 0);
  horizon.rotation.x = Math.PI / 2;
  group.add(horizon);

  
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x66ccff,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide
  });
  const glow = new THREE.Mesh(
    new THREE.TorusGeometry(horizonRadius + 12, 16, 32, 128),
    glowMat
  );
  glow.name = 'eventHorizonGlow';
  glow.position.set(0, 0, 0);
  glow.rotation.x = Math.PI / 2;
  group.add(glow);
}
}

function createWallBanner(canvasVar, textureVar, meshVar, width, height, pos, rot) {
  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  let ctx = canvas.getContext('2d');
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);

  let texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  let mat = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.FrontSide,
    transparent: false
  });
  let geo = new THREE.PlaneGeometry(width * 1.17, height * 1.18);
  let mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(pos);
  mesh.rotation.set(rot.x, rot.y, rot.z);
  scene.add(mesh);

  canvasVar.value = canvas;
  textureVar.value = texture;
  meshVar.value = mesh;
}

function updateWallText(canvas, texture, offsetVar) {
  let ctx = canvas.getContext('2d');
  let W = canvas.width, H = canvas.height;
  
  ctx.save();
  ctx.setTransform(1, 0, -0.9, 1, 0, 0);
  ctx.font = "italic bold 200px Segoe UI, Arial, sans-serif";
  ctx.fillStyle = "#39ff14";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "#000";
  ctx.shadowBlur = 14;
 
  ctx.clearRect(0, 0, W, H);
  offsetVar.value += 3;
  if (offsetVar.value > W) offsetVar.value = 0;
  let fullMsg = scrollMsg.repeat(2);
  ctx.lineWidth = 2.2;
  ctx.strokeStyle = "#39ff14";
  ctx.fillText(fullMsg, -offsetVar.value, H/2);
  ctx.restore();
  texture.needsUpdate = true;
}

function animate() {
  updateWallText(backWallCanvas, backWallTexture, backWallTextOffsetObj);
  updateWallText(leftWallCanvas, leftWallTexture, leftWallTextOffsetObj);
  updateWallText(rightWallCanvas, rightWallTexture, rightWallTextOffsetObj);
  for (let i = 1; i < spheres.length; i++) {
    let s = spheres[i];
    
    if (s.userData.timeToNewTarget <= 0) {
      s.userData.phiTarget   = s.userData.phi   + (Math.random()-0.5)*Math.PI/2;
      s.userData.thetaTarget = s.userData.theta + (Math.random()-0.5)*Math.PI/2;
      s.userData.timeToNewTarget = 100 + Math.random()*120; 
    } else {
      s.userData.timeToNewTarget--;
    }

    
    s.userData.phi   += (s.userData.phiTarget   - s.userData.phi)   * 0.012;
    s.userData.theta += (s.userData.thetaTarget - s.userData.theta) * 0.012;
    
    s.position.set(
      Math.cos(s.userData.phi) * Math.sin(s.userData.theta) * s.userData.radius,
      Math.sin(s.userData.phi) * Math.sin(s.userData.theta) * s.userData.radius,
      Math.cos(s.userData.theta) * s.userData.radius * 1.1
    );
  }
  const horizon = group.getObjectByName('eventHorizon');
  if (horizon) horizon.rotation.z += 0.002;
  const glow = group.getObjectByName('eventHorizonGlow');
  if (glow) glow.rotation.z -= 0.001;

  
  for (let i = confetti.length - 1; i >= 0; i--) {
    let c = confetti[i];
    c.position.add(c.userData.velocity);
    c.userData.velocity.y -= 0.05; 
    c.userData.life--;
    c.material.opacity = Math.max(0, c.userData.life / 60);
    c.material.transparent = true;
    if (c.userData.life <= 0) {
      scene.remove(c);
      confetti.splice(i, 1);
    }
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}


function animateToStage(stage) {
  let radius = mergeRadii[stage];
  spheres.forEach((s, idx) => {
    if (idx === 0) return;
    gsap.to(s.userData, {
      radius: radius,
      duration: 0.8,
      ease: "power1.inOut"
    });
  });
  if (stage < stagesText.length) {
    document.getElementById('overlay').textContent = stagesText[stage];
  }
}

function spawnConfetti(x, y) {
  const rect = renderer.domElement.getBoundingClientRect();
  const ndcX = ((x - rect.left) / rect.width) * 2 - 1;
  const ndcY = -((y - rect.top) / rect.height) * 2 + 1;

  const vector = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);

  
  const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
  let mesh;
  const shapeType = Math.floor(Math.random() * 3); 

  if (shapeType === 0) {
    const geo = new THREE.SphereGeometry(0.08 + Math.random()*0.12, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: color });
    mesh = new THREE.Mesh(geo, mat);
  } else if (shapeType === 1) {
    const size = 0.12 + Math.random()*0.12;
    const geo = new THREE.BoxGeometry(size, size, size);
    const mat = new THREE.MeshBasicMaterial({ color: color });
    mesh = new THREE.Mesh(geo, mat);
  } else {
    const w = 0.001 + Math.random()*0.10;
    const h = 0.004 + Math.random()*0.04;
    const geo = new THREE.PlaneGeometry(w, h);
    const mat = new THREE.MeshBasicMaterial({ color: color, side: THREE.FrontSide });
    mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.z = Math.random() * Math.PI * 2;
  }

  mesh.position.copy(vector);
  mesh.userData = {
    velocity: new THREE.Vector3(
      (Math.random()-0.5)*2,
      (Math.random()-0.5)*2,
      -Math.random()*2 - 1
    ),
    life: 60 + Math.random()*30 
  };
  scene.add(mesh);
  confetti.push(mesh);
}

let isMiddleMouseDown = false;
let lastMouse = { x: 0, y: 0 };

window.addEventListener('mousedown', function(e) {
  if (e.button === 1) {
    isMiddleMouseDown = true;
    lastMouse.x = e.clientX;
    lastMouse.y = e.clientY;
  }
  spawnConfetti(e.clientX, e.clientY);
});
window.addEventListener('mouseup', function(e) {
  if (e.button === 1) {
    isMiddleMouseDown = false;
  }
});
window.addEventListener('mousemove', function(e) {
  if (isMiddleMouseDown) {
    let dx = e.clientX - lastMouse.x;
    let dy = e.clientY - lastMouse.y;
    group.rotation.y += dx * 0.01;
    group.rotation.x += dy * 0.01;
    lastMouse.x = e.clientX;
    lastMouse.y = e.clientY;
  }
  spawnConfetti(e.clientX, e.clientY);
});

window.addEventListener('wheel', function(e){
  if (animating) return;

  if (e.deltaY > 0) {
    if (mergeStage < mergeRadii.length - 1) {
      mergeStage++;
      animateToStage(mergeStage);
    } else {
       animating = true;
      setTimeout(()=>{
        rFar = rFarMin + Math.random() * (rFarMax - rFarMin);
        mergeRadii[0] = rFar * 3.5;
        mergeRadii[1] = rFar * 2.5;
        mergeRadii[2] = rFar * 1.7;
        mergeRadii[3] = rFar * 1.4;
        mergeStage = 0;
        createSpheres(50, mergeStage, false);
        mergeStage = 1; 
        animateToStage(mergeStage);
        animating = false;
      }, 800);
    }
  } else if (e.deltaY < 0) {
      if (mergeStage > 0) {
      mergeStage--;
      animateToStage(mergeStage);
    } else {
      animating = true;
      setTimeout(()=>{
        rFar = rFarMin + Math.random() * (rFarMax - rFarMin);
        mergeRadii[0] = rFar * 3.5;
        mergeRadii[1] = rFar * 2.5;
        mergeRadii[2] = rFar * 1.7;
        mergeRadii[3] = rFar * 1.4;
        mergeStage = mergeRadii.length - 1;
        createSpheres(30, mergeStage, false);
        mergeStage = mergeRadii.length - 2; 
        animateToStage(mergeStage);
        animating = false;
      }, 800);
    }
  }
});

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
setupScene();
animate();