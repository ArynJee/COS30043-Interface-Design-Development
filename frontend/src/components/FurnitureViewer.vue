<template>
  <div class="fv-wrap" ref="container">
    <div v-if="loading" class="fv-loading">
      <div class="fv-spinner"></div>
      <span>Preparing 3D model…</span>
    </div>
    <div class="fv-hint">
      <span>Drag to rotate · Scroll to zoom</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const props = defineProps({
  skeletonType: { type: String, default: '' },
  furnitureType: { type: String, default: '' },
  configuration: { type: Object, default: () => ({}) },
})

const container = ref(null)
const loading = ref(true)

let scene, camera, renderer, controls, rafId, currentGroup

// ─── scene bootstrap ────────────────────────────────────────────────────────
function init() {
  const el = container.value
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xF5F0E8)
  scene.fog = new THREE.FogExp2(0xF5F0E8, 0.06)

  camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 100)
  camera.position.set(2.5, 2.2, 3.2)

  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
  renderer.setSize(el.clientWidth, el.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1
  el.appendChild(renderer.domElement)

  // lighting
  scene.add(new THREE.AmbientLight(0xFFF8F0, 0.7))
  const key = new THREE.DirectionalLight(0xFFFFFF, 0.9)
  key.position.set(4, 6, 3)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  key.shadow.camera.near = 0.1
  key.shadow.camera.far = 20
  key.shadow.camera.left = -4
  key.shadow.camera.right = 4
  key.shadow.camera.top = 4
  key.shadow.camera.bottom = -4
  scene.add(key)
  const fill = new THREE.DirectionalLight(0xFFF0D8, 0.35)
  fill.position.set(-3, 3, -2)
  scene.add(fill)

  // floor
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({ color: 0xE8E0D5, roughness: 0.95 })
  )
  floorMesh.rotation.x = -Math.PI / 2
  floorMesh.receiveShadow = true
  scene.add(floorMesh)

  // orbit controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.06
  controls.maxPolarAngle = Math.PI / 2 - 0.02
  controls.minDistance = 1
  controls.maxDistance = 10
  controls.target.set(0, 0.8, 0)
  controls.update()

  window.addEventListener('resize', onResize)
  animate()
}

function animate() {
  rafId = requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

function onResize() {
  if (!container.value) return
  const { clientWidth: w, clientHeight: h } = container.value
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
}

// ─── material helpers ────────────────────────────────────────────────────────
const MAT_PROPS = {
  solid_wood:   { roughness: 0.85, metalness: 0.0 },
  laminate:     { roughness: 0.55, metalness: 0.0 },
  mdf:          { roughness: 0.70, metalness: 0.0 },
  plywood:      { roughness: 0.75, metalness: 0.0 },
  metal:        { roughness: 0.30, metalness: 0.8 },
  steel:        { roughness: 0.20, metalness: 0.9 },
  ceramic:      { roughness: 0.10, metalness: 0.0 },
  marble:       { roughness: 0.08, metalness: 0.1 },
  granite:      { roughness: 0.45, metalness: 0.0 },
  glass:        { roughness: 0.05, metalness: 0.2 },
  stone:        { roughness: 0.80, metalness: 0.0 },
  leather:      { roughness: 0.55, metalness: 0.0 },
  faux_leather: { roughness: 0.60, metalness: 0.0 },
  velvet:       { roughness: 0.95, metalness: 0.0 },
  cotton_linen: { roughness: 0.92, metalness: 0.0 },
  chenille:     { roughness: 0.95, metalness: 0.0 },
  mesh:         { roughness: 0.90, metalness: 0.0 },
  fabric:       { roughness: 0.90, metalness: 0.0 },
  none:         { roughness: 0.70, metalness: 0.0 },
}

function mat(materialId, colorHex) {
  const p = MAT_PROPS[materialId] || { roughness: 0.7, metalness: 0.0 }
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorHex || '#C8A87A'),
    roughness: p.roughness,
    metalness: p.metalness,
  })
}

function box(w, h, d, matId, colorHex) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(matId, colorHex))
  m.castShadow = true
  m.receiveShadow = true
  return m
}

function cylinder(rt, rb, h, matId, colorHex, segs = 16) {
  const m = new THREE.Mesh(
    new THREE.CylinderGeometry(rt, rb, h, segs),
    mat(matId, colorHex)
  )
  m.castShadow = true
  return m
}

// ─── model builder router ────────────────────────────────────────────────────
function buildModel(skeletonType, furnitureType, cfg) {
  switch (skeletonType) {
    case 'shelf_unit':          return buildShelfUnit(furnitureType, cfg)
    case 'upholstered_seating': return buildUpholsteredSeating(furnitureType, cfg)
    case 'table':               return buildTable(furnitureType, cfg)
    case 'cabinet':             return buildCabinet(furnitureType, cfg)
    case 'bed_frame':           return buildBedFrame(cfg)
    case 'wardrobe':            return buildWardrobe(cfg)
    case 'counter':             return buildCounter(cfg)
    case 'stool':               return buildStool(cfg)
    case 'office_chair':        return buildOfficeChair(cfg)
    case 'sink':                return buildSink(cfg)
    default:                    return null
  }
}

