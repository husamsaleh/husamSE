import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Loading screen elements
const loadingScreen = document.querySelector('.loading-screen');
const loadingBar = document.querySelector('.loading-bar');
const loadingBarGlow = document.querySelector('.loading-bar-glow');
const loadingCounter = document.querySelector('.loading-counter');
const loadingStatus = document.querySelector('.loading-status');

// Scroll dots functionality
const scrollDots = document.querySelectorAll('.scroll-dot');
const menuItems = document.querySelectorAll('.menu-item');
const panels = document.querySelectorAll('.panel');
const scrollContainer = document.querySelector('.scroll-container');

// Initialize the loading manager
const loadingManager = new THREE.LoadingManager(
  // Loaded
  () => {
    // Show completion animation
    loadingBar.style.transform = 'scaleX(1)';
    loadingBarGlow.style.transform = 'scaleX(1)';
    loadingCounter.textContent = '100';
    loadingStatus.textContent = 'Ready!';
    
    // Create particle effects along the loading bar
    createLoadingBarParticles();
    
    // Animate loading screen away
    setTimeout(() => {
      // Animate the loading text
      gsap.to('.loading-content h1', {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
      
      // Animate loading bar and counter
      gsap.to('.loading-container', {
        y: -30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power2.out'
      });
      
      // Add a cool particle effect before transitioning
      createLoadingParticles();
      
      // Fade out loading screen
      gsap.to(loadingScreen, {
        opacity: 0,
        duration: 1.2,
        delay: 1.5,
        onComplete: () => {
          loadingScreen.classList.add('hidden');
          startIntroAnimation();
        }
      });
    }, 500);
  },
  // Progress
  (itemUrl, itemsLoaded, itemsTotal) => {
    const progressRatio = itemsLoaded / itemsTotal;
    const progressPercent = Math.floor(progressRatio * 100);
    
    // Update loading bar
    loadingBar.style.transform = `scaleX(${progressRatio})`;
    loadingBarGlow.style.transform = `scaleX(${progressRatio})`;
    
    // Animate counter
    animateCounter(progressPercent);
    
    // Update loading status messages
    updateLoadingStatus(progressPercent, itemUrl);
  }
);

// Animate counter with smooth transition
let currentCounterValue = 0;
function animateCounter(targetValue) {
  gsap.to({ value: currentCounterValue }, {
    value: targetValue,
    duration: 0.5,
    ease: 'power2.out',
    onUpdate: function() {
      currentCounterValue = Math.floor(this.targets()[0].value);
      loadingCounter.textContent = currentCounterValue;
    }
  });
}

// Update loading status with dynamic messages
function updateLoadingStatus(progress, itemUrl) {
  let statusText = 'Initializing...';
  
  if (progress > 0 && progress <= 20) {
    statusText = 'Loading assets...';
  } else if (progress > 20 && progress <= 40) {
    statusText = 'Preparing environment...';
  } else if (progress > 40 && progress <= 60) {
    statusText = 'Building experience...';
  } else if (progress > 60 && progress <= 80) {
    statusText = 'Almost there...';
  } else if (progress > 80 && progress < 100) {
    statusText = 'Finalizing...';
  } else if (progress === 100) {
    statusText = 'Ready!';
  }
  
  loadingStatus.textContent = statusText;
}

// Create particles along the loading bar
function createLoadingBarParticles() {
  const particlesContainer = document.querySelector('.loading-bar-particles');
  
  // Clear existing particles
  particlesContainer.innerHTML = '';
  
  // Create new particles
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div');
    particle.className = 'loading-particle';
    
    // Random position along the bar
    const xPos = Math.random() * 100;
    const yOffset = (Math.random() - 0.5) * 20;
    
    // Random size
    const size = Math.random() * 6 + 2;
    
    // Apply styles
    particle.style.cssText = `
      position: absolute;
      left: ${xPos}%;
      top: 50%;
      width: ${size}px;
      height: ${size}px;
      background: white;
      border-radius: 50%;
      filter: blur(1px);
      transform: translate(-50%, -50%) translateY(${yOffset}px);
      opacity: 0;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
    `;
    
    particlesContainer.appendChild(particle);
    
    // Animate particle
    gsap.to(particle, {
      opacity: Math.random() * 0.8 + 0.2,
      y: (Math.random() - 0.5) * 30,
      duration: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });
  }
}

// Create cool particle effect for loading transition
function createLoadingParticles() {
  const container = document.createElement('div');
  container.className = 'loading-particles';
  loadingScreen.appendChild(container);
  
  // Create particles
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    
    // Random size
    const size = Math.random() * 8 + 4;
    
    // Apply styles
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    container.appendChild(particle);
    
    // Animate particles moving outward
    gsap.fromTo(particle, 
      { x: 0, y: 0, opacity: 0, scale: 0 },
      { 
        x: (Math.random() - 0.5) * window.innerWidth * 2,
        y: (Math.random() - 0.5) * window.innerHeight * 2,
        opacity: 1,
        scale: Math.random() * 3 + 1,
        duration: 1.5,
        ease: 'power2.out',
        delay: 0.5 + Math.random() * 0.5,
        onComplete: () => {
          gsap.to(particle, { opacity: 0, duration: 0.5 });
        }
      }
    );
  }
}

