import XlCanvasImage from '@/packages/xl-canvas-image/index.vue'

export const Components = [
  XlCanvasImage
]

export default {
  install: function (app: any) {
    Components.forEach((component)=>{
      app.component(component.name, component);
    })
  }
}
