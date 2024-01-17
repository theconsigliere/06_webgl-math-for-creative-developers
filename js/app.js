import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { createNoise2D } from "simplex-noise"
let noise = createNoise2D()

const width = window.innerWidth,
  height = window.innerHeight

// init

const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10)
camera.position.z = 1
camera.position.y = 1
// look at center of scene
camera.lookAt(0, 0, 0)

const scene = new THREE.Scene()
const size = 3
const divisions = 40

//grid helper
const gridHelper = new THREE.GridHelper(size, divisions)
scene.add(gridHelper)

let ball = new THREE.Mesh(
  new THREE.SphereGeometry(0.025, 32, 32),
  new THREE.MeshNormalMaterial()
)

let balls = []

for (let i = 0; i < 50; i++) {
  let mesh = ball.clone()

  balls.push({
    mesh,
    offset: Math.random(),
    index: i,
  })

  scene.add(mesh)
}

// orbit controls
const renderer = new THREE.WebGLRenderer({ antialias: true })

let controls = new OrbitControls(camera, renderer.domElement)
renderer.setSize(width, height)
renderer.setAnimationLoop(animation)
document.body.appendChild(renderer.domElement)

// animation

function animation(time) {
  let progress = (time / 2000) % 1

  //ball.position.y = noise(time / 1000, 0) * power

  balls.forEach((ball, i) => {
    let uniqueProgress = (progress + ball.offset) % 1 // progress will always be between 0 and 1
    ball.mesh.position.x = uniqueProgress - 0.5
    // osicllation
    let power = Math.sin(uniqueProgress * Math.PI)
    ball.mesh.position.y = noise(time / 1000, ball.index) * power
  })
  renderer.render(scene, camera)
}
