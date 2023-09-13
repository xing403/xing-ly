import XlCanvasImage from '@/components/xl-canvas-image/index.vue'

export {
  XlCanvasImage
}

export default {
  install: function (app: any) {
    app.component('xl-canvas-image', XlCanvasImage);
  }
}
