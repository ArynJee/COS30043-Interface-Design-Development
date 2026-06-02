import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'ms', label: 'Melayu' },
  { code: 'zh', label: '中文' },
]

export function useLanguage() {
  const { locale } = useI18n()

  const currentLocale = computed(
    () => LOCALES.find((l) => l.code === locale.value) ?? LOCALES[0],
  )

  function setLocale(code) {
    locale.value = code
    localStorage.setItem('locale', code)
  }

  return { locale, LOCALES, currentLocale, setLocale }
}
