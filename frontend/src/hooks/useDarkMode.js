import { ref, watch } from 'vue'

const isDark = ref(false)

function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
}

const saved = localStorage.getItem('theme')
if (saved === 'dark') isDark.value = true
else if (!saved) isDark.value = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
applyTheme(isDark.value)

watch(isDark, (val) => {
  applyTheme(val)
  localStorage.setItem('theme', val ? 'dark' : 'light')
})

export function useDarkMode() {
  return {
    isDark,
    toggleDark: () => { isDark.value = !isDark.value },
  }
}
