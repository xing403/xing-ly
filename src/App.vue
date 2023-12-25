<script setup lang="ts">
import { ref } from 'vue'
const i = ref(0)
function load() {
  return new Promise((resolve) => {
    setTimeout(() => {

      if (i.value !== 1) {

        resolve(
          Array.from({
            length: Math.floor(Math.random() * 10 + 1)
          }, (_, i) => {
            return {
              name: `name${i}`,
              age: Math.floor(Math.random() * 100 + 1)
            }
          })
        )
      } else {
        resolve([])
      }
      i.value++
    }, 1000)
  })
}
function loadEnd() {
  console.log('load end')
}
</script>

<template>
  <div>

  </div>
  <div>
    <xl-infinite-load :load="load" style="height: 200px;" @load-end="loadEnd">
      <template #content="scope">
        <div>{{ scope }}</div>
      </template>
    </xl-infinite-load>
  </div>
</template>
