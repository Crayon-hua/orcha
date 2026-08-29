<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData } from 'vitepress'

type ThreeModule = typeof import('three')

interface GraphNode {
  kind: 'start' | 'task' | 'condition' | 'approval' | 'end'
  pos: [number, number, number]
}

const GRAPH_NODES: GraphNode[] = [
  { kind: 'start', pos: [-3.15, 0.35, 0] },
  { kind: 'task', pos: [-1.35, 0.5, 0.12] },
  { kind: 'condition', pos: [0.35, 0.28, 0] },
  { kind: 'approval', pos: [1.95, 1.2, 0.18] },
  { kind: 'task', pos: [1.9, -0.78, -0.08] },
  { kind: 'end', pos: [3.55, 1.15, 0] },
  { kind: 'end', pos: [3.5, -0.72, 0] },
]

const GRAPH_EDGES: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [2, 4],
  [3, 5],
  [4, 6],
]

const KIND_COLOR: Record<GraphNode['kind'], number> = {
  start: 0x10b981,
  task: 0x3b82f6,
  condition: 0xf59e0b,
  approval: 0x7c3aed,
  end: 0xef4444,
}

const host = ref<HTMLDivElement | null>(null)
const { isDark, lang } = useData()
const caption = computed(() => (
  lang.value.startsWith('zh') ? '编排流动 · Three.js' : 'Orchestration flow · Three.js'
))

let disposeScene: (() => void) | undefined
let bootGeneration = 0

onMounted(() => {
  void boot()
})

onUnmounted(() => {
  bootGeneration += 1
  disposeScene?.()
})

watch(isDark, () => {
  disposeScene?.()
  void boot()
})

async function boot(): Promise<void> {
  const el = host.value
  if (!el) {
    return
  }
  const generation = ++bootGeneration
  const THREE = await import('three')
  if (generation !== bootGeneration || host.value !== el) {
    return
  }
  disposeScene?.()
  disposeScene = createFlowScene(THREE, el, isDark.value)
}

