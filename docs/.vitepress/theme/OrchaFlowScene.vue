<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useData } from 'vitepress'

interface Pill {
  x: number
  y: number
  h: number
  color: string
}

const STAGE_W = 420
const STAGE_H = 280
const PILL_W = 48
const TICK_MS = 5000
const PORTS = [24, 80, 128, 188, 236, 284, 332, 396]
const POSES: Pill[][] = [
  [
    { x: 56, y: 70, h: 140, color: 'var(--orcha-idle)' },
    { x: 140, y: 70, h: 140, color: 'var(--orcha-idle)' },
    { x: 224, y: 70, h: 140, color: 'var(--orcha-idle)' },
    { x: 308, y: 70, h: 140, color: 'var(--orcha-idle)' },
  ],
  [
    { x: 56, y: 56, h: 168, color: 'var(--orcha-node-1)' },
    { x: 140, y: 35, h: 210, color: 'var(--orcha-node-2)' },
    { x: 224, y: 75, h: 130, color: 'var(--orcha-node-3)' },
    { x: 308, y: 50, h: 180, color: 'var(--orcha-node-4)' },
  ],
  [
    { x: 48, y: 28, h: 224, color: 'var(--orcha-node-1)' },
    { x: 132, y: 90, h: 100, color: 'var(--orcha-warning)' },
    { x: 228, y: 48, h: 184, color: 'var(--orcha-node-2)' },
    { x: 316, y: 80, h: 120, color: 'var(--orcha-accent)' },
  ],
  [
    { x: 56, y: 60, h: 160, color: 'var(--orcha-success)' },
    { x: 140, y: 55, h: 170, color: 'var(--orcha-accent-strong)' },
    { x: 224, y: 62, h: 156, color: 'var(--orcha-node-3)' },
    { x: 308, y: 58, h: 164, color: 'var(--orcha-node-4)' },
  ],
]

const { lang } = useData()
const zh = computed(() => lang.value.startsWith('zh'))
const reduced = ref(false)
const poseIndex = ref(1)
const live = ref<Pill[]>(clonePose(1))
const dragIndex = ref<number | null>(null)
const stage = ref<HTMLElement | null>(null)

const hint = computed(() => (
  zh.value
    ? '可拖拽节点试试。到点会自动回到当前状态。'
    : 'Drag the nodes. They snap back on the next beat.'
))

let timer = 0
let origin = { x: 0, y: 0, px: 0, py: 0 }

function clonePose(index: number): Pill[] {
  return POSES[index].map(pill => ({ ...pill }))
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function pillStyle(pill: Pill): Record<string, string> {
  return {
    left: `${(pill.x / STAGE_W) * 100}%`,
    top: `${(pill.y / STAGE_H) * 100}%`,
    width: `${(PILL_W / STAGE_W) * 100}%`,
    height: `${(pill.h / STAGE_H) * 100}%`,
    backgroundColor: pill.color,
  }
}

function applyPose(index: number): void {
  poseIndex.value = index
  live.value = clonePose(index)
}

function advance(): void {
  dragIndex.value = null
  applyPose((poseIndex.value + 1) % POSES.length)
}

function schedule(): void {
  window.clearInterval(timer)
  if (reduced.value) {
    return
  }
  timer = window.setInterval(advance, TICK_MS)
}

function jump(index: number): void {
  dragIndex.value = null
  applyPose(index)
  schedule()
}

function toLocal(event: PointerEvent): { x: number, y: number } {
  const rect = stage.value!.getBoundingClientRect()
  return {
    x: ((event.clientX - rect.left) / rect.width) * STAGE_W,
    y: ((event.clientY - rect.top) / rect.height) * STAGE_H,
  }
}

function onPointerDown(index: number, event: PointerEvent): void {
  const target = event.currentTarget as HTMLElement
  try {
    target.setPointerCapture(event.pointerId)
  }
  catch {
    // 合成事件或不支持 capture 时仍可拖拽
  }
  event.preventDefault()
  dragIndex.value = index
  const local = toLocal(event)
  origin = {
    x: live.value[index].x,
    y: live.value[index].y,
    px: local.x,
    py: local.y,
  }
}

function onPointerMove(event: PointerEvent): void {
  if (dragIndex.value === null || !stage.value) {
    return
  }
  const index = dragIndex.value
  const local = toLocal(event)
  const node = live.value[index]
  node.x = clamp(origin.x + local.x - origin.px, 8, STAGE_W - PILL_W - 8)
  node.y = clamp(origin.y + local.y - origin.py, 8, STAGE_H - node.h - 8)
}

function onPointerUp(): void {
  dragIndex.value = null
}

onMounted(() => {
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced.value) {
    applyPose(1)
    return
  }
  schedule()
})

onUnmounted(() => {
  window.clearInterval(timer)
})
</script>

<template>
  <div class="orcha-flow-mark">
    <div
      ref="stage"
      class="orcha-flow-mark__stage"
      role="img"
      :aria-label="hint"
    >
      <svg
        class="orcha-flow-mark__guide"
        viewBox="0 0 420 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="24" y="139" width="372" height="2" rx="1" fill="currentColor" />
        <circle
          v-for="x in PORTS"
          :key="x"
          :cx="x"
          cy="140"
          r="6"
          fill="#fff"
          stroke="var(--orcha-port)"
          stroke-width="2"
        />
        <circle v-if="reduced" cx="236" cy="140" r="3.5" fill="var(--orcha-brand)" />
        <circle v-else r="3.5" fill="var(--orcha-brand)">
          <animateMotion dur="3.6s" repeatCount="indefinite" path="M24 140 H396" />
        </circle>
      </svg>
      <div
        v-for="(pill, index) in live"
        :key="index"
        class="orcha-flow-pill"
        :class="{ 'is-dragging': dragIndex === index }"
        :style="pillStyle(pill)"
        @pointerdown="onPointerDown(index, $event)"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      />
    </div>
    <div class="orcha-flow-mark__dots" role="tablist" :aria-label="zh ? '演示状态' : 'Demo states'">
      <button
        v-for="(_, index) in POSES"
        :key="index"
        type="button"
        class="orcha-flow-mark__dot"
        :class="{ 'is-active': poseIndex === index }"
        :aria-label="`${zh ? '状态' : 'State'} ${index + 1}`"
        :aria-selected="poseIndex === index"
        @click="jump(index)"
      />
    </div>
    <p class="orcha-flow-mark__hint">{{ hint }}</p>
  </div>
</template>
