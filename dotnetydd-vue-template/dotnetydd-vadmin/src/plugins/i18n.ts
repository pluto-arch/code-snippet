import messages from '@intlify/unplugin-vue-i18n/messages'
import { useStorage } from '@vueuse/core'
import { App } from 'vue'
import { createI18n } from 'vue-i18n'


export type Lang  = 'zh' | 'en'

export default (app: App) => {
  const defaultLocale = useStorage('locale', 'zh-CN')
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: defaultLocale.value,
    fallbackLocale: "en",
    messages,
  })
  app.use(i18n)
}