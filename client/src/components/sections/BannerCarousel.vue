<template>
  <q-carousel
    v-model="currentSlide"
    animated
    infinite
    navigation
    swipeable
    autoplay
    control-color="white"
    transition-prev="slide-right"
    transition-next="slide-left"
    height="300px"
    class="carousel-container shadow-3"
  >
    <q-carousel-slide
      v-for="(slide, index) in slides"
      :key="index"
      :name="'slide' + index"
      :img-src="slide.image"
      class="carousel-slide"
    >
      <!-- Clickable Banner -->
      <a
        v-if="slide.link"
        :href="slide.link"
        target="_blank"
        rel="noopener"
        class="absolute-full cursor-pointer"
      ></a>

      <!-- Optional Caption Overlay -->
      <div
        v-if="slide.caption"
        class="absolute-bottom text-white text-center q-pa-md bg-black bg-opacity-50"
      >
        {{ slide.caption }}
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { PropType } from 'vue'

interface Slide {
  image: string
  link?: string
  caption?: string
}

export default defineComponent({
  name: 'BannerCarousel',
  props: {
    slides: {
      type: Array as PropType<Slide[]>,
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
.carousel-container {
  border-radius: 16px;
  overflow: hidden;
}

.carousel-slide {
  background-size: cover;
  background-position: center;
}
</style>