// ─── SHELF UNIT ──────────────────────────────────────────────────────────────
function buildShelfUnit(furnitureType, cfg) {
  const g = new THREE.Group()
  const shapeId = cfg.shape?.id || 'standard'
  const matId   = cfg.material?.id || 'laminate'
  const col     = cfg.color?.hex || '#C8A87A'
  const darkCol = new THREE.Color(col).multiplyScalar(0.80).getStyle()

  const W = { standard: 1.0, wide: 1.4, narrow: 0.7, with_doors: 1.0 }[shapeId] || 1.0
  const N = { standard: 4,   wide: 6,   narrow: 3,   with_doors: 4   }[shapeId] || 4
  const H = 1.85, D = 0.30, T = 0.028

  const addMesh = (m, x, y, z) => { m.position.set(x, y, z); g.add(m) }

  // side panels
  addMesh(box(T, H, D, matId, col), -W / 2 + T / 2, H / 2, 0)
  addMesh(box(T, H, D, matId, col),  W / 2 - T / 2, H / 2, 0)
  // top & bottom
  addMesh(box(W, T, D, matId, col), 0, H - T / 2, 0)
  addMesh(box(W, T, D, matId, col), 0, T / 2, 0)
  // back panel
  addMesh(box(W - 2 * T, H - T, 0.01, matId, darkCol), 0, H / 2, -D / 2 + 0.005)

  // intermediate shelves
  const shelfW = W - 2 * T
  for (let i = 1; i < N; i++) {
    const y = (H / N) * i
    addMesh(box(shelfW, T, D - 0.02, matId, col), 0, y, 0.01)
  }

  // doors
  if (shapeId === 'with_doors') {
    const doorW = shelfW / 2 - 0.005
    const doorH = H * 0.52
    const doorMat = mat(matId, col)
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x8B7355, roughness: 0.3, metalness: 0.7 })
    for (let i = 0; i < 2; i++) {
      const xd = (i === 0 ? -1 : 1) * (W / 4)
      const door = new THREE.Mesh(new THREE.BoxGeometry(doorW, doorH, 0.018), doorMat)
      door.castShadow = true
      door.position.set(xd, doorH / 2 + T, D / 2 + 0.009)
      g.add(door)
      const handle = cylinder(0.006, 0.006, 0.06, 'metal', '#8B7355', 8)
      handle.rotation.z = Math.PI / 2
      handle.position.set(xd + (i === 0 ? 0.07 : -0.07), doorH / 2 + T, D / 2 + 0.025)
      g.add(handle)
    }
  }
  return g
}

// ─── UPHOLSTERED SEATING ─────────────────────────────────────────────────────
function buildUpholsteredSeating(furnitureType, cfg) {
  const g = new THREE.Group()
  const isArmchair = furnitureType === 'armchair'
  const shapeId  = cfg.shape?.id || (isArmchair ? 'standard' : '2_seater')
  const fabricId = cfg.fabric?.id || 'cotton_linen'
  const col      = cfg.color?.hex || '#D4B896'
  const legId    = cfg.legs?.id || 'tapered_wood'
  const legCol   = '#8B6A50'

  const isSofa = !isArmchair

  // seat width
  const seatW = isArmchair ? 0.85
    : shapeId === '3_seater' ? 2.2
    : shapeId === 'l_shaped' ? 2.0
    : shapeId === 'curved' ? 1.9
    : 1.6
  const D = isArmchair ? 0.80 : 0.87
  const seatH = 0.45, backH = 0.50, armH = 0.32, legH = 0.18

  const mk = mat(fabricId, col)
  const legMk = mat('solid_wood', legCol)
  const woodLightMk = mat('solid_wood', '#9B7A5B')

  const addMesh = (m, x, y, z) => { m.position.set(x, y, z); g.add(m) }

  // base platform
  addMesh(box(seatW, 0.12, D, fabricId, col), 0, legH + 0.06, 0)
  // seat cushion(s)
  const nSeats = isArmchair ? 1 : shapeId === '3_seater' ? 3 : 2
  const cW = (seatW - 0.04) / nSeats - 0.02
  for (let i = 0; i < nSeats; i++) {
    const cx = -seatW / 2 + cW / 2 + i * (cW + 0.02) + 0.02
    addMesh(box(cW, 0.14, D - 0.06, fabricId, col), cx, legH + 0.19, 0.01)
  }
  // back cushion
  const bk = box(seatW - 0.06, backH, 0.14, fabricId, col)
  bk.position.set(0, legH + 0.12 + backH / 2, -(D / 2) + 0.07)
  bk.rotation.x = 0.07
  bk.castShadow = true
  g.add(bk)
  // arm rests
  if (!isArmchair || shapeId !== 'barrel') {
    const armW = 0.13
    for (const sx of [-1, 1]) {
      // vertical part
      addMesh(box(armW, armH, D, fabricId, col), sx * (seatW / 2 - armW / 2), legH + armH / 2, 0)
    }
  }
  // legs
  const lx = seatW / 2 - 0.07, lz = D / 2 - 0.07
  for (const [sx, sz] of [[-1,-1],[-1,1],[1,-1],[1,1]]) {
    if (legId === 'hairpin_metal') {
      const lm = cylinder(0.012, 0.008, legH, 'metal', '#A0A0A0', 6)
      lm.position.set(sx * lx, legH / 2, sz * lz)
      g.add(lm)
    } else {
      addMesh(box(0.055, legH, 0.055, 'solid_wood', legCol), sx * lx, legH / 2, sz * lz)
    }
  }

  // L-shape extension
  if (isSofa && shapeId === 'l_shaped') {
    const extW = 1.35, extD = 0.87
    addMesh(box(extD, 0.12, extW, fabricId, col), seatW / 2 + extD / 2, legH + 0.06, -extW / 2 + D / 2)
    addMesh(box(extD - 0.06, 0.14, extW - 0.06, fabricId, col), seatW / 2 + extD / 2, legH + 0.19, -extW / 2 + D / 2)
    // back for ext
    addMesh(box(0.14, backH, extW, fabricId, col), seatW / 2 + extD - 0.07, legH + 0.12 + backH / 2, -extW / 2 + D / 2)
    for (const [sx, sz] of [[1,-1],[1,1]]) {
      addMesh(box(0.055, legH, 0.055, 'solid_wood', legCol),
        seatW / 2 + sx * (extD / 2 - 0.07),
        legH / 2,
        sz * (extW / 2 - 0.07) + (-extW / 2 + D / 2)
      )
    }
  }

  return g
}

