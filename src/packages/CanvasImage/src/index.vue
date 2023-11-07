<template>
  <div class="lx-canvas">
    <canvas ref="canvas" :width="width" :height="height" @mousedown="mousedown" @mousemove="mousemove"
      @mouseout="mouseout" @mouseup="mouseup" @wheel="wheel" @contextmenu="contextmenu" />
    <slot name="info" v-bind="info" />
    <div class="context-menu" :style="contextmenuStyle">
      <div @click="restoreScole">还原缩放</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, toRef, computed, onMounted, } from 'vue'

defineOptions({
  name: 'LxCanvasImage'
})

const emits = defineEmits(['mousedown', 'mousemove', 'imageLoaded', 'drawImage', 'mouseout', 'mouseup', 'wheel'])

const props = withDefaults(defineProps<{
  imageUrl: string
  auto?: boolean
  width?: number
  height?: number
  minScale?: number
  maxScale?: number
}>(), {
  auto: false,
  minScale: 0.1,
  maxScale: 10
})
const info = computed(() => {
  return {
    imageUrl: props.imageUrl,
    scale: canvasImage.value?.imgScale.toFixed(2),
    width: canvas.value?.width,
    height: canvas.value?.height,
    x: canvasImage.value?.imgPos.x.toFixed(2),
    y: canvasImage.value?.imgPos.y.toFixed(2),
  }
})
const canvas = ref<HTMLCanvasElement>()
const width = toRef(props, 'width')
const height = toRef(props, 'height')
const imageUrl = toRef(props, 'imageUrl')
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
  imgPos: { x: 0, y: 0 },
  lastMousePos: { x: 0, y: 0 },
  dragging: false,
  imgScale: 1,
  imgXAutoScale: 0,
  imgYAutoScale: 0,
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
  img.value.src = imageUrl.value
  img.value.onload = function () {
    if (!canvas.value)
      throw 'canvas is null or undefined'
    if (props.auto) {
      canvas.value.width = img.value.width
      canvas.value.height = img.value.height
    }
    canvasImage.value.imgXAutoScale = canvas.value.width / img.value.width
    canvasImage.value.imgYAutoScale = canvas.value.height / img.value.height
    drawImage()
    emits('imageLoaded')
  }
}
function drawImage() {
  if (!canvas.value)
    throw 'canvas not defined'
  context.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  context.value.drawImage(
    img.value,
    0, 0,
    img.value.width,
    img.value.height,
    canvasImage.value.imgPos.x,
    canvasImage.value.imgPos.y,
    img.value.width * canvasImage.value.imgScale * canvasImage.value.imgXAutoScale,
    img.value.height * canvasImage.value.imgScale * canvasImage.value.imgYAutoScale
  )
  emits('imageLoaded', {
    x: canvasImage.value.imgPos.x,
    y: canvasImage.value.imgPos.y,
    imgScale: canvasImage.value.imgScale,
    imgXAutoScale: canvasImage.value.imgXAutoScale,
    imgYAutoScale: canvasImage.value.imgYAutoScale
  })
}
function mousemove(event: MouseEvent) {
  event.preventDefault()
  if (canvasImage.value.dragging) {
    const currentMousePos = windowToCanvas(event.clientX, event.clientY)
    canvasImage.value.imgPos.x += currentMousePos.x - canvasImage.value.lastMousePos.x
    canvasImage.value.imgPos.y += currentMousePos.y - canvasImage.value.lastMousePos.y
    canvasImage.value.lastMousePos = JSON.parse(JSON.stringify(currentMousePos))
    drawImage()
    emits('mousemove')
  }
}
function mousedown(event: MouseEvent) {
  event.preventDefault()
  contextmenuStyle.value.display = 'none'
  canvasImage.value.dragging = true
  canvasImage.value.lastMousePos = windowToCanvas(event.clientX, event.clientY)
  emits('mousedown')
}
function mouseup() {
  canvasImage.value.dragging = false
  emits('mouseup')
}
function mouseout() {
  canvasImage.value.dragging = false
  emits('mouseout')
}
function wheel(event: any) {
  event.preventDefault()

  var pos = windowToCanvas(event.clientX, event.clientY)
  const old = canvasImage.value.imgScale
  const wheelDelta = event.wheelDelta ? event.wheelDelta : (event.deltaY * (-40))

  var newPos = {
    x: Number(((pos.x - canvasImage.value.imgPos.x) / canvasImage.value.imgScale).toFixed(2)),
    y: Number(((pos.y - canvasImage.value.imgPos.y) / canvasImage.value.imgScale).toFixed(2))
  }
  if (wheelDelta > 0) {
    canvasImage.value.imgScale += 0.1
    if (canvasImage.value.imgScale > props.maxScale) {
      canvasImage.value.imgScale = props.maxScale
    }
  } else {
    canvasImage.value.imgScale -= 0.1
    if (canvasImage.value.imgScale < props.minScale) {
      canvasImage.value.imgScale = props.minScale
    }
  }
  canvasImage.value.imgPos.x = (1 - canvasImage.value.imgScale) * newPos.x + (pos.x - newPos.x)
  canvasImage.value.imgPos.y = (1 - canvasImage.value.imgScale) * newPos.y + (pos.y - newPos.y)
  drawImage()
  emits('wheel', {
    old,
    now: canvasImage.value.imgScale
  })
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
watch(imageUrl, () => {
  init()
})
onMounted(() => {
  init()
})
</script>
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
