<template>
  <div class="carousel-wrapper">
    <q-carousel
      v-model="currentSlide"
      animated
      infinite
      navigation
      navigation-position="bottom"
      swipeable
      autoplay
      :autoplay-speed="autoplaySpeed"
      control-color="white"
      transition-prev="slide-right"
      transition-next="slide-left"
      height="300px"
      class="carousel-container shadow-3"
      :disable="loading || slides.length === 0"
      role="region"
      aria-label="Promotional banner carousel"
      @before-transition="onSlideChange"
    >
      <q-carousel-slide
        v-for="(slide, index) in slides"
        :key="`slide-${index}`"
        :name="`slide${index}`"
        class="carousel-slide"
      >
        <!-- Image with fallback and error handling -->
        <div class="slide-image-container relative-position">
          <img
            v-if="!imageErrors[index]"
            :src="slide.image"
            :alt="slide.caption || `Banner ${index + 1}`"
            class="slide-image"
            loading="lazy"
            @error="handleImageError(index)"
          />
          
          <!-- Fallback: Solid color background with icon -->
          <div
            v-else
            class="slide-image-fallback row items-center justify-center"
            :style="{ backgroundColor: slide.bgColor || '#e0e0e0' }"
          >
            <q-icon name="image_not_supported" size="60px" color="grey-5" />
          </div>

          <!-- Clickable overlay -->
          <a
            v-if="slide.link"
            :href="slide.link"
            target="_blank"
            rel="noopener"
            class="absolute-full slide-link cursor-pointer"
            @click="handleBannerClick(slide, index)"
            :aria-label="`Open ${slide.caption || 'promotional link'} in new window`"
          ></a>

          <!-- Caption overlay with better styling -->
          <div
            v-if="slide.caption"
            class="absolute-bottom text-white text-center q-pa-md slide-caption"
          >
            <div class="text-subtitle1 text-weight-bold">{{ slide.caption }}</div>
            <div v-if="slide.description" class="text-caption q-mt-xs">
              {{ slide.description }}
            </div>
          </div>
        </div>
      </q-carousel-slide>

      <!-- Loading state -->
      <template v-if="loading" #default>
        <div class="absolute-center">
          <q-spinner color="primary" size="50px" />
        </div>
      </template>
    </q-carousel>

    <!-- Slide counter for accessibility -->
    <div class="slide-counter text-grey-7 text-caption q-mt-sm">
      Slide {{ currentSlideIndex + 1 }} of {{ slides.length }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { PropType } from 'vue'

interface Slide {
  image: string
  link?: string
  caption?: string
  description?: string
  bgColor?: string
}

const props = defineProps({
  slides: {
    type: Array as PropType<Slide[]>,
    required: true
  },
  autoplaySpeed: {
    type: Number,
    default: 5000
  },
  onBannerClick: {
    type: Function as PropType<(slide: Slide, index: number) => void>,
    default: () => {}
  }
})

const currentSlide = ref('slide0')
const imageErrors = ref<Record<number, boolean>>({})
const loading = ref(false)

const currentSlideIndex = computed(() => {
  const match = currentSlide.value.match(/\d+/)
  return match ? parseInt(match[0]) : 0
})

// Handle image loading errors with graceful fallback
const handleImageError = (index: number) => {
  console.warn(`Failed to load banner image at index ${index}`)
  imageErrors.value[index] = true
}

// Track banner clicks for analytics
const handleBannerClick = (slide: Slide, index: number) => {
  console.log(`Banner clicked: "${slide.caption}" (index: ${index})`)
  props.onBannerClick(slide, index)
}

// Callback when slide changes
const onSlideChange = () => {
  // Could be used for tracking slide views
  console.log(`Transitioned to slide: ${currentSlideIndex.value}`)
}

onMounted(() => {
  // Validate slides
  if (!props.slides || props.slides.length === 0) {
    console.warn('BannerCarousel: No slides provided')
  }
})
</script>

<style scoped>
.carousel-wrapper {
  width: 100%;
}

.carousel-container {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  background-color: #f5f5f5;
}

.carousel-container:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.carousel-slide {
  padding: 0;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.slide-image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.slide-image-fallback {
  width: 100%;
  height: 100%;
  background-color: #e0e0e0;
}

.slide-link {
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.carousel-slide:hover .slide-link {
  opacity: 0.1;
}

.slide-caption {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  backdrop-filter: blur(2px);
  z-index: 2;
  transition: all 0.3s ease;
  padding: 16px;
}

.carousel-container:hover .slide-caption {
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
}

.slide-counter {
  text-align: center;
  margin-top: 8px;
  font-size: 12px;
}

/* Mobile optimization */
@media (max-width: 768px) {
  .carousel-container {
    height: 200px;
    border-radius: 12px;
  }

  .slide-caption {
    padding: 12px;
  }

  .carousel-container:hover .slide-caption {
    padding: 12px;
  }

  .slide-image {
    transition: none;
  }
}

@media (max-width: 480px) {
  .carousel-container {
    height: 160px;
  }

  .slide-caption {
    padding: 8px;
  }

  .slide-caption .text-subtitle1 {
    font-size: 14px;
  }

  .slide-caption .text-caption {
    display: none;
  }
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.carousel-slide {
  animation: slideIn 0.3s ease-out;
}

/* Accessibility: Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .carousel-container,
  .slide-image,
  .slide-link,
  .slide-caption {
    transition: none !important;
    animation: none !important;
  }
}
</style>
