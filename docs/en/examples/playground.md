---
title: Examples
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

onMounted(() => {
  router.go('/en/examples/')
})
</script>

Redirecting to [Examples](/en/examples/).