// ─── TABLE ───────────────────────────────────────────────────────────────────
function buildTable(furnitureType, cfg) {
  const g = new THREE.Group()
  const shapeId = cfg.shape?.id || 'rect'
  const matId   = cfg.material?.id || 'solid_wood'
  const col     = cfg.color?.hex || '#C8A87A'
  const legId   = cfg.legs?.id || 'tapered_wood'

  const dims = {
    coffee_table: { W: 1.15, H: 0.44, D: 0.60 },
    dining_table: { W: 1.80, H: 0.75, D: 0.90 },
    desk:         { W: 1.50, H: 0.75, D: 0.65 },
  }
  const { W, H, D } = dims[furnitureType] || dims.desk
  const topT = 0.045

  const isRound = shapeId === 'round' || shapeId === 'round_4'
  const isOval  = shapeId === 'oval'  || shapeId === 'oval_6'

  // tabletop
  if (isRound) {
    const top = cylinder(W / 2, W / 2, topT, matId, col, 48)
    top.position.set(0, H, 0)
    g.add(top)
  } else if (isOval) {
    // oval = scaled cylinder on X
    const top = cylinder(D / 2, D / 2, topT, matId, col, 48)
    top.scale.x = W / D
    top.position.set(0, H, 0)
    g.add(top)
  } else {
    const top = box(W, topT, D, matId, col)
    top.position.set(0, H, 0)
    g.add(top)
  }

  const legH = H - topT
  const lx = W / 2 - 0.06, lz = D / 2 - 0.06
  const legColHex = col

  if (legId === 'pedestal') {
    const col2 = cylinder(0.05, 0.08, legH * 0.9, matId, legColHex, 16)
    col2.position.set(0, legH * 0.45, 0)
    g.add(col2)
    const base = box(W * 0.55, 0.03, D * 0.55, matId, legColHex)
    base.position.set(0, 0.015, 0)
    g.add(base)
  } else if (legId === 'x_cross') {
    for (const sx of [-1, 1]) {
      const xleg = box(0.04, legH * 1.15, 0.04, matId, legColHex)
      xleg.position.set(sx * (lx - 0.12), legH / 2, 0)
      xleg.rotation.z = sx * 0.28
      xleg.castShadow = true
      g.add(xleg)
    }
  } else if (legId === 'hairpin_metal') {
    for (const [sx, sz] of [[-1,-1],[-1,1],[1,-1],[1,1]]) {
      const leg = cylinder(0.008, 0.006, legH, 'metal', '#9A9A9A', 6)
      leg.position.set(sx * lx, legH / 2, sz * lz)
      g.add(leg)
    }
  } else {
    // tapered wood legs (default)
    for (const [sx, sz] of [[-1,-1],[-1,1],[1,-1],[1,1]]) {
      const leg = cylinder(0.025, 0.04, legH, matId, legColHex, 8)
      leg.position.set(sx * lx, legH / 2, sz * lz)
      g.add(leg)
    }
  }

  // desk: optional hutch
  if (furnitureType === 'desk' && shapeId === 'with_hutch') {
    const hutch = box(W * 0.6, 0.6, 0.25, matId, col)
    hutch.position.set(-W * 0.2, H + topT / 2 + 0.3, -(D / 2) + 0.125)
    hutch.castShadow = true
    g.add(hutch)
  }

  // desk: L-shape return
  if (furnitureType === 'desk' && shapeId === 'l_shape') {
    const retTop = box(topT, D * 0.85, 0.65, matId, col)
    retTop.position.set(-W / 2 - 0.3, H, -D * 0.4)
    g.add(retTop)
    const retLeg = cylinder(0.025, 0.04, legH, matId, legColHex, 8)
    retLeg.position.set(-W / 2 - 0.6, legH / 2, -D * 0.4)
    g.add(retLeg)
  }

  return g
}

