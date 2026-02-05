<template>
  <q-page class="q-pa-md">
    <!-- Profile Header -->
    <div class="profile-header q-mb-lg">
      <div class="row items-center justify-between">
        <div class="col-auto">
          <div class="row items-center q-gutter-md">
            <q-avatar size="80px" color="primary" text-color="white">
              <span class="text-h5">{{ userInitials }}</span>
            </q-avatar>
            <div>
              <div class="text-h5">{{ currentUser?.username || currentUser?.email || 'User' }}</div>
              <div class="text-grey-7">{{ currentUser?.email }}</div>
            </div>
          </div>
        </div>
        <div class="col-auto">
          <q-btn 
            outline 
            color="primary" 
            label="Edit Profile" 
            icon="edit"
            @click="showEditProfileModal = true"
          />
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <q-tabs
      v-model="activeTab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="left"
    >
      <q-tab name="listings" label="My Listings" />
      <q-tab name="favorites" label="Favorites" />
      <q-tab name="history" label="Selling History" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="activeTab" animated>
      <!-- My Listings Tab -->
      <q-tab-panel name="listings">
        <div v-if="loadingListings" class="text-center q-pa-xl">
          <q-spinner-dots size="lg" color="primary" />
        </div>
        
        <div v-else-if="userListings.length > 0">
          <div class="row q-col-gutter-lg">
            <div
              v-for="product in userListings"
              :key="product.id"
              class="col-12 col-sm-6 col-md-4 col-lg-3"
            >
              <ItemCard
                :item="product"
                :isFavorited="false"
                @view="viewProduct(product)"
                @toggle-favorite="() => {}"
              />
            </div>
          </div>
        </div>

        <div v-else class="empty-state q-mt-xl text-center">
          <q-icon name="inventory_2" size="64px" color="grey-5" class="q-mb-md" />
          <div class="text-h6 text-grey-7">No listings yet</div>
          <div class="text-grey-6 q-mt-sm">Start selling by creating your first product</div>
          <q-btn 
            color="primary" 
            label="Create Listing" 
            class="q-mt-md"
            @click="$router.push('/products/new')"
          />
        </div>
      </q-tab-panel>

      <!-- Favorites Tab -->
      <q-tab-panel name="favorites">
        <div v-if="loadingFavorites" class="text-center q-pa-xl">
          <q-spinner-dots size="lg" color="primary" />
        </div>

        <div v-else-if="favoriteProducts.length > 0">
          <div class="row q-col-gutter-lg">
            <div
              v-for="product in favoriteProducts"
              :key="product.id"
              class="col-12 col-sm-6 col-md-4 col-lg-3"
            >
              <ItemCard
                :item="product"
                :isFavorited="true"
                @view="viewProduct(product)"
                @toggle-favorite="removeFavoriteById(product.id)"
              />
            </div>
          </div>
        </div>

        <div v-else class="empty-state q-mt-xl text-center">
          <q-icon name="favorite_border" size="64px" color="grey-5" class="q-mb-md" />
          <div class="text-h6 text-grey-7">No favorites yet</div>
          <div class="text-grey-6 q-mt-sm">Browse the marketplace and save items you like</div>
          <q-btn 
            color="primary" 
            label="Browse Marketplace" 
            class="q-mt-md"
            @click="$router.push('/')"
          />
        </div>
      </q-tab-panel>

      <!-- Selling History Tab -->
      <q-tab-panel name="history">
        <div v-if="loadingListings" class="text-center q-pa-xl">
          <q-spinner-dots size="lg" color="primary" />
        </div>

        <div v-else-if="sellingHistory.length > 0">
          <div class="row q-col-gutter-lg">
            <div
              v-for="product in sellingHistory"
              :key="product.id"
              class="col-12 col-sm-6 col-md-4 col-lg-3"
            >
              <ItemCard
                :item="product"
                :isFavorited="false"
                @view="viewProduct(product)"
                @toggle-favorite="() => {}"
              />
            </div>
          </div>
        </div>

        <div v-else class="empty-state q-mt-xl text-center">
          <q-icon name="history" size="64px" color="grey-5" class="q-mb-md" />
          <div class="text-h6 text-grey-7">No selling history</div>
          <div class="text-grey-6 q-mt-sm">Your past listings will appear here</div>
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Edit Profile Modal -->
    <EditProfileModal 
      v-model="showEditProfileModal"
      :user="currentUser"
      @saved="handleProfileSaved"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import type { Product } from 'src/types'
