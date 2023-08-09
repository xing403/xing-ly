import XlCanvasImage from './components/xlCanvasImage/index.vue'

export {
  XlCanvasImage
}

export default {
  install: function (app: any) {
    app.component('xl-canvas-image', XlCanvasImage);
  }
}