// ─── CABINET ─────────────────────────────────────────────────────────────────
function buildCabinet(furnitureType, cfg) {
  const g = new THREE.Group()
  const shapeId = cfg.shape?.id || '2_drawers'
  const matId   = cfg.material?.id || 'laminate'
  const col     = cfg.color?.hex || '#C8A87A'

  const dims = {
    nightstand:      { W: 0.52, H: 0.57, D: 0.40 },
    drawer_cabinet:  { W: 0.52, H: 1.05, D: 0.45 },
    kitchen_cabinet: { W: 0.80, H: 0.85, D: 0.55 },
    vanity_cabinet:  { W: 0.60, H: 0.85, D: 0.45 },
  }
  const { W, H, D } = dims[furnitureType] || dims.drawer_cabinet
  const T = 0.018

  const darkCol = new THREE.Color(col).multiplyScalar(0.80).getStyle()
  const addMesh = (m, x, y, z) => { m.position.set(x, y, z); g.add(m) }

  // box shell
  addMesh(box(T, H, D, matId, col), -W / 2 + T / 2, H / 2, 0)       // left
  addMesh(box(T, H, D, matId, col),  W / 2 - T / 2, H / 2, 0)       // right
  addMesh(box(W, T, D, matId, col), 0, H - T / 2, 0)                  // top
  addMesh(box(W, T, D, matId, col), 0, T / 2, 0)                      // bottom
  addMesh(box(W - 2 * T, H - 2 * T, 0.01, matId, darkCol), 0, H / 2, -D / 2 + 0.005) // back

  const handleMat = new THREE.MeshStandardMaterial({ color: 0x8B7355, roughness: 0.3, metalness: 0.7 })

  const isDrawers = furnitureType === 'drawer_cabinet' ||
                    shapeId.includes('drawer') ||
                    (furnitureType === 'nightstand' && !shapeId.includes('door'))

  if (isDrawers) {
    const nDrawers = shapeId === '7_drawers' ? 7 : shapeId === '5_drawers' ? 5 : shapeId === '3_drawers' ? 3 : furnitureType === 'nightstand' ? 2 : 3
    const dH = (H - 2 * T - 0.02 * (nDrawers - 1)) / nDrawers
    for (let i = 0; i < nDrawers; i++) {
      const y = T + i * (dH + 0.02) + dH / 2
      addMesh(box(W - 2 * T - 0.01, dH - 0.01, 0.018, matId, col), 0, y, D / 2 + 0.009)
      // handle
      const h = new THREE.Mesh(new THREE.BoxGeometry(W * 0.3, 0.012, 0.015), handleMat)
      h.position.set(0, y, D / 2 + 0.024)
      g.add(h)
    }
  } else {
    // doors
    const nDoors = shapeId.includes('4door') || shapeId.includes('4_door') ? 4 : 2
    const dW = (W - 2 * T - 0.01 * (nDoors - 1)) / nDoors
    for (let i = 0; i < nDoors; i++) {
      const x = -W / 2 + T + i * (dW + 0.01) + dW / 2 + 0.005
      addMesh(box(dW - 0.01, H - 2 * T - 0.02, 0.018, matId, col), x, H / 2, D / 2 + 0.009)
      const h = cylinder(0.005, 0.005, 0.05, 'metal', '#8B7355', 8)
      h.rotation.z = Math.PI / 2
      h.position.set(i < nDoors / 2 ? x + dW * 0.35 : x - dW * 0.35, H / 2, D / 2 + 0.025)
      g.add(h)
    }
  }

  // vanity mirror
  if (furnitureType === 'vanity_cabinet' && shapeId === 'with_mirror') {
    const mirrorFrame = box(W * 0.7, 0.55, 0.025, 'laminate', '#1C1C1C')
    mirrorFrame.position.set(0, H + 0.285, -(D / 2) + 0.025)
    g.add(mirrorFrame)
    const mirror = box(W * 0.68, 0.53, 0.005, 'glass', '#C8D8E8')
    mirror.position.set(0, H + 0.285, -(D / 2) + 0.038)
    g.add(mirror)
  }

  // legs/feet
  const footH = 0.06, footOff = 0.05
  for (const [sx, sz] of [[-1,-1],[-1,1],[1,-1],[1,1]]) {
    const foot = box(0.04, footH, 0.04, matId, col)
    foot.position.set(sx * (W / 2 - footOff), footH / 2, sz * (D / 2 - footOff))
    g.add(foot)
  }

  return g
}

