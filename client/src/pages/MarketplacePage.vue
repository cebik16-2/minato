<template>
  <div class="q-pa-md">
    <!-- Banner Carousel -->
    <BannerCarousel :slides="slides" />

    <!-- Trending Items -->
    <TrendingSection
      :items="trendingItems"
      @view-item="viewItem"
      @add-to-cart="addToCart"
    />

    <!-- Quick View Modal -->
    <QuickViewModal
      v-if="quickViewVisible"
      :item="selectedItem"
      @close="quickViewVisible = false"
    />

    <!-- Add Item Modal -->
    <AddItemModal
      v-if="showAddItem"
      @item-added="handleItemAdded"
      @close="showAddItem = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import BannerCarousel from 'src/components/sections/BannerCarousel.vue'
import TrendingSection from 'src/components/sections/TrendingSection.vue'
import QuickViewModal from 'src/components/modals/QuickViewModal.vue'
import AddItemModal from 'src/components/modals/AddItemModal.vue'
import type { Item } from 'src/types'

export default defineComponent({
  name: 'MarketplacePage',
  components: {
    BannerCarousel,
    TrendingSection,
    QuickViewModal,
    AddItemModal
  },
  setup () {
    const slides = [
      '/assets/banner1.jpg',
      '/assets/banner2.jpg',
      '/assets/banner3.jpg'
    ]

    const sampleItem: Item = {
      id: 1,
      name: 'Nike Air Max Herren',
      image: '/assets/shoes1.jpg',
      price: 'EUR 86,95',
      description: 'Comfortable running shoes for men.',
      category: 'Footwear',
      brand: 'Nike',
      rating: 4.5,
      numReviews: 120,
      countInStock: 15,
      isFeatured: true,
      isNew: false,
      isOnSale: false,
      isBestSeller: true,
      isTopRated: true,
      isTrending: true,
      isLimited: false,
      isExclusive: false,
      isPopular: true,
      isRecommended: true,
      isSpecial: false,
      isGift: false,
      isBundle: false,
      isSubscription: false,
      isDigital: false,
      isPhysical: true,
      isService: false,
      isMembership: false,
      isDonation: false,
      isCharity: false,
      isFundraiser: false,
      isCrowdfunding: false,
      isPreorder: false,
      isBackorder: false,
      isOutOfStock: false,
      isDiscontinued: false,
      isLimitedEdition: false,
      isSeasonal: false,
      isHoliday: false,
      isEvent: false,
      isPromotion: false,
      isSale: false,
      isClearance: false,
      isMarkdown: false,
      isDiscounted: false,
      isBargain: false,
      isDeal: false,
      isOffer: false,
      isSpecialOffer: false,
      isFlashSale: false,
      isLimitedTime: false,
      isLimitedQuantity: false,
      isLimitedTimeOffer: false,
      isLimitedTimeDeal: false,
      isLimitedTimeSale: false,
      isLimitedTimePromotion: false,
      isLimitedTimeDiscount: false,
      isLimitedTimeOfferDeal: false,
      isLimitedTimeOfferSale: false,
      isLimitedTimeOfferPromotion: false,
      isLimitedTimeOfferDiscount: false,
      isLimitedTimeOfferBargain: false,
      isLimitedTimeOfferDealSale: false
    }

    const trendingItems = ref<Item[]>([
      sampleItem,
      { ...sampleItem, id: 2, name: 'MacBook Air 2015', image: '/assets/macbook.jpg', price: 'EUR 180,00' },
      { ...sampleItem, id: 3, name: 'ON Running Cloud', image: '/assets/shoes2.jpg', price: 'EUR 138,95' }
    ])

    const selectedItem = ref<Item | null>(null)
    const quickViewVisible = ref(false)
    const showAddItem = ref(false)

    const viewItem = (item: Item) => {
      selectedItem.value = item
      quickViewVisible.value = true
    }

    const addToCart = (item: Item) => {
      const cart: Item[] = JSON.parse(localStorage.getItem('cart') || '[]')
      cart.push(item)
      localStorage.setItem('cart', JSON.stringify(cart))
    }

    const handleItemAdded = (newItem: Item) => {
      trendingItems.value.push(newItem)
      showAddItem.value = false
    }

    return {
      slides,
      trendingItems,
      selectedItem,
      quickViewVisible,
      showAddItem,
      viewItem,
      addToCart,
      handleItemAdded
    }
  }
})
</script>
