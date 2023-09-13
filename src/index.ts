import XlCanvasImage from '@/components/xl-canvas-image/index.vue'
import XlGameMines from '@/components/xl-game-mines/index.vue'
export {
  XlCanvasImage
}

export default {
  install: function (app: any) {
    app.component('xl-canvas-image', XlCanvasImage);
    app.component('xl-game-mines', XlGameMines);
  }
}