// ─── BED FRAME ────────────────────────────────────────────────────────────────
function buildBedFrame(cfg) {
  const g = new THREE.Group()
  const shapeId   = cfg.shape?.id || 'double'
  const matId     = cfg.material?.id || 'solid_wood'
  const col       = cfg.color?.hex || '#C8A87A'
  const headStyle = cfg.headboard?.id || 'panel'

  const sizes = { single: 1.02, double: 1.42, queen: 1.62, king: 1.92 }
  const W = sizes[shapeId] || 1.42, D = 2.05
  const T = 0.05, railH = 0.25, legH = 0.28, slatsY = legH + railH / 2

  const addMesh = (m, x, y, z) => { m.position.set(x, y, z); g.add(m) }

  // legs
  for (const [sx, sz] of [[-1,-1],[-1,1],[1,-1],[1,1]]) {
    addMesh(box(0.07, legH, 0.07, matId, col), sx * (W / 2 - 0.04), legH / 2, sz * (D / 2 - 0.04))
  }
  // side rails
  addMesh(box(W, railH, T, matId, col), 0, slatsY, -D / 2 + T / 2)
  addMesh(box(W, railH, T, matId, col), 0, slatsY,  D / 2 - T / 2)
  addMesh(box(T, railH, D, matId, col), -W / 2 + T / 2, slatsY, 0)
  addMesh(box(T, railH, D, matId, col),  W / 2 - T / 2, slatsY, 0)

  // slats
  const nSlats = 10
  for (let i = 0; i < nSlats; i++) {
    const z = -D / 2 + 0.18 + i * ((D - 0.36) / (nSlats - 1))
    addMesh(box(W - 2 * T, 0.04, 0.08, matId, col), 0, legH + railH + 0.02, z)
  }

  // headboard
  const hbW = W - 0.04
  if (headStyle === 'slatted') {
    const nSlat = 5, slatW = hbW / nSlat - 0.03
    for (let i = 0; i < nSlat; i++) {
      const x = -hbW / 2 + slatW / 2 + i * (slatW + 0.03)
      addMesh(box(slatW, 0.75, 0.06, matId, col), x, legH + railH + 0.375, -D / 2 + 0.03)
    }
  } else if (headStyle === 'upholstered') {
    const hbMat = cfg.color?.hex ? mat('cotton_linen', col) : mat('cotton_linen', '#D4B896')
    const hb = new THREE.Mesh(new THREE.BoxGeometry(hbW, 0.80, 0.12), hbMat)
    hb.position.set(0, legH + railH + 0.40, -D / 2 + 0.06)
    hb.castShadow = true
    g.add(hb)
  } else if (headStyle === 'arched') {
    // main panel
    addMesh(box(hbW, 0.72, 0.07, matId, col), 0, legH + railH + 0.36, -D / 2 + 0.035)
    // arch top (half cylinder)
    const arch = cylinder(hbW / 2.5, hbW / 2.5, 0.07, matId, col, 32)
    arch.rotation.z = Math.PI / 2
    arch.scale.y = 0.5
    arch.position.set(0, legH + railH + 0.72 + hbW / 5, -D / 2 + 0.035)
    g.add(arch)
  } else {
    // flat panel (default)
    addMesh(box(hbW, 0.70, 0.07, matId, col), 0, legH + railH + 0.35, -D / 2 + 0.035)
  }

  // footboard (shorter)
  addMesh(box(hbW, 0.35, 0.06, matId, col), 0, legH + railH + 0.175, D / 2 - 0.03)

  return g
}

// ─── WARDROBE ─────────────────────────────────────────────────────────────────
function buildWardrobe(cfg) {
  const g = new THREE.Group()
  const shapeId = cfg.shape?.id || '2_door_hinged'
  const matId   = cfg.material?.id || 'laminate'
  const col     = cfg.color?.hex || '#F5F0E8'
  const darkCol = new THREE.Color(col).multiplyScalar(0.78).getStyle()
  const T = 0.022

  const W = shapeId.startsWith('4') ? 1.65 : shapeId.includes('3') ? 1.45 : 1.20
  const H = 2.05, D = 0.60
  const addMesh = (m, x, y, z) => { m.position.set(x, y, z); g.add(m) }

  // carcass
  addMesh(box(T, H, D, matId, col), -W / 2 + T / 2, H / 2, 0)
  addMesh(box(T, H, D, matId, col),  W / 2 - T / 2, H / 2, 0)
  addMesh(box(W, T, D, matId, col), 0, H - T / 2, 0)
  addMesh(box(W, T, D, matId, col), 0, T / 2, 0)
  addMesh(box(W - 2 * T, H - 2 * T, 0.01, matId, darkCol), 0, H / 2, -D / 2 + 0.005)
  // middle shelf
  addMesh(box(W - 2 * T, T, D - 0.02, matId, col), 0, H * 0.42, 0)

  const nDoors = shapeId.startsWith('4') ? 4 : 3
  const dW = (W - 2 * T - 0.01 * (nDoors - 1)) / nDoors
  const isMirrored = shapeId === 'mirrored'
  const handleMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.3, metalness: 0.7 })

  for (let i = 0; i < nDoors; i++) {
    const x = -W / 2 + T + i * (dW + 0.01) + dW / 2 + 0.005
    const doorColor = isMirrored ? '#A8C4D8' : col
    const doorMatId = isMirrored ? 'glass' : matId
    const door = box(dW - 0.008, H - 2 * T - 0.01, 0.020, doorMatId, doorColor)
    door.position.set(x, H / 2, D / 2 + 0.010)
    door.castShadow = true
    g.add(door)
    // handle
    const h = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.10, 0.012), handleMat)
    h.position.set(i < nDoors / 2 ? x + dW * 0.38 : x - dW * 0.38, H / 2, D / 2 + 0.026)
    g.add(h)
  }

  // feet
  for (const [sx, sz] of [[-1,-1],[-1,1],[1,-1],[1,1]]) {
    addMesh(box(0.05, 0.07, 0.05, matId, col), sx * (W / 2 - 0.04), 0.035, sz * (D / 2 - 0.04))
  }
  return g
}