// Disable default scrolling on wheel events to implement custom scrolling
scrollContainer.addEventListener('wheel', (e) => {
  e.preventDefault();
  
  if (isScrolling) return;
  
  // Determine scroll direction
  const delta = e.deltaY;
  const direction = delta > 0 ? 1 : -1;
  
  // Get current section
  const currentPos = Math.round(scrollContainer.scrollTop / window.innerHeight);
  
  // Calculate next section with boundary checks
  const nextSection = Math.max(0, Math.min(panels.length - 1, currentPos + direction));
  
  // Only scroll if it's a different section
  if (nextSection !== currentPos) {
    scrollToSection(nextSection);
  }
}, { passive: false });

// Global variables to track scroll state
let isScrolling = false;
let currentSection = 0;

// Main scroll function
function scrollToSection(sectionIndex) {
  if (isScrolling) return;
  isScrolling = true;
  
  // Update current section
  currentSection = sectionIndex;
  
  // Calculate target scroll position
  const targetPosition = sectionIndex * window.innerHeight;
  
  // Animate the scroll
  gsap.to(scrollContainer, {
    scrollTop: targetPosition,
    duration: 1,
    ease: "power2.inOut",
    onComplete: () => {
      // Update navigation
      updateActiveNavigation();
      
      // Update 3D scene
      updateSceneForSection(sectionIndex);
      
      // Wait a bit before allowing another scroll
      setTimeout(() => {
        isScrolling = false;
      }, 300);
    }
  });
}

// Update all click handlers to use the new scrollToSection function
scrollDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    scrollToSection(index);
  });
});

menuItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    scrollToSection(index);
  });
});

document.querySelectorAll('[data-scroll]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const sectionIndex = parseInt(link.getAttribute('data-scroll'));
    scrollToSection(sectionIndex);
  });
});

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
  if (isScrolling) return;
  
  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    e.preventDefault();
    const nextSection = Math.min(panels.length - 1, currentSection + 1);
    if (nextSection !== currentSection) {
      scrollToSection(nextSection);
    }
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault();
    const prevSection = Math.max(0, currentSection - 1);
    if (prevSection !== currentSection) {
      scrollToSection(prevSection);
    }
  }
});

// Handle touch events for mobile
let touchStartY = 0;
let touchEndY = 0;
const minSwipeDistance = 50;

