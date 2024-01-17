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

const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
const material = new THREE.MeshNormalMaterial()

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const renderer = new THREE.WebGLRenderer({ antialias: true })

// orbit controls
let controls = new OrbitControls(camera, renderer.domElement)
renderer.setSize(width, height)
renderer.setAnimationLoop(animation)
document.body.appendChild(renderer.domElement)

// animation

function animation(time) {
  mesh.rotation.x = time / 2000
  mesh.rotation.y = time / 1000

  renderer.render(scene, camera)
}