// ─── COUNTER ──────────────────────────────────────────────────────────────────
function buildCounter(cfg) {
  const g = new THREE.Group()
  const shapeId  = cfg.shape?.id || 'straight'
  const topMatId = cfg.countertop?.id || 'laminate'
  const col      = cfg.color?.hex || '#F5F0E8'
  const topCol   = topMatId === 'marble' ? '#F0EDE8'
                 : topMatId === 'granite' ? '#5A5A5A'
                 : topMatId === 'solid_wood' ? '#C8A87A'
                 : '#F5F0F5'
  const T = 0.018, H = 0.88, D = 0.62, topT = 0.04

  const drawSegment = (W, ox, oz) => {
    const add = (m, x, y, z) => { m.position.set(ox + x, y, oz + z); g.add(m) }
    const dark = new THREE.Color(col).multiplyScalar(0.78).getStyle()
    // box shell
    add(box(T, H, D, 'laminate', col),  -W / 2 + T / 2, H / 2, 0)
    add(box(T, H, D, 'laminate', col),   W / 2 - T / 2, H / 2, 0)
    add(box(W, T, D, 'laminate', col),  0, T / 2, 0)
    add(box(W - 2 * T, H - T, 0.01, 'laminate', dark), 0, H / 2, -D / 2 + 0.005)
    // 2 doors
    const dW = (W - 2 * T - 0.01) / 2
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.3, metalness: 0.7 })
    for (let i = 0; i < 2; i++) {
      const x = -W / 2 + T + i * (dW + 0.01) + dW / 2 + 0.005
      const door = box(dW - 0.008, H - 2 * T - 0.01, 0.020, 'laminate', col)
      door.position.set(ox + x, H / 2, oz + D / 2 + 0.010)
      door.castShadow = true
      g.add(door)
      const h = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.09, 0.012), handleMat)
      h.position.set(ox + x + (i === 0 ? dW * 0.36 : -dW * 0.36), H / 2 + 0.02, oz + D / 2 + 0.026)
      g.add(h)
    }
    // countertop
    add(box(W + 0.04, topT, D + 0.04, topMatId, topCol), 0, H + topT / 2, 0)
    // backsplash
    add(box(W + 0.04, 0.13, 0.018, topMatId, topCol), 0, H + topT + 0.065, -D / 2 - 0.009)
  }

  if (shapeId === 'l_shape') {
    drawSegment(1.8, 0, 0)
    drawSegment(0.9, -1.8 / 2 - 0.9 / 2, -(D + 0.02))
  } else if (shapeId === 'u_shape') {
    drawSegment(1.8, 0, 0)
    drawSegment(0.9, -1.8 / 2 - 0.9 / 2, -(D + 0.02))
    drawSegment(0.9,  1.8 / 2 + 0.9 / 2, -(D + 0.02))
  } else if (shapeId === 'island') {
    drawSegment(1.4, 0, 0)
    // island has countertop on all sides
    const topOver = box(1.44 + 0.04, topT, D + 0.3, topMatId, topCol)
    topOver.position.set(0, H + topT / 2, 0)
    g.add(topOver)
  } else {
    drawSegment(1.8, 0, 0)
  }
  return g
}

// ─── STOOL ─────────────────────────────────────────────────────────────────
function buildStool(cfg) {
  const g = new THREE.Group()
  const shapeId  = cfg.shape?.id || 'round_backless'
  const matId    = cfg.material?.id || 'metal'
  const col      = cfg.color?.hex || '#A8A8A8'
  const fabricId = cfg.fabric?.id || 'none'
  const fabCol   = '#D4B896'

  const H = 0.68, seatR = 0.20
  const addMesh = (m, x, y, z) => { m.position.set(x, y, z); g.add(m) }

  const isRound = !shapeId.includes('square') && !shapeId.includes('saddle')

  // seat
  if (isRound || shapeId === 'saddle') {
    const seat = cylinder(seatR, seatR * 1.05, 0.05, matId, col, 32)
    seat.position.set(0, H, 0)
    g.add(seat)
    if (fabricId !== 'none') {
      const cushion = cylinder(seatR - 0.02, seatR - 0.01, 0.04, fabricId, fabCol, 32)
      cushion.position.set(0, H + 0.04, 0)
      g.add(cushion)
    }
    if (shapeId === 'saddle') {
      // saddle dip - add a slightly different shape on top
      const saddle = cylinder(seatR * 0.9, seatR * 0.9, 0.06, fabricId || matId, fabCol, 32)
      saddle.scale.x = 0.7
      saddle.position.set(0, H + 0.025, 0)
      g.add(saddle)
    }
  } else {
    addMesh(box(0.42, 0.05, 0.42, matId, col), 0, H, 0)
    if (fabricId !== 'none') {
      addMesh(box(0.40, 0.04, 0.40, fabricId, fabCol), 0, H + 0.04, 0)
    }
  }

  // legs (4 angled)
  const lOffset = seatR * 0.8
  for (const [sx, sz] of [[-1,-1],[-1,1],[1,-1],[1,1]]) {
    const leg = cylinder(0.013, 0.016, H, matId, col, 8)
    leg.position.set(sx * lOffset, H / 2, sz * lOffset)
    leg.rotation.z = sx * sz * 0.08
    g.add(leg)
  }

  // cross brace
  addMesh(box(seatR * 1.4, 0.015, 0.015, matId, col), 0, H * 0.35, 0)
  addMesh(box(0.015, 0.015, seatR * 1.4, matId, col), 0, H * 0.35, 0)

  // optional backrest
  if (shapeId === 'round_backed') {
    addMesh(box(0.40, 0.30, 0.04, matId, col), 0, H + 0.20, -seatR - 0.02)
  }
  return g
}

