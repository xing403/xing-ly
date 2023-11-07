import Components from '@/packages/components'

export const install = (app: any) => {
  Components.forEach((component)=>{
    app.component(component.name, component);
  })
}

export default {
  install
}