function createFlowScene(
  THREE: ThreeModule,
  el: HTMLDivElement,
  dark: boolean,
): () => void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40)
  camera.position.set(0.4, 1.15, 7.4)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)
  el.append(renderer.domElement)

  scene.add(new THREE.AmbientLight(0xffffff, dark ? 0.55 : 0.72))
  const key = new THREE.DirectionalLight(0xffffff, dark ? 1.05 : 0.85)
  key.position.set(3.2, 5.2, 4.5)
  scene.add(key)
  const fill = new THREE.PointLight(0x60a5fa, dark ? 1.4 : 0.7, 18)
  fill.position.set(-2.4, 1.6, 2.2)
  scene.add(fill)

  const nodeGroup = new THREE.Group()
  const meshes: THREE.Mesh[] = []
  const materials: THREE.Material[] = []
  const geometries: THREE.BufferGeometry[] = []

  for (const node of GRAPH_NODES) {
    const color = KIND_COLOR[node.kind]
    const { mesh, geo, mat } = createNodeMesh(THREE, node.kind, color, dark)
    mesh.position.set(...node.pos)
    nodeGroup.add(mesh)
    meshes.push(mesh)
    materials.push(mat)
    geometries.push(geo)
  }
  scene.add(nodeGroup)

  const curves: THREE.QuadraticBezierCurve3[] = []
  const edgeColor = dark ? 0x93c5fd : 0x2563eb
  for (const [from, to] of GRAPH_EDGES) {
    const a = new THREE.Vector3(...GRAPH_NODES[from].pos)
    const b = new THREE.Vector3(...GRAPH_NODES[to].pos)
    const mid = a.clone().lerp(b, 0.5)
    mid.y += 0.35 + Math.abs(b.x - a.x) * 0.08
    mid.z += (from % 2 === 0 ? 0.28 : -0.22)
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b)
    curves.push(curve)
    const tube = new THREE.TubeGeometry(curve, 48, 0.018, 8, false)
    const tubeMat = new THREE.MeshStandardMaterial({
      color: edgeColor,
      transparent: true,
      opacity: dark ? 0.42 : 0.28,
      roughness: 0.35,
      metalness: 0.15,
      emissive: edgeColor,
      emissiveIntensity: dark ? 0.35 : 0.12,
    })
    nodeGroup.add(new THREE.Mesh(tube, tubeMat))
    geometries.push(tube)
    materials.push(tubeMat)
  }

  const particleGeo = new THREE.SphereGeometry(0.045, 12, 12)
  geometries.push(particleGeo)
  const particles: Array<{ mesh: THREE.Mesh; curve: THREE.QuadraticBezierCurve3; t: number; speed: number }> = []
  curves.forEach((curve, index) => {
    const count = 2
    for (let i = 0; i < count; i += 1) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: dark ? 0.95 : 0.85,
      })
      const mesh = new THREE.Mesh(particleGeo, mat)
      materials.push(mat)
      nodeGroup.add(mesh)
      particles.push({
        mesh,
        curve,
        t: (i / count + index * 0.13) % 1,
        speed: 0.18 + (index % 3) * 0.04,
      })
    }
  })

  const pointer = { x: 0, y: 0 }
  const onPointerMove = (event: PointerEvent): void => {
    const rect = el.getBoundingClientRect()
    pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
  }
  el.addEventListener('pointermove', onPointerMove)

  const resize = (): void => {
    const width = el.clientWidth || 1
    const height = el.clientHeight || 1
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
  }
  const observer = new ResizeObserver(resize)
  observer.observe(el)
  resize()

  const clock = new THREE.Clock()
  let frame = 0
  const tick = (): void => {
    const dt = Math.min(clock.getDelta(), 0.033)
    const t = clock.elapsedTime
    if (!reduced) {
      nodeGroup.rotation.y = THREE.MathUtils.lerp(nodeGroup.rotation.y, pointer.x * 0.18, 0.06)
      nodeGroup.rotation.x = THREE.MathUtils.lerp(nodeGroup.rotation.x, pointer.y * -0.1, 0.06)
      meshes.forEach((mesh, i) => {
        const pulse = 1 + Math.sin(t * 1.6 + i * 0.7) * 0.035
        mesh.scale.setScalar(pulse)
        mesh.position.y = GRAPH_NODES[i].pos[1] + Math.sin(t * 1.1 + i) * 0.04
      })
      particles.forEach((p) => {
        p.t = (p.t + p.speed * dt) % 1
        p.curve.getPoint(p.t, p.mesh.position)
        const scale = 0.7 + Math.sin(p.t * Math.PI) * 0.55
        p.mesh.scale.setScalar(scale)
      })
      camera.position.x = 0.4 + Math.sin(t * 0.18) * 0.15
      camera.lookAt(0.2, 0.25, 0)
    }
    renderer.render(scene, camera)
    frame = window.requestAnimationFrame(tick)
  }
  frame = window.requestAnimationFrame(tick)

  return () => {
    window.cancelAnimationFrame(frame)
    observer.disconnect()
    el.removeEventListener('pointermove', onPointerMove)
    renderer.dispose()
    renderer.domElement.remove()
    geometries.forEach((g) => g.dispose())
    materials.forEach((m) => m.dispose())
  }
}

function createNodeMesh(
  THREE: ThreeModule,
  kind: GraphNode['kind'],
  color: number,
  dark: boolean,
): { mesh: THREE.Mesh; geo: THREE.BufferGeometry; mat: THREE.MeshStandardMaterial } {
  let geo: THREE.BufferGeometry
  if (kind === 'start' || kind === 'end') {
    geo = new THREE.SphereGeometry(0.22, 28, 20)
  }
  else if (kind === 'condition') {
    geo = new THREE.OctahedronGeometry(0.28)
  }
  else {
    geo = new THREE.BoxGeometry(0.52, 0.32, 0.32)
  }
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.28,
    metalness: 0.22,
    emissive: color,
    emissiveIntensity: dark ? 0.45 : 0.18,
  })
  return { mesh: new THREE.Mesh(geo, mat), geo, mat }
}
</script>

<template>
  <div ref="host" class="orcha-flow-scene" aria-hidden="true">
    <p class="orcha-flow-scene__caption">{{ caption }}</p>
  </div>
</template>