// ─── OFFICE CHAIR ────────────────────────────────────────────────────────────
function buildOfficeChair(cfg) {
  const g = new THREE.Group()
  const shapeId  = cfg.shape?.id || 'task'
  const matId    = cfg.material?.id || 'mesh'
  const col      = cfg.color?.hex || '#1C1C1C'
  const baseMat  = mat('metal', '#2A2A2A')
  const wheelMat = mat('metal', '#1A1A1A')

  const seatH = 0.48, backH = shapeId === 'executive' ? 0.75 : shapeId === 'gaming' ? 0.80 : 0.60

  const addMesh = (m, x, y, z) => { m.position.set(x, y, z); g.add(m) }

  // seat
  const seat = box(0.52, 0.10, 0.52, matId, col)
  seat.position.set(0, seatH, 0)
  seat.castShadow = true
  g.add(seat)

  // backrest
  const back = box(0.50, backH, 0.09, matId, col)
  back.position.set(0, seatH + backH / 2, -0.22)
  back.rotation.x = -0.15
  back.castShadow = true
  g.add(back)

  // gaming / executive additions
  if (shapeId === 'gaming') {
    // wings on backrest
    for (const sx of [-1, 1]) {
      const wing = box(0.08, backH * 0.6, 0.05, matId, col)
      wing.position.set(sx * 0.265, seatH + backH * 0.4, -0.22)
      wing.rotation.x = -0.15
      g.add(wing)
    }
    // headrest
    addMesh(box(0.26, 0.20, 0.09, matId, col), 0, seatH + backH + 0.1, -0.22)
  }

  // armrests
  for (const sx of [-1, 1]) {
    addMesh(box(0.06, 0.20, 0.04, 'metal', '#3A3A3A'), sx * 0.28, seatH + 0.12, 0)    // vertical
    addMesh(box(0.06, 0.04, 0.26, matId, col),          sx * 0.28, seatH + 0.22, 0.03) // pad
  }

  // pneumatic column
  const col2 = cylinder(0.035, 0.045, 0.30, 'metal', '#4A4A4A', 12)
  col2.position.set(0, seatH / 2, 0)
  g.add(col2)

  // star base (5 arms)
  for (let i = 0; i < 5; i++) {
    const arm = box(0.03, 0.04, 0.42, 'metal', '#2A2A2A')
    arm.rotation.y = (i * Math.PI * 2) / 5
    arm.position.set(0, 0.02, 0)
    arm.castShadow = true
    g.add(arm)
    // caster wheel
    const angle = (i * Math.PI * 2) / 5
    const wx = Math.sin(angle) * 0.2
    const wz = Math.cos(angle) * 0.2
    const wheel = cylinder(0.04, 0.04, 0.04, 'metal', '#1A1A1A', 12)
    wheel.rotation.z = Math.PI / 2
    wheel.position.set(wx, 0.02, wz)
    g.add(wheel)
  }

  return g
}

