import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ms from './locales/ms.json'
import zh from './locales/zh.json'

const savedLocale = localStorage.getItem('locale') || 'en'

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: { en, ms, zh },
})
