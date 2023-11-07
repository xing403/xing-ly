<script setup lang="ts">

</script>

<template>
  <div>
    <LxCanvasImage image-url='http://ilstudy.vip/images/avatar.jpg' auto >
      <template #info="scope">
        {{ scope }}
      </template>
    </LxCanvasImage>
  </div>
</template>