// ─── SINK ─────────────────────────────────────────────────────────────────────
function buildSink(cfg) {
  const g = new THREE.Group()
  const shapeId = cfg.shape?.id || 'undermount_rect'
  const matId   = cfg.material?.id || 'ceramic'
  const col     = cfg.color?.hex || '#FFFFFF'
  const faucetMat = mat('metal', '#C0C0C0')

  const W = 0.65, H = 0.88, D = 0.52, T = 0.015, topT = 0.045

  const addMesh = (m, x, y, z) => { m.position.set(x, y, z); g.add(m) }

  const isVessel = shapeId === 'vessel_round' || shapeId === 'vessel_square'
  const isPedestal = shapeId === 'pedestal'

  if (!isVessel) {
    // vanity base (cabinet below)
    const baseCol = new THREE.Color(col).multiplyScalar(0.88).getStyle()
    addMesh(box(T, H, D, 'laminate', baseCol), -W / 2 + T / 2, H / 2, 0)
    addMesh(box(T, H, D, 'laminate', baseCol),  W / 2 - T / 2, H / 2, 0)
    addMesh(box(W, T, D, 'laminate', baseCol), 0, H - T / 2, 0)
    addMesh(box(W, T, D, 'laminate', baseCol), 0, T / 2, 0)
    const dark = new THREE.Color(baseCol).multiplyScalar(0.80).getStyle()
    addMesh(box(W - 2 * T, H - 2 * T, 0.01, 'laminate', dark), 0, H / 2, -D / 2 + 0.005)
    // door
    addMesh(box(W - 2 * T - 0.01, H - 2 * T - 0.01, 0.018, 'laminate', baseCol), 0, H / 2, D / 2 + 0.009)
    // counter surround
    addMesh(box(W + 0.04, topT, D + 0.04, matId, col), 0, H + topT / 2, 0)
  }

  if (isPedestal) {
    // pedestal column
    const ped = cylinder(0.10, 0.14, H * 0.75, matId, col, 16)
    ped.position.set(0, H * 0.375, 0)
    g.add(ped)
    // basin on pedestal
    addMesh(box(W, topT, D, matId, col), 0, H, 0)
  }

  // basin
  const basinY = isVessel ? H + topT + 0.04 : H + topT
  if (shapeId === 'vessel_round') {
    const basin = cylinder(0.22, 0.24, 0.13, matId, col, 32)
    basin.position.set(0, basinY + 0.065, 0)
    g.add(basin)
    const inner = cylinder(0.20, 0.22, 0.11, matId, new THREE.Color(col).multiplyScalar(0.92).getStyle(), 32)
    inner.position.set(0, basinY + 0.065, 0)
    g.add(inner)
  } else {
    const bW = shapeId === 'vessel_square' ? 0.40 : W * 0.72
    const bD = shapeId === 'vessel_square' ? 0.40 : D * 0.72
    const depth = 0.14
    // outer basin rim
    addMesh(box(bW, depth, bD, matId, col), 0, basinY + depth / 2, 0)
    // inner (lighter)
    const innerCol = new THREE.Color(col).multiplyScalar(0.93).getStyle()
    addMesh(box(bW - 2 * T * 2, depth - T, bD - 2 * T * 2, matId, innerCol), 0, basinY + (depth - T) / 2 + T, 0)

    if (isVessel) {
      // base plate for vessel
      addMesh(box(bW + 0.04, topT, bD + 0.04, matId, col), 0, H + topT / 2, 0)
    }
  }

  // faucet
  const fY = H + topT + 0.12
  const fZ = -(D / 2) * 0.55
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.018, 0.14, 12), faucetMat)
  post.position.set(0, fY, fZ)
  g.add(post)
  const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.010, 0.010, 0.14, 12), faucetMat)
  spout.rotation.x = Math.PI / 2
  spout.position.set(0, fY + 0.07, fZ + 0.07)
  g.add(spout)
  // handles
  for (const sx of [-1, 1]) {
    const h = new THREE.Mesh(new THREE.CylinderGeometry(0.010, 0.010, 0.07, 8), faucetMat)
    h.rotation.z = Math.PI / 2
    h.position.set(sx * 0.07, fY + 0.01, fZ)
    g.add(h)
  }
  // drain
  const drain = cylinder(0.025, 0.025, 0.008, 'metal', '#888888', 12)
  drain.position.set(0, basinY + 0.008, 0)
  g.add(drain)

  return g
}

// ─── rebuild + fit camera ────────────────────────────────────────────────────
function fitCamera(group) {
  const box3 = new THREE.Box3().setFromObject(group)
  const size = box3.getSize(new THREE.Vector3())
  const center = box3.getCenter(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z)
  const fovRad = camera.fov * (Math.PI / 180)
  const dist = (maxDim / 2) / Math.tan(fovRad / 2) * 2.0

  camera.position.set(
    center.x + dist * 0.70,
    center.y + dist * 0.55,
    center.z + dist * 0.85,
  )
  controls.target.copy(center)
  controls.minDistance = dist * 0.4
  controls.maxDistance = dist * 4
  controls.update()
}

function rebuildModel() {
  if (currentGroup) { scene.remove(currentGroup); currentGroup = null }
  if (!props.skeletonType) return

  const group = buildModel(props.skeletonType, props.furnitureType, props.configuration)
  if (!group) return

  // sit on floor
  const b = new THREE.Box3().setFromObject(group)
  group.position.y -= b.min.y
  scene.add(group)
  currentGroup = group
  fitCamera(group)
}

// ─── lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
  init()
  rebuildModel()
  loading.value = false
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', onResize)
  renderer?.dispose()
  controls?.dispose()
})

watch(
  () => [props.skeletonType, props.furnitureType, props.configuration],
  rebuildModel,
  { deep: true }
)

// ─── public API ───────────────────────────────────────────────────────────────
const captureScreenshot = () => {
  renderer.render(scene, camera)
  return renderer.domElement.toDataURL('image/png')
}

defineExpose({ captureScreenshot })
</script>

<style scoped>
.fv-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 420px;
  border-radius: 12px;
  overflow: hidden;
  background: #F5F0E8;
}

.fv-wrap canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}

.fv-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #F5F0E8;
  z-index: 10;
  font-family: 'Times New Roman', serif;
  color: #8B7355;
  font-size: 0.9rem;
}

.fv-spinner {
  width: 32px;
  height: 32px;
  border: 2px solid #e0d8cc;
  border-top-color: #c4a882;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.fv-hint {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(44, 34, 24, 0.5);
  color: #f0ebe2;
  font-size: 0.72rem;
  padding: 4px 12px;
  border-radius: 20px;
  pointer-events: none;
  white-space: nowrap;
  letter-spacing: 0.03em;
}
</style>
