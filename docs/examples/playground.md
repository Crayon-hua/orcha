---
title: 示例
---

<script setup>
import { onMounted } from 'vue'
import { useData, useRouter } from 'vitepress'

const { lang } = useData()
const router = useRouter()

onMounted(() => {
  router.go(lang.value.startsWith('zh') ? '/examples/' : '/en/examples/')
})
</script>

正在前往[示例](/examples/)。
