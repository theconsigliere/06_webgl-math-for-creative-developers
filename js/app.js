import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { createNoise2D } from "simplex-noise"
const noise2D = createNoise2D()

const width = window.innerWidth,
  height = window.innerHeight

// init

const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10)
const renderer = new THREE.WebGLRenderer({ antialias: true })
let controls = new OrbitControls(camera, renderer.domElement)
const scene = new THREE.Scene()
const size = 3
const divisions = 40

camera.position.z = 1
camera.position.y = 1
camera.position.x = 1
// look at center of scene
camera.lookAt(0, 0, 0)

//grid helper
// const gridHelper = new THREE.GridHelper(size, divisions)
// scene.add(gridHelper)

let ribbon = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 0.2, 100, 1).rotateX(Math.PI / 2), // lay it flat,
  new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
)

scene.add(ribbon)

let vertices = ribbon.geometry.attributes.position.array

renderer.setSize(width, height)
renderer.setAnimationLoop(animation)
document.body.appendChild(renderer.domElement)

function distortedRibbon(time) {
  // move vertices
  for (let i = 0; i < vertices.length; i += 3) {
    // y axis
    // vertices[i + 1] = 0.1 * Math.sin(vertices[i] * 10 + time )
    // when looping with module multiply by 2 PI to transition smoothly
    vertices[i + 1] =
      0.1 *
      noise2D(
        vertices[i] * 4 + Math.cos(time * Math.PI * 2),
        Math.sin(time * Math.PI * 2)
      )
  }
  //update normals
  ribbon.geometry.attributes.position.needsUpdate = true
  // recalculate noraml after we move vertices of ribbon
  ribbon.geometry.computeVertexNormals()
}

// animation
function animation(time) {
  let correctedTime = (time / 3000) % 2 // loop from 0 to 1
  distortedRibbon(correctedTime)
  renderer.render(scene, camera)
}
