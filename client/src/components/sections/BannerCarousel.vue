<template>
  <q-carousel
    v-model="currentSlide"
    animated
    navigation
    swipeable
    height="250px"
    class="rounded-borders shadow-2"
  >
    <q-carousel-slide
      v-for="(slide, index) in slides"
      :key="index"
      :name="'slide' + index"
      :img-src="slide"
    />
  </q-carousel>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'BannerCarousel',
  props: {
    slides: {
      type: Array as PropType<string[]>,
      required: true
    }
  },
  setup() {
    const currentSlide = ref('slide0')
    return { currentSlide }
  }
})
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
  overflow: hidden;
}
</style>
