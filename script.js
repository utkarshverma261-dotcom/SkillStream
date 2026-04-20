// --- Mobile Menu Toggle ---
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close menu when a link is clicked on mobile
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// --- 3D Background Engine (Three.js) ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Central AI Core
const coreGeometry = new THREE.IcosahedronGeometry(1.5, 1);
const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x0057ff, wireframe: true, transparent: true, opacity: 0.4 });
const core = new THREE.Mesh(coreGeometry, coreMaterial);
scene.add(core);

// Flowing Data Stream
const streamCount = 3000;
const streamGeometry = new THREE.BufferGeometry();
const streamPosArray = new Float32Array(streamCount * 3);

for(let i = 0; i < streamCount * 3; i += 3) {
    const t = Math.random() * Math.PI * 2;
    const p = Math.random() * Math.PI * 2;
    const R = 4 + Math.random() * 2; 
    const r = Math.random() * 1.5;   
    
    streamPosArray[i] = (R + r * Math.cos(p)) * Math.cos(t);
    streamPosArray[i+1] = (R + r * Math.cos(p)) * Math.sin(t);
    streamPosArray[i+2] = r * Math.sin(p) + (Math.random() - 0.5) * 3; 
}

streamGeometry.setAttribute('position', new THREE.BufferAttribute(streamPosArray, 3));
const streamMaterial = new THREE.PointsMaterial({
    size: 0.03, color: 0x00f0ff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending
});

const dataStream = new THREE.Points(streamGeometry, streamMaterial);
dataStream.rotation.x = Math.PI / 3;
scene.add(dataStream);

camera.position.z = 8;

// Parallax Interaction Variables
let mouseX = 0; let mouseY = 0;
let targetX = 0; let targetY = 0;

const updateTarget = (clientX, clientY) => {
    mouseX = (clientX / window.innerWidth) * 2 - 1;
    mouseY = -(clientY / window.innerHeight) * 2 + 1;
};

// Desktop Mouse Tracking
window.addEventListener('mousemove', (e) => updateTarget(e.clientX, e.clientY));

// Mobile Touch Tracking
window.addEventListener('touchmove', (e) => {
    if(e.touches.length > 0) updateTarget(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });

// Responsive Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Render Loop
function animate() {
    requestAnimationFrame(animate);
    
    targetX = mouseX * 0.5;
    targetY = mouseY * 0.5;
    
    // Auto-rotation
    core.rotation.y += 0.003;
    core.rotation.x += 0.002;
    dataStream.rotation.z -= 0.002; 
    
    // Interactive Parallax
    scene.rotation.y += (targetX - scene.rotation.y) * 0.05;
    scene.rotation.x += (targetY - scene.rotation.x) * 0.05;

    renderer.render(scene, camera);
}

animate();