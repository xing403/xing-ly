<script setup lang="ts">
import { ref } from 'vue'
import type { BlockState } from '@/types'
import MineBlock from './MineBlock.vue'
let generate = false
const mineNum = ref(15)
const flagNum = ref(0)
const gameState = ref<'play' | 'won' | 'lost'>('play')
const gameLevel = ref<'simple' | 'general' | 'difficult' | 'hell'>('general')
const gameConfig = {
  simple: {
    mineNum: 10,
    width: 5,
    height: 5,
  },
  general: {
    mineNum: 40,
    width: 15,
    height: 15,
  },
  difficult: {
    mineNum: 60,
    width: 15,
    height: 15,
  },
  hell: {
    mineNum: 80,
    width: 15,
    height: 15,
  },

}
const directions = [
  [-1, 0],
  [-1, -1],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

const state = ref<BlockState[][]>([])
function reset() {
  gameState.value = 'play'
  generate = false
  flagNum.value = 0
  mineNum.value = gameConfig[gameLevel.value].mineNum
  state.value = Array.from({ length: gameConfig[gameLevel.value].height }, (_, y) =>
    Array.from({ length: gameConfig[gameLevel.value].width },
      (_, x): BlockState => ({
        x, y, adjacentMines: 0,
      }),

    ),
  )
}
function onRightClick(block: BlockState) {
  if (block.revealed)
    return
  if (flagNum.value === mineNum.value && block.flagged) {
    block.flagged = !block.flagged
    flagNum.value += block.flagged ? 1 : -1
  }
  else if (flagNum.value < mineNum.value) {
    block.flagged = !block.flagged
    flagNum.value += block.flagged ? 1 : -1
  }
  checkGameState()
}
function generateMines(state: BlockState[][], initial: BlockState, length: number) {
  flagNum.value = 0
  generateMine(state, initial, length)
  updateNumbers(state)
}
function generateMine(state: BlockState[][], initial: BlockState, length: number) {
  if (length === 0)
    return
  const x = randomInt(0, gameConfig[gameLevel.value].width)
  const y = randomInt(0, gameConfig[gameLevel.value].height)
  if (Math.abs(initial.x - x) <= 1 && Math.abs(initial.y - y) <= 1) {
    generateMine(state, initial, length)
  }
  else if (!state[y][x].mine) {
    state[y][x].mine = true
    generateMine(state, initial, length - 1)
  }
  else {
    generateMine(state, initial, length)
  }
}
function updateNumbers(state: BlockState[][]) {
  state.forEach((row) => {
    row.forEach((block) => {
      if (block.mine)
        return
      getSiblings(block).forEach((b) => {
        if (b.mine)
          block.adjacentMines += 1
      })
    })
  })
}
function onClick(block: BlockState) {
  if (gameState.value !== 'play' || block.flagged)
    return
  block.revealed = true
  if (!generate) {
    generateMines(state.value, block, mineNum.value)
    generate = true
  }
  if (block.mine) {
    gameState.value = 'lost'
    showAllMines()
  }
  expendZero(block)
  checkGameState()
}
function expendZero(block: BlockState) {
  if (block.adjacentMines)
    return
  getSiblings(block).forEach((s) => {
    if (!s.revealed) {
      s.revealed = true
      expendZero(s)
    }
  })
}
function getSiblings(block: BlockState) {
  return directions.map(([ox, oy]) => {
    const dx = block.x + ox
    const dy = block.y + oy
    if (dx < 0 || dy < 0 || dx >= gameConfig[gameLevel.value].width || dy >= gameConfig[gameLevel.value].height)
      return undefined
    return state.value[dy][dx]
  }).filter(Boolean) as BlockState[]
}
function checkGameState() {
  if (!generate || gameState.value !== 'play')
    return

  const blocks = state.value.flat()
  if (!blocks.some(block => !block.mine && !block.revealed)
    || blocks.filter(block => block.mine).every(block => block.flagged)
  )
    gameState.value = 'won'
}
function showAllMines() {
  state.value.flat().forEach((i) => {
    if (i.mine)
      i.revealed = true
  })
}
function random(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function randomInt(min: number, max: number) {
  return Math.floor(random(min, max))
}

reset()
</script>

<template>
  <div class="game-mines-map">
    <div v-for="row, y in state" :key="y" flex justify-center>
      <MineBlock v-for="item, x in row" :key="x" h-10 w-10 flex items-center justify-center :block="item"
        @click="onClick(item)" @contextmenu.prevent="onRightClick(item)" />
    </div>
  </div>
</template>
