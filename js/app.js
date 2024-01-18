import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import matcap from "../assets/matcap.png"

const width = window.innerWidth,
  height = window.innerHeight

// init
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 100)
const size = 3
const divisions = 40

camera.position.z = 4
camera.position.y = 2
camera.position.x = 0

//grid helper
// const gridHelper = new THREE.GridHelper(size, divisions)
// scene.add(gridHelper)

// look at center of scene
camera.lookAt(0, 0, 0)

let geometry = new THREE.PlaneGeometry(10, 10, 300, 300).rotateX(-Math.PI / 2) // move plane to be flat
let material = new THREE.MeshNormalMaterial({
  // color: 0x0000ff,
  side: THREE.DoubleSide,
  // wireframe: true,
})

let matcapTexture = new THREE.TextureLoader().load(matcap)
matcapTexture.colorSpace = THREE.SRGBColorSpace

let matcapMaterial = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture,
  side: THREE.DoubleSide,
})

let mesh = new THREE.Mesh(geometry, matcapMaterial)
scene.add(mesh)

//save original positions of plane
let originalPositions = [...geometry.attributes.position.array]

// orbit controls
let controls = new OrbitControls(camera, renderer.domElement)
renderer.setSize(width, height)
renderer.setAnimationLoop(animation)
document.body.appendChild(renderer.domElement)

// update geometry
function updateGeometry(time) {
  let positions = geometry.attributes.position.array
  for (let i = 0; i < positions.length; i += 3) {
    let x = originalPositions[i]
    let y = originalPositions[i + 1]
    let z = originalPositions[i + 2]

    positions[i] = x
    positions[i + 1] = y

    // Trochoidal wave
    // https://en.wikipedia.org/wiki/Trochoidal_wave

    // Layer 1
    positions[i] -= 0.4 * Math.sin(x * 0.5 + time)
    positions[i + 1] += 0.4 * Math.cos(x * 0.5 + time)

    // Layer 2 twice smaller
    positions[i] -= 0.2 * Math.sin(x + time * 0.5)
    positions[i + 1] += 0.2 * Math.cos(x + time * 0.5)

    // Layer 3 three times a smaller
    positions[i] -= 0.1 * Math.sin(x * 2 + time * 0.5)
    positions[i + 1] += 0.1 * Math.cos(x * 2 + time * 0.5)

    // Layer 4 four times a smaller
    positions[i] -= 0.05 * Math.sin(x * 4 + time * 0.3)
    positions[i + 1] += 0.05 * Math.cos(x * 4 + time * 0.3)

    // rotate the wave to make it more wave like

    positions[i] -= 0.05 * Math.sin(x * 4 + 2 * z + time)
    positions[i + 1] += 0.05 * Math.cos(x * 4 + 2 * z + time)

    // Layer 5 five times a smaller
    positions[i] -= 0.01 * Math.sin(x * 16 + time * 0.1)
    positions[i + 1] += 0.01 * Math.cos(x * 16 + time * 0.1)
  }

  geometry.attributes.position.needsUpdate = true
  geometry.computeVertexNormals()
}

// animation
function animation(time) {
  updateGeometry(time / 1000)
  renderer.render(scene, camera)
}
