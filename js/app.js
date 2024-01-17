import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

const width = window.innerWidth,
  height = window.innerHeight

// init

const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10)
camera.position.z = 1
camera.position.y = 1
camera.position.x = 1
// look at center of scene
camera.lookAt(0, 0, 0)

const scene = new THREE.Scene()
const size = 3
const divisions = 40

//grid helper
const gridHelper = new THREE.GridHelper(size, divisions)
scene.add(gridHelper)

// orbit controls

let mesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.05, 32, 32),
  new THREE.MeshNormalMaterial()
)

function addPoint(x, y, z) {
  let point = mesh.clone()
  point.position.set(x, y, z)
  scene.add(point)

  return point
}

let number = 300

let objects = []

// makes a full circle of spheres
for (let i = 0; i < number; i++) {
  // math PI * 2 = 360 degrees (full circle)
  let theta = (i / number) * Math.PI * 2
  let x = Math.cos(theta)
  let y = Math.sin(theta)
  let z = 0

  let mesh = addPoint(x, y, z)
  objects.push({
    mesh,
    theta,
    random: Math.random(),
    x: Math.random() / 5,
    y: Math.random() / 5,
    z: Math.random() / 5,
  })
}

const renderer = new THREE.WebGLRenderer({ antialias: true })
let controls = new OrbitControls(camera, renderer.domElement)
renderer.setSize(width, height)
renderer.setAnimationLoop(animation)
document.body.appendChild(renderer.domElement)

// animation

function animation(time) {
  objects.forEach((object, i) => {
    let { mesh, theta, random, x, y, z } = object
    let newx = Math.cos(theta + time / 1000) + x
    let newy = Math.sin(theta + time / 1000) + y
    let newz = z

    mesh.position.set(newx, newy, newz)
  })
  mesh.rotation.x = time / 2000
  mesh.rotation.y = time / 1000

  renderer.render(scene, camera)
}
