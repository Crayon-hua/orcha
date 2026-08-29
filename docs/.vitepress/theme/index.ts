import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import OrchaFlowScene from './OrchaFlowScene.vue'
import './style.css'

function redirectLegacyZhPath(): void {
  if (typeof window === 'undefined') {
    return
  }
  const { pathname, search, hash } = window.location
  const next = pathname.replace(/\/zh(\/|$)/, '/')
  if (next !== pathname) {
    window.location.replace(`${next}${search}${hash}`)
  }
}

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp() {
    redirectLegacyZhPath()
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(OrchaFlowScene),
    })
  },
}

export default theme
