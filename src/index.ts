import Components from '@/packages'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

const install = (app: any) => {
  app.use(ElementPlus)
  Components.map((component) => {
    app.component(component.name, component);
  })
}

export default {
  install
}
