import { createFluentVue } from "fluent-vue"
import { bundle as ru } from "@i18n/ru"

export const i18n = createFluentVue({
  bundles: [ru]
})
