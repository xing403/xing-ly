<script setup lang="ts">
import { ref, onMounted, watch, } from 'vue'
interface Point {
  x: number
  y: number
}
const props = defineProps({
  imageUrl: { // 图片路径
    type: String,
    default: ''
  },
  height: { // 定义图片展示的高度
    type: Number,
    default: 480
  },
  width: { // 定义图片展示的宽度
    type: Number,
    default: 854
  },
  showInfo: {
    type: Boolean,
    default: false
  },
  minLimitScale: {
    type: Number,
    default: 0.1
  }
})
const canvas = ref<HTMLCanvasElement>()
const img = ref()
const context = ref()
const canvasImage = ref<{
  imgPos: Point
  lastMousePos: Point
  dragging: boolean
  imgScale: number
  imgXAutoScale: number,
  imgYAutoScale: number,
}>({
  imgPos: { x: 0, y: 0 },      // 图片定位
  lastMousePos: { x: 0, y: 0 },   // 记录上次鼠标位置
  dragging: false,            // 是否正在拖拽
  imgScale: 1,              // 缩放比例
  imgXAutoScale: 0,            // 图片适应拉伸宽度
  imgYAutoScale: 0,            // 图片适应拉伸高度
})
const contextmenuStyle = ref({
  display: 'none',
  top: '0px',
  left: '0px'
})
function init() {
  canvasImage.value.imgScale = 1
  canvasImage.value.imgPos.x = 0
  canvasImage.value.imgPos.y = 0
  context.value = canvas.value?.getContext('2d')
  loadImg()
}
function loadImg() {
  if (!canvas.value)
    throw 'canvas is null or undefined'
  img.value = new Image()
  img.value.src = props.imageUrl
  img.value.onload = function () {
    if (!canvas.value)
      throw 'canvas is null or undefined'
    canvasImage.value.imgXAutoScale = canvas.value.width / img.value.width
    canvasImage.value.imgYAutoScale = canvas.value.height / img.value.height
    drawImage()
  }
}
function drawImage() {
  if (!canvas.value)
    throw 'canvas not defined'
  context.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  context.value.drawImage(
    img.value, // 规定要使用的图像、画布或视频。
    0, 0, // 开始剪切的 x 坐标位置。
    img.value.width,
    img.value.height, // 被剪切图像的高度。
    canvasImage.value.imgPos.x,
    canvasImage.value.imgPos.y, // 在画布上放置图像的x、y坐标位置。
    img.value.width * canvasImage.value.imgScale * canvasImage.value.imgXAutoScale,
    img.value.height * canvasImage.value.imgScale * canvasImage.value.imgYAutoScale // 要使用的图像的宽度、高度
  )
}
function mousemove(event: MouseEvent) {
  event.preventDefault()
  if (canvasImage.value.dragging) {
    const currentMousePos = windowToCanvas(event.clientX, event.clientY)
    canvasImage.value.imgPos.x += currentMousePos.x - canvasImage.value.lastMousePos.x
    canvasImage.value.imgPos.y += currentMousePos.y - canvasImage.value.lastMousePos.y
    canvasImage.value.lastMousePos = JSON.parse(JSON.stringify(currentMousePos))
    drawImage()
  }
}
function mousedown(event: MouseEvent) {
  event.preventDefault()
  contextmenuStyle.value.display = 'none'
  canvasImage.value.dragging = true
  canvasImage.value.lastMousePos = windowToCanvas(event.clientX, event.clientY)
}
function mouseup() {
  canvasImage.value.dragging = false
}
function mouseout() {
  canvasImage.value.dragging = false
}
function wheel(event: any) {
  event.preventDefault()
  // 参考点坐标
  var pos = windowToCanvas(event.clientX, event.clientY)

  const wheelDelta = event.wheelDelta ? event.wheelDelta : (event.deltaY * (-40))
  // 图片上次的参考
  var newPos = {
    x: Number(((pos.x - canvasImage.value.imgPos.x) / canvasImage.value.imgScale).toFixed(2)),
    y: Number(((pos.y - canvasImage.value.imgPos.y) / canvasImage.value.imgScale).toFixed(2))
  }
  if (wheelDelta > 0) {
    canvasImage.value.imgScale += 0.1
  } else {
    canvasImage.value.imgScale -= 0.1
    if (canvasImage.value.imgScale < props.minLimitScale) {
      canvasImage.value.imgScale = props.minLimitScale
    }
  }
  canvasImage.value.imgPos.x = (1 - canvasImage.value.imgScale) * newPos.x + (pos.x - newPos.x)
  canvasImage.value.imgPos.y = (1 - canvasImage.value.imgScale) * newPos.y + (pos.y - newPos.y)
  drawImage()
}
function windowToCanvas(x: number, y: number): Point {
  if (!canvas.value)
    throw 'canvas is null or undefined'
  var box = canvas.value?.getBoundingClientRect() as DOMRect
  return {
    x: x - box.left - (box.width - canvas.value.width) / 2,
    y: y - box.top - (box.height - canvas.value.height) / 2
  }
}

function contextmenu(event: MouseEvent) {
  event.preventDefault()
  contextmenuStyle.value.display = 'block'
  contextmenuStyle.value.top = `${event.clientY}px`
  contextmenuStyle.value.left = `${event.clientX}px`
}
function restoreScole() {
  init()
  contextmenuStyle.value.display = 'none'
}
watch(props, () => {
  init()
})
onMounted(() => {
  init()
})
</script>
<template>
  <div class="lx-canvas">
    <canvas ref="canvas" :width="width" :height="height" @mousedown="mousedown" @mousemove="mousemove"
      @mouseout="mouseout" @mouseup="mouseup" @wheel="wheel" @contextmenu="contextmenu" />
    <div class="canvas-info" v-if="showInfo">
      <table>
        <tr>
          <td>图片路径</td>
          <td>{{ imageUrl }}</td>
        </tr>
        <tr>
          <td>缩放比例</td>
          <td>{{ Number(canvasImage.imgScale).toFixed(2) }}</td>
        </tr>
        <tr>
          <td>最小限制缩放</td>
          <td>{{ Number(minLimitScale).toFixed(2) }}</td>
        </tr>
      </table>
    </div>
    <div class="context-menu" :style="contextmenuStyle">
      <div @click="restoreScole">还原缩放</div>
    </div>
  </div>
</template>
<style>
.lx-canvas {
  position: relative;
  display: flex;
  justify-content: space-between;
}

.lx-canvas .canvas-info {
  flex: 1;
}

.context-menu {
  position: fixed;
  background-color: #fff;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
}

.context-menu div:hover {
  background-color: #409eff;
  color: #fff;
}
</style>
