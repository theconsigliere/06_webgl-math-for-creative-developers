import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import img1 from "../img/img1.webp"
import img2 from "../img/img2.webp"

const width = window.innerWidth,
  height = window.innerHeight

// init

const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10)
camera.position.z = 1
// look at center of scene
camera.lookAt(0, 0, 0)

const scene = new THREE.Scene()
const size = 3
const divisions = 40

//grid helper
// const gridHelper = new THREE.GridHelper(size, divisions)
// scene.add(gridHelper)

let shaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uProgress: { value: 0 },
    uTexture: { value: new THREE.TextureLoader().load(img1) },
    uTexture2: { value: new THREE.TextureLoader().load(img2) },
  },

  vertexShader: `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
  `,
  fragmentShader: `
  uniform float uProgress;
  uniform sampler2D uTexture;
  uniform sampler2D uTexture2;
  varying vec2 vUv;

  float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }
  
  float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);
    
    float res = mix(
      mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
      mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
  }

  void main() {
    float intensity = sin(3.145926 * uProgress);
    float distortion = noise(vUv * 5.0) * 0.5 * intensity;
    vec2 distortedPosition = fract(
      vec2(intensity * 0.5, 0.) + 
      vec2(vUv.x + distortion, vUv.y)
    );
    vec4 color1 = texture2D(uTexture, distortedPosition);
    vec4 color2 = texture2D(uTexture2, distortedPosition);
    gl_FragColor = mix(color1, color2, uProgress);
  }
  `,
})

// called a quad as you only use it output some time of image on top of it
let quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), shaderMaterial)
scene.add(quad)

const renderer = new THREE.WebGLRenderer({ antialias: true })

// orbit controls
let controls = new OrbitControls(camera, renderer.domElement)
renderer.setSize(width, height)
renderer.setAnimationLoop(animation)
document.body.appendChild(renderer.domElement)

// animation

function animation(time) {
  let progress = (time / 2000) % 1 // 0 -> 1
  progress = Math.sin(time / 1000) // -1 -> 1
  progress = (Math.sin(time / 1000) + 1) / 2 // 0 -> 2
  shaderMaterial.uniforms.uProgress.value = progress // changes between images
  renderer.render(scene, camera)
}
