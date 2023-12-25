<script setup lang="ts">
import { InfiniteLoadPropsType } from '../types/infinite-load';
import { ref, computed, useSlots } from 'vue';

defineOptions({
  name: 'XlInfiniteLoad'
})

const props = withDefaults(defineProps<InfiniteLoadPropsType>(), {
  distance: 0,
  delay: 200,
  disabled: false,
  immediate: true,
})

const emits = defineEmits(['load-end', 'loaded'])
const slots = useSlots()
const data = ref<any>([])
const loading = ref(false)
const disabled = ref(false)

const isEmpty = computed(() => data.value.length === 0)

const emptyText = computed(() => props.emptyText ?? '暂无数据')
const endText = computed(() => props.endText ?? '没有更多数据了')
const loadingText = computed(() => props.loadingText ?? '加载中...')


async function handleLoad() {
  if (loading.value || disabled.value)
    return
  loading.value = true
  if (typeof props.load === 'function') {
    await props.load().then((d: any) => {
      if (d?.length === 0) {
        disabled.value = true
        emits('load-end')
      } else {
        data.value.push(...d)
        emits('loaded', d)
      }
      loading.value = false
    })
  }
}
</script>

<template>
  <div v-infinite-scroll="handleLoad" :infinite-scroll-delay="props.delay" :infinite-scroll-distance="props.distance"
    :infinite-scroll-disabled="disabled || props.disabled" :infinite-scroll-immediate="props.immediate"
    class="infinite-load">
    <div class="infinite-load-content">
      <slot name="content" v-for="scope  in data" :data="scope" />
    </div>

    <div v-if="isEmpty" class="infinite-load-empty">
      <slot v-if="slots.empty" name="empty" />
      <div v-else class="infinite-load-empty-text" v-text="emptyText" />
    </div>

    <div v-else-if="loading" class="infinite-load-loading">
      <div class="infinite-load-loading-text" v-text="loadingText" />
    </div>

    <div v-else class="infinite-load-end">
      <div class="infinite-load-end-text" v-text="endText" />
    </div>

  </div>
</template>

<style scoped lang="postcss">
.infinite-load-loading,
.infinite-load-end {
  color: #C0C4CC;
  text-align: center;
  font-size: 0.5em;
  padding: 5px 0;
}
.infinite-load-empty{
  text-align: center;
  font-size: 1.2em;
  padding: 2em;
}
</style>