scrollContainer.addEventListener('touchstart', (e) => {
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

scrollContainer.addEventListener('touchend', (e) => {
  if (isScrolling) return;
  
  touchEndY = e.changedTouches[0].screenY;
  
  // Calculate distance
  const distance = touchStartY - touchEndY;
  
  // Check if the swipe is long enough
  if (Math.abs(distance) < minSwipeDistance) return;
  
  // Determine direction
  const direction = distance > 0 ? 1 : -1;
  
  // Calculate next section with boundary checks
  const nextSection = Math.max(0, Math.min(panels.length - 1, currentSection + direction));
  
  // Only scroll if it's a different section
  if (nextSection !== currentSection) {
    scrollToSection(nextSection);
  }
}, { passive: true });

// Handle page visibility to save resources
let isPageVisible = true;
document.addEventListener('visibilitychange', () => {
  isPageVisible = document.visibilityState === 'visible';
});

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

// Optimize performance by setting frustum culling
const frustumSize = 10;

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// Renderer with precision and power preference for better performance
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance',
  precision: 'mediump'
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearAlpha(0);

// Post-processing
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(sizes.width, sizes.height),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = 0;
bloomPass.strength = 1.5;
bloomPass.radius = 0.2;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 3000;

const posArray = new Float32Array(particlesCount * 3);
const scaleArray = new Float32Array(particlesCount);

for (let i = 0; i < particlesCount * 3; i += 3) {
  // Position
  const r = 5;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  
  const sinPhiRadius = Math.sin(phi) * r;
  
  posArray[i] = sinPhiRadius * Math.sin(theta);     // x
  posArray[i + 1] = sinPhiRadius * Math.cos(theta); // y
  posArray[i + 2] = Math.cos(phi) * r;              // z
  
  // Scale (size)
  scaleArray[i / 3] = Math.random();
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));

// Shaders
const particlesMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    attribute float scale;
    varying vec3 vColor;
    
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      
      // Color based on position
      vColor = vec3(
        abs(normalize(position).x),
        abs(normalize(position).y) * 0.5,
        abs(normalize(position).z)
      );
      
      // Make points closer to center larger
      float dist = length(position);
      float scaleBasedOnDistance = 1.0 - dist / 5.0;
      
      // Final size
      vec4 viewPosition = viewMatrix * modelPosition;
      gl_Position = projectionMatrix * viewPosition;
      gl_PointSize = (scale * 10.0 + 1.0) * scaleBasedOnDistance * 
                    (1000.0 / -viewPosition.z);
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    
    void main() {
      float distFromCenter = length(gl_PointCoord - vec2(0.5));
      if (distFromCenter > 0.5) {
        discard;
      }
      
      // Create a soft circle
      float strength = 1.0 - distFromCenter * 2.0;
      strength = pow(strength, 2.0);
      
      vec3 finalColor = mix(vec3(1.0, 0.2, 0.4), vec3(1.0, 0.6, 0.2), vColor.x);
      finalColor = mix(finalColor, vec3(0.2, 0.2, 1.0), vColor.z * 0.5);
      
      gl_FragColor = vec4(finalColor, strength);
    }
  `,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Torus Knot
const torusKnotGeometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
const torusKnotMaterial = new THREE.MeshBasicMaterial({
  color: 0xff3366,
  transparent: true,
  opacity: 0.2,
  wireframe: true
});
const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
scene.add(torusKnot);

// Flying objects
const flyingObjects = [];

// Create floating cubes
for(let i = 0; i < 10; i++) {
  const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(Math.random(), Math.random(), Math.random()),
    wireframe: true
  });
  
  const cube = new THREE.Mesh(geometry, material);
  
  // Random positions far from center
  const radius = 5 + Math.random() * 5;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  
  cube.position.x = radius * Math.sin(phi) * Math.sin(theta);
  cube.position.y = radius * Math.sin(phi) * Math.cos(theta);
  cube.position.z = radius * Math.cos(phi);
  
  // Store original position for animations
  cube.userData.originalPosition = cube.position.clone();
  cube.userData.randomAxis = new THREE.Vector3(
    Math.random() - 0.5,
    Math.random() - 0.5,
    Math.random() - 0.5
  ).normalize();
  
  // Start with scale 0 to avoid double animation
  cube.scale.set(0, 0, 0);
  
  scene.add(cube);
  flyingObjects.push(cube);
}

// Create floating icosahedrons
for(let i = 0; i < 5; i++) {
  const geometry = new THREE.IcosahedronGeometry(0.5, 0);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff3366,
    wireframe: true,
    transparent: true,
    opacity: 0.5
  });
  
  const ico = new THREE.Mesh(geometry, material);
  
  // Random positions far from center
  const radius = 7 + Math.random() * 5;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  
  ico.position.x = radius * Math.sin(phi) * Math.sin(theta);
  ico.position.y = radius * Math.sin(phi) * Math.cos(theta);
  ico.position.z = radius * Math.cos(phi);
  
  // Store original position for animations
  ico.userData.originalPosition = ico.position.clone();
  ico.userData.randomAxis = new THREE.Vector3(
    Math.random() - 0.5,
    Math.random() - 0.5,
    Math.random() - 0.5
  ).normalize();
  
  // Start with scale 0 to avoid double animation
  ico.scale.set(0, 0, 0);
  
  scene.add(ico);
  flyingObjects.push(ico);
}

// Animation
const clock = new THREE.Clock();
let animationFrameId = null;
let animationStarted = false;

const tick = () => {
  // Only start animation once
  if (!animationStarted) {
    animationStarted = true;
  }
  
  // Only run animation if page is visible
  if (!isPageVisible) {
    animationFrameId = requestAnimationFrame(tick);
    return;
  }

  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Rotate torus knot
  torusKnot.rotation.x = elapsedTime * 0.3;
  torusKnot.rotation.y = elapsedTime * 0.2;
  
  // Update particles
  particles.rotation.y = elapsedTime * 0.05;
  particles.rotation.x = elapsedTime * 0.03;
  
  // Update flying objects
  flyingObjects.forEach((object) => {
    // Rotate around random axis
    object.rotateOnAxis(object.userData.randomAxis, 0.01);
    
    // Subtle floating animation
    const originalPos = object.userData.originalPosition;
    object.position.x = originalPos.x + Math.sin(elapsedTime * 0.5 + object.position.z) * 0.3;
    object.position.y = originalPos.y + Math.cos(elapsedTime * 0.5 + object.position.x) * 0.3;
    object.position.z = originalPos.z + Math.sin(elapsedTime * 0.3 + object.position.y) * 0.3;
  });
  
  // Mouse interaction
  particles.rotation.x += mouse.y * 0.01;
  particles.rotation.y += mouse.x * 0.01;
  
  // Render
  composer.render();

  // Call tick again on the next frame
  animationFrameId = requestAnimationFrame(tick);
};

// Mouse effect
const mouse = {
  x: 0,
  y: 0
};

// Properly define the mouse move handler
const handleMouseMove = (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
};

// Properly define the resize handler
const handleResize = () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer with pixel ratio clamping for performance
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Update composer
  composer.setSize(sizes.width, sizes.height);
};

// Properly define visibility change handler
const handleVisibilityChange = () => {
  isPageVisible = document.visibilityState === 'visible';
};

// Handle proper cleanup to prevent memory leaks
function cleanupScene() {
  // Stop animation loop
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  
  // Dispose of geometries and materials
  scene.traverse((object) => {
    if (object.geometry) {
      object.geometry.dispose();
    }
    
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach(material => material.dispose());
      } else {
        object.material.dispose();
      }
    }
  });
  
  // Dispose of post-processing
  composer.dispose();
  renderer.dispose();
  
  // Remove event listeners
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
}

// Add event listeners - but don't start animation loop yet
window.addEventListener('resize', handleResize);
window.addEventListener('mousemove', handleMouseMove);
document.addEventListener('visibilitychange', handleVisibilityChange);

// Prevent multiple initialization
let hasStartedIntroAnimation = false;
let isTransitioning = false;

// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Scroll effect
let scrollY = window.scrollY;
let lastScrollTop = 0;
let scrollTimeout = null;
let scrollAnimationInProgress = false;

// Scroll-triggered animations for content sections
function setupScrollAnimations() {
  // Who I Am section animations
  gsap.from('#who-i-am .section-title', {
    scrollTrigger: {
      trigger: '#who-i-am',
      start: 'top 80%',
      scroller: '.scroll-container'
    },
    y: 50,
    opacity: 0,
    duration: 1
  });
  
  gsap.from('#who-i-am .about-image-container', {
    scrollTrigger: {
      trigger: '#who-i-am',
      start: 'top 70%',
      scroller: '.scroll-container'
    },
    y: 50,
    opacity: 0,
    duration: 1
  });
  
  gsap.from('#who-i-am .about-text', {
    scrollTrigger: {
      trigger: '#who-i-am',
      start: 'top 70%',
      scroller: '.scroll-container'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.3
  });
  
  // My Expertise section animations
  gsap.from('#my-expertise .section-title', {
    scrollTrigger: {
      trigger: '#my-expertise',
      start: 'top 80%',
      scroller: '.scroll-container'
    },
    y: 50,
    opacity: 0,
    duration: 1
  });
  
  gsap.from('#my-expertise .skills-list li', {
    scrollTrigger: {
      trigger: '#my-expertise',
      start: 'top 70%',
      scroller: '.scroll-container'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1
  });
  
  // My Approach section animations
  gsap.from('#my-approach .section-title', {
    scrollTrigger: {
      trigger: '#my-approach',
      start: 'top 80%',
      scroller: '.scroll-container'
    },
    y: 50,
    opacity: 0,
    duration: 1
  });
  
  gsap.from('#my-approach .content-block > p', {
    scrollTrigger: {
      trigger: '#my-approach',
      start: 'top 70%',
      scroller: '.scroll-container'
    },
    y: 30,
    opacity: 0,
    duration: 1
  });
  
  gsap.from('#my-approach .principle', {
    scrollTrigger: {
      trigger: '#my-approach .principle',
      start: 'top 80%',
      scroller: '.scroll-container'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15
  });
  
  // My Content section animations
  gsap.from('#my-content .section-title', {
    scrollTrigger: {
      trigger: '#my-content',
      start: 'top 80%',
      scroller: '.scroll-container'
    },
    y: 50,
    opacity: 0,
    duration: 1
  });
  
  gsap.from('#my-content .instagram-profile', {
    scrollTrigger: {
      trigger: '#my-content',
      start: 'top 70%',
      scroller: '.scroll-container'
    },
    scale: 0.8,
    opacity: 0,
    duration: 1,
    ease: 'back.out(1.7)'
  });
  
  gsap.from('#my-content .instagram-stats', {
    scrollTrigger: {
      trigger: '#my-content',
      start: 'top 70%',
      scroller: '.scroll-container'
    },
    x: 30,
    opacity: 0,
    duration: 1,
    delay: 0.2
  });
  
  // Projects section animations
  gsap.from('#projects .section-title', {
    scrollTrigger: {
      trigger: '#projects',
      start: 'top 80%',
      scroller: '.scroll-container'
    },
    y: 50,
    opacity: 0,
    duration: 1
  });
  
  gsap.from('#projects .project-card', {
    scrollTrigger: {
      trigger: '#projects',
      start: 'top 70%',
      scroller: '.scroll-container'
    },
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.2
  });
  
  // Contact section animations
  gsap.from('#contact .section-title', {
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 80%',
      scroller: '.scroll-container'
    },
    y: 50,
    opacity: 0,
    duration: 1
  });
  
  gsap.from('#contact .contact-form', {
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 70%',
      scroller: '.scroll-container'
    },
    y: 50,
    opacity: 0,
    duration: 1
  });
  
  gsap.from('#contact .contact-info', {
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 70%',
      scroller: '.scroll-container'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.2
  });
}

// Optimize project images loading
function lazyLoadImages() {
  // Get all project image containers
  const projectImages = document.querySelectorAll('.project-image');
  
  // Create an observer for lazy loading
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        // Only load the background image when in view
        if (img.dataset.src) {
          img.style.backgroundImage = `url(${img.dataset.src})`;
          img.dataset.src = '';
        }
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '100px' });
  
  // Observe each project image
  projectImages.forEach(img => {
    imageObserver.observe(img);
  });
}

// Initialize after DOM is loaded or after intro animation
function setupPageOptimizations() {
  // Setup lazy loading for images
  lazyLoadImages();
  
  // Clean up unnecessary resources after startup
  setTimeout(() => {
    // Clean up loading screen resources if hidden
    if (loadingScreen.classList.contains('hidden')) {
      loadingScreen.innerHTML = '';
    }
  }, 2000);
}

// Start intro animation
function startIntroAnimation() {
  // Prevent multiple initializations
  if (hasStartedIntroAnimation) return;
  hasStartedIntroAnimation = true;
  
  // Resume the main animation loop
  tick();
  
  // Animate camera
  gsap.from(camera.position, {
    z: 10,
    duration: 2,
    ease: 'power2.out'
  });
  
  // Animate particles
  gsap.from(particles.scale, {
    x: 0,
    y: 0,
    z: 0,
    duration: 2,
    ease: 'power2.out'
  });
  
  // Animate torus knot
  gsap.from(torusKnot.scale, {
    x: 0,
    y: 0,
    z: 0,
    duration: 1.5,
    ease: 'back.out(1.7)',
    delay: 0.5
  });
  
  // Animate flying objects - they already have scale 0 from initialization
  flyingObjects.forEach((object, i) => {
    gsap.to(object.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1,
      ease: 'back.out(1.7)',
      delay: 1 + i * 0.1
    });
  });
  
  // Setup scroll animations
  setupScrollAnimations();
  
  // Run optimizations after animations complete
  setupPageOptimizations();
  
  // Initialize to correct section if page was loaded at a scroll position
  setTimeout(() => {
    updateActiveNavigation();
    const initialSection = Math.round(scrollContainer.scrollTop / sizes.height);
    if (initialSection !== 0) {
      currentSection = initialSection;
    }
  }, 100);
}

// Start loading animation
// Fake some loading time for the loading screen effect
let progress = 0;
const loadingInterval = setInterval(() => {
  progress += Math.random() * 10;
  if (progress >= 100) {
    progress = 100;
    clearInterval(loadingInterval);
    
    // Start the transition effect
    setTimeout(() => {
      // Animate the loading text
      gsap.to('.loading-content h1', {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
      
      // Animate loading bar and counter
      gsap.to('.loading-container', {
        y: -30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power2.out'
      });
      
      // Add a cool particle effect before transitioning
      createLoadingParticles();
      
      // Fade out loading screen
      gsap.to(loadingScreen, {
        opacity: 0,
        duration: 1.2,
        delay: 1.5,
        onComplete: () => {
          loadingScreen.classList.add('hidden');
          startIntroAnimation();
        }
      });
    }, 500);
  }
  
  // Update loading bar
  loadingBar.style.transform = `scaleX(${progress / 100})`;
  loadingBarGlow.style.transform = `scaleX(${progress / 100})`;
  
  // Animate counter
  animateCounter(Math.floor(progress));
  
  // Update loading status
  updateLoadingStatus(Math.floor(progress));
}, 200);

// Initialize active state for navigation
updateActiveNavigation();

// Update active dot and menu item based on scroll position
function updateActiveNavigation() {
  const currentSection = Math.round(scrollContainer.scrollTop / window.innerHeight);
  
  scrollDots.forEach((dot, index) => {
    if (index === currentSection) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
  
  menuItems.forEach((item, index) => {
    if (index === currentSection) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// Update scene elements based on current section
function updateSceneForSection(sectionIndex) {
  // Cancel any running animations
  gsap.killTweensOf(camera.position);
  gsap.killTweensOf(particles.rotation);
  gsap.killTweensOf(torusKnot.rotation);
  flyingObjects.forEach(object => {
    gsap.killTweensOf(object.position);
  });
  
  // Different camera positions and animations based on section
  switch(sectionIndex) {
    case 0: // Home
      gsap.to(camera.position, {
        duration: 1.5,
        ease: 'power2.inOut',
        x: 0,
        y: 0,
        z: 4
      });
      
      gsap.to([particles.rotation, torusKnot.rotation], {
        duration: 1.5,
        ease: 'power2.inOut',
        x: 0,
        y: 0
      });
      break;
      
    case 1: // Who I Am
      gsap.to(camera.position, {
        duration: 1.5,
        ease: 'power2.inOut',
        x: Math.sin(1) * 2,
        y: 0.5,
        z: 4 + Math.sin(1 * Math.PI) * 2
      });
      
      gsap.to([particles.rotation, torusKnot.rotation], {
        duration: 1.5,
        ease: 'power2.inOut',
        x: Math.sin(1 * Math.PI) * 0.5,
        y: Math.cos(1 * Math.PI) * 0.5
      });
      break;
      
    case 2: // My Expertise
      gsap.to(camera.position, {
        duration: 1.5,
        ease: 'power2.inOut',
        x: Math.sin(2) * 2,
        y: -0.5,
        z: 4 + Math.sin(2 * Math.PI) * 2
      });
      
      gsap.to([particles.rotation, torusKnot.rotation], {
        duration: 1.5,
        ease: 'power2.inOut',
        x: Math.sin(2 * Math.PI) * 0.5,
        y: Math.cos(2 * Math.PI) * 0.5
      });
      break;
      
    case 3: // My Approach
      gsap.to(camera.position, {
        duration: 1.5,
        ease: 'power2.inOut',
        x: Math.sin(3) * 2,
        y: 0.3,
        z: 4 + Math.sin(3 * Math.PI) * 2
      });
      
      gsap.to([particles.rotation, torusKnot.rotation], {
        duration: 1.5,
        ease: 'power2.inOut',
        x: Math.sin(3 * Math.PI) * 0.5,
        y: Math.cos(3 * Math.PI) * 0.5
      });
      break;
      
    case 4: // My Content
      gsap.to(camera.position, {
        duration: 1.5,
        ease: 'power2.inOut',
        x: Math.sin(4) * 2,
        y: -0.3,
        z: 4 + Math.sin(4 * Math.PI) * 2
      });
      
      gsap.to([particles.rotation, torusKnot.rotation], {
        duration: 1.5,
        ease: 'power2.inOut',
        x: Math.sin(4 * Math.PI) * 0.5,
        y: Math.cos(4 * Math.PI) * 0.5
      });
      break;
      
    case 5: // Projects
      gsap.to(camera.position, {
        duration: 1.5,
        ease: 'power2.inOut',
        x: Math.sin(5) * 2,
        y: 0.2,
        z: 4 + Math.sin(5 * Math.PI) * 2
      });
      
      gsap.to([particles.rotation, torusKnot.rotation], {
        duration: 1.5,
        ease: 'power2.inOut',
        x: Math.sin(5 * Math.PI) * 0.5,
        y: Math.cos(5 * Math.PI) * 0.5
      });
      break;
      
    case 6: // Contact
      gsap.to(camera.position, {
        duration: 1.5,
        ease: 'power2.inOut',
        x: Math.sin(6) * 2,
        y: -0.2,
        z: 4 + Math.sin(6 * Math.PI) * 2
      });
      
      gsap.to([particles.rotation, torusKnot.rotation], {
        duration: 1.5,
        ease: 'power2.inOut',
        x: Math.sin(6 * Math.PI) * 0.5,
        y: Math.cos(6 * Math.PI) * 0.5
      });
      break;
      
    default:
      gsap.to(camera.position, {
        duration: 1.5,
        ease: 'power2.inOut',
        x: Math.sin(sectionIndex) * 2,
        z: 4 + Math.sin(sectionIndex * Math.PI) * 2
      });
      
      gsap.to([particles.rotation, torusKnot.rotation], {
        duration: 1.5,
        ease: 'power2.inOut',
        x: Math.sin(sectionIndex * Math.PI) * 0.5,
        y: Math.cos(sectionIndex * Math.PI) * 0.5
      });
  }
  
  // Fly in objects from outside
  flyingObjects.forEach((object, i) => {
    gsap.to(object.position, {
      duration: 1 + Math.random() * 0.5,
      ease: 'power2.out',
      x: Math.sin(sectionIndex + i) * 3,
      y: Math.cos(sectionIndex + i) * 3,
      z: Math.sin(sectionIndex * i) * 2,
      delay: i * 0.05
    });
  });
} 