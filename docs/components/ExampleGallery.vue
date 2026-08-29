<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData } from 'vitepress'
import DemoPreview from './DemoPreview.vue'

const { lang } = useData()
const zh = computed(() => lang.value.startsWith('zh'))
const open = ref(false)

const copy = computed(() => (
  zh.value
    ? {
        open: '打开示例',
        back: '返回示例',
        hint: '从左侧拖节点，点选后改属性，可导入 / 导出 JSON。',
        studioTitle: '请假审批',
        cards: [
          {
            id: 'leave',
            title: '请假审批',
            desc: '开始 → 填写申请 → 是否超过 3 天 → 通过或驳回。用来看连线、条件分支和属性面板。',
            tags: ['内置节点', '条件分支'],
          },
          {
            id: 'approval',
            title: '自定义审批节点',
            desc: '同一个画布里挂了 defineNodeType 的「审批」节点，可从左侧「扩展」拖进去。',
            tags: ['defineNodeType', '扩展物料'],
          },
        ],
      }
    : {
        open: 'Open example',
        back: 'Back to examples',
        hint: 'Drag nodes from the left, edit properties, import or export JSON.',
        studioTitle: 'Leave approval',
        cards: [
          {
            id: 'leave',
            title: 'Leave approval',
            desc: 'Start → fill request → more than 3 days? → approve or reject. Shows edges, branches, and the property panel.',
            tags: ['Built-in nodes', 'Condition'],
          },
          {
            id: 'approval',
            title: 'Custom approval node',
            desc: 'The same canvas registers an Approval node via defineNodeType. Drag it from the Extension group.',
            tags: ['defineNodeType', 'Materials'],
          },
        ],
      }
))

function openStudio(): void {
  open.value = true
}

function closeStudio(): void {
  open.value = false
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && open.value) {
    closeStudio()
  }
}

watch(open, (value) => {
  document.body.style.overflow = value ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="example-gallery">
    <article
      v-for="card in copy.cards"
      :key="card.id"
      class="example-card"
    >
      <div class="example-card__preview" aria-hidden="true">
        <template v-if="card.id === 'leave'">
          <span class="mini-node mini-node--start">{{ zh ? '开始' : 'Start' }}</span>
          <span class="mini-edge" />
          <span class="mini-node mini-node--task">{{ zh ? '填写申请' : 'Request' }}</span>
          <span class="mini-edge" />
          <span class="mini-node mini-node--cond">{{ zh ? '条件' : 'If' }}</span>
          <span class="mini-edge" />
          <span class="mini-node mini-node--end">{{ zh ? '结束' : 'End' }}</span>
        </template>
        <template v-else>
          <span class="mini-node mini-node--task">{{ zh ? '任务' : 'Task' }}</span>
          <span class="mini-edge" />
          <span class="mini-node mini-node--approval">{{ zh ? '审批' : 'Approval' }}</span>
          <span class="mini-edge" />
          <span class="mini-node mini-node--end">{{ zh ? '结束' : 'End' }}</span>
        </template>
      </div>
      <h3 class="example-card__title">{{ card.title }}</h3>
      <p class="example-card__desc">{{ card.desc }}</p>
      <ul class="example-card__tags">
        <li v-for="tag in card.tags" :key="tag">{{ tag }}</li>
      </ul>
      <button type="button" class="example-card__open" @click="openStudio">
        {{ copy.open }}
      </button>
    </article>
  </div>

  <Teleport to="body">
    <div
      v-if="open"
      class="orcha-studio"
      role="dialog"
      aria-modal="true"
      :aria-label="copy.studioTitle"
    >
      <header class="orcha-studio__bar">
        <button type="button" class="orcha-studio__back" @click="closeStudio">
          {{ copy.back }}
        </button>
        <div class="orcha-studio__meta">
          <strong>{{ copy.studioTitle }}</strong>
          <span>{{ copy.hint }}</span>
        </div>
      </header>
      <div class="orcha-studio__body">
        <DemoPreview fill />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.example-gallery {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin: 1.5rem 0 2.5rem;
}

.example-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: linear-gradient(135deg, var(--vp-c-bg), var(--vp-c-bg-alt));
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
}

.example-card__preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  min-height: 72px;
  margin-bottom: 16px;
  padding: 14px 12px;
  overflow: hidden;
  background:
    radial-gradient(80% 80% at 0% 0%, var(--orcha-brand-soft), transparent 55%),
    var(--vp-c-bg-alt);
  border-radius: 14px;
}

.mini-node {
  padding: 6px 10px;
  color: var(--vp-c-text-1);
  font-weight: 650;
  font-size: 12px;
  white-space: nowrap;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.mini-node--start,
.mini-node--end {
  border-radius: 999px;
}

.mini-node--start {
  border-color: var(--orcha-success);
}

.mini-node--task {
  border-top: 3px solid var(--orcha-node-1);
}

.mini-node--cond {
  border-top: 3px solid var(--orcha-warning);
}

.mini-node--approval {
  border-top: 3px solid var(--orcha-accent-strong);
}

.mini-node--end {
  border-color: var(--orcha-danger);
}

.mini-edge {
  width: 18px;
  height: 2px;
  background: var(--vp-c-divider);
}

.example-card__title {
  margin: 0 0 8px;
  font-size: 18px;
}

.example-card__desc {
  margin: 0 0 12px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.65;
}

.example-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 16px;
  padding: 0;
  list-style: none;
}

.example-card__tags li {
  padding: 2px 8px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  background: var(--vp-c-bg-alt);
  border-radius: 999px;
}

.example-card__open {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  justify-content: center;
  height: 40px;
  padding: 0 16px;
  color: #fff;
  font: inherit;
  font-size: 14px;
  line-height: normal;
  background-image: var(--orcha-grad);
  border: none;
  border-radius: 999px;
  cursor: pointer;
}

.orcha-studio {
  position: fixed;
  inset: var(--vp-nav-height, 64px) 0 0;
  z-index: 70;
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg);
}

.orcha-studio__bar {
  display: flex;
  flex-shrink: 0;
  gap: 16px;
  align-items: center;
  min-height: 56px;
  padding: 8px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.orcha-studio__back {
  height: 36px;
  padding: 0 14px;
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 13px;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  cursor: pointer;
}

.orcha-studio__meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.orcha-studio__meta strong {
  font-size: 14px;
}

.orcha-studio__meta span {
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.orcha-studio__body {
  flex: 1;
  min-height: 0;
}

@media (width >= 768px) {
  .example-gallery {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