import ItemCard from 'src/components/sections/ItemCard.vue'
import EditProfileModal from 'src/components/modals/EditProfileModal.vue'
import { getUserProducts } from 'src/services/api/products/products'
import { getFavorites, removeFavorite } from 'src/services/api/favorites/favoritesApi'
import { getCurrentUser } from 'src/services/api/users/userApi'

const router = useRouter()
const $q = useQuasar()

/* ----------------------------------
 * Types
 * ---------------------------------- */
type AccountTab = 'listings' | 'favorites' | 'history'

type FavoriteItem = {
  id: number
  product: Product
}

type ApiError = {
  response: {
    data: {
      error: string
    }
  }
}

/* ----------------------------------
 * Error helper (reused logic)
 * ---------------------------------- */
function isApiError(error: unknown): error is ApiError {
  if (typeof error !== 'object' || error === null) return false
  if (!('response' in error)) return false

  const response = (error as { response?: unknown }).response
  if (typeof response !== 'object' || response === null) return false
  if (!('data' in response)) return false

  const data = (response as { data?: unknown }).data
  if (typeof data !== 'object' || data === null) return false

  return typeof (data as { error?: unknown }).error === 'string'
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (isApiError(error)) return error.response.data.error
  if (error instanceof Error) return error.message
  return fallback
}

/* ----------------------------------
 * State
 * ---------------------------------- */
const activeTab = ref<AccountTab>('listings')
const showEditProfileModal = ref(false)

const currentUser = ref<{ id: number; email: string; username?: string } | null>(null)
const userListings = ref<Product[]>([])
const favorites = ref<FavoriteItem[]>([])

const loadingListings = ref(false)
const loadingFavorites = ref(false)

/* ----------------------------------
 * Computed
 * ---------------------------------- */
const userInitials = computed(() => {
  if (!currentUser.value) return '?'
  const name = currentUser.value.username || currentUser.value.email
  return name.substring(0, 2).toUpperCase()
})

const sellingHistory = computed(() => userListings.value)

const favoriteProducts = computed(() =>
  favorites.value.map(f => f.product)
)

/* ----------------------------------
 * Data loading
 * ---------------------------------- */
const loadUserData = async () => {
  try {
    const response = await getCurrentUser()
    currentUser.value = response.data
  } catch (error: unknown) {
    console.error('Failed to load user data:', error)
    $q.notify({
      type: 'negative',
      message: getErrorMessage(error, 'Failed to load user information')
    })
  }
}

const loadUserListings = async () => {
  loadingListings.value = true
  try {
    const response = await getUserProducts()
    // Handle response structure: API returns {products: []}
    const listingsData = response.data?.products || response.data || []
    userListings.value = Array.isArray(listingsData) ? listingsData : []
  } catch (error: unknown) {
    console.error('Failed to load listings:', error)
    $q.notify({
      type: 'negative',
      message: getErrorMessage(error, 'Failed to load your listings')
    })
  } finally {
    loadingListings.value = false
  }
}

const loadFavorites = async () => {
  loadingFavorites.value = true
  try {
    const response = await getFavorites()
    // Handle response structure: API returns {favorites: []}
    const favoritesData = response.data?.favorites || response.data || []
    favorites.value = Array.isArray(favoritesData) ? favoritesData : []
  } catch (error: unknown) {
    console.error('Failed to load favorites:', error)
    $q.notify({
      type: 'negative',
      message: getErrorMessage(error, 'Failed to load favorites')
    })
  } finally {
    loadingFavorites.value = false
  }
}

/* ----------------------------------
 * Actions
 * ---------------------------------- */
const removeFavoriteById = async (productId: number) => {
  const favorite = favorites.value.find(f => f.product.id === productId)
  if (!favorite) return

  try {
    await removeFavorite(favorite.id)
    favorites.value = favorites.value.filter(f => f.id !== favorite.id)

    $q.notify({
      type: 'positive',
      message: 'Removed from favorites'
    })
  } catch (error: unknown) {
    console.error('Failed to remove favorite:', error)
    $q.notify({
      type: 'negative',
      message: getErrorMessage(error, 'Failed to remove favorite')
    })
  }
}

const viewProduct = (product: Product) => {
  void router.push(`/product/${product.id}`)
}

const handleProfileSaved = async () => {
  await loadUserData()
  $q.notify({
    type: 'positive',
    message: 'Profile updated successfully'
  })
}

/* ----------------------------------
 * Lifecycle
 * ---------------------------------- */
onMounted(async () => {
  await loadUserData()
  await loadUserListings()
  await loadFavorites()
})
</script>

<style scoped>
.profile-header {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-state {
  padding: 48px 24px;
}
</style>
