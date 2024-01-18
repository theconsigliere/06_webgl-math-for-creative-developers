import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

const width = window.innerWidth,
  height = window.innerHeight

// init

const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10)
const renderer = new THREE.WebGLRenderer({ antialias: true })
const scene = new THREE.Scene()
let controls = new OrbitControls(camera, renderer.domElement)
const size = 3
const divisions = 40

camera.position.z = 1
camera.position.y = 0
camera.position.x = 0
// look at center of scene
camera.lookAt(0, 0, 0)

//grid helper
// const gridHelper = new THREE.GridHelper(size, divisions)
// scene.add(gridHelper)

// checkerboard
let grid = []
let rows = 21
let sizeOfGrid = 0.1
let geometry = new THREE.BoxGeometry(sizeOfGrid, sizeOfGrid, sizeOfGrid)
let darkMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })
let whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

// inner Checkerboard

let innerGrid = []
let sizeOfInnerGrid = 0.0333333
let innerGeometry = new THREE.BoxGeometry(
  sizeOfInnerGrid,
  sizeOfInnerGrid,
  sizeOfInnerGrid
)

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < rows; j++) {
    // if it is odd or even choose material
    let material = (i + j) % 2 ? darkMaterial : whiteMaterial
    let mesh = new THREE.Mesh(geometry, material)
    // position block
    // - (rows - 1) / 2 centers the grid
    mesh.position.x = (i - (rows - 1) / 2) * sizeOfGrid
    mesh.position.y = (j - (rows - 1) / 2) * sizeOfGrid
    // move checkerboard back so inner grid on top is visible
    mesh.position.z = -sizeOfGrid / 2
    // add block to scene
    scene.add(mesh)
    // add block to grid
    grid.push(mesh)

    // inner checkerboard
    for (let ii = 0; ii < 3; ii++) {
      for (let jj = 0; jj < 3; jj++) {
        let innerMaterial = (i + j + ii + jj) % 2 ? darkMaterial : whiteMaterial
        let innerMesh = new THREE.Mesh(innerGeometry, innerMaterial)

        innerMesh.position.x =
          (i - (rows - 1) / 2) * sizeOfGrid + (ii - 1) * sizeOfInnerGrid
        innerMesh.position.y =
          (j - (rows - 1) / 2) * sizeOfGrid + (jj - 1) * sizeOfInnerGrid
        innerMesh.position.z = -sizeOfGrid / 6 + 0.001

        // add block to scene
        scene.add(innerMesh)
        // add block to grid
        innerGrid.push(innerMesh)
      }
    }
  }
}

renderer.setSize(width, height)
renderer.setAnimationLoop(animation)
document.body.appendChild(renderer.domElement)

// animation

function animation(time) {
  let progress = (time / 2000) % 1 // loops between 0 -> 1

  // z starts at 1 then goes to 2/3 (0.66) when progress hits 1 (zooms in)
  camera.position.z = 1 - progress * (2 / 3) // linear doesnt loop well
  camera.position.z = Math.exp(Math.log(1 / 3) * progress) // exponential zoom loops seemlessly

  innerGrid.forEach((block) => {
    block.scale.set(Math.min(1, progress * 2), Math.min(1, progress * 2), 1)
  })

  renderer.render(scene, camera)
}
