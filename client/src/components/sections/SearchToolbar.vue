<template>
  <div class="search-toolbar q-py-md q-px-lg border-bottom"
    :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-grey-2 text-dark'">
    <div class="row q-col-gutter-md items-center">

      <!-- Label -->
      <div class="col-12 col-md-auto">
        <div class="row items-center q-gutter-sm" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-9'">
          <q-icon name="tune" size="sm" />
          <span class="text-subtitle2 font-mono text-uppercase">Quick Specs</span>
        </div>
      </div>

      <div class="col-12 col-md-auto hidden-sm-and-down" :class="$q.dark.isActive ? 'text-grey-7' : 'text-grey-5'">|
      </div>

      <!-- Filters -->
      <div class="col-12 col-md row q-col-gutter-sm">
        <div class="col-6 col-sm-3 col-md-auto" style="min-width: 140px">
          <q-select outlined dense v-model="filters.categoryId" :options="categories" option-value="id"
            option-label="name" emit-value map-options label="CATEGORY"
            :bg-color="$q.dark.isActive ? 'grey-9' : 'white'" :color="$q.dark.isActive ? 'white' : 'grey-9'"
            :label-color="$q.dark.isActive ? 'grey-4' : 'grey-7'" />
        </div>

        <div class="col-6 col-sm-3 col-md-auto" style="min-width: 140px">
          <q-select outlined dense v-model="filters.make"
            :options="['Akai', 'Revox', 'Teac', 'Technics', 'Marantz', 'Pioneer']" label="MAKE"
            :bg-color="$q.dark.isActive ? 'grey-9' : 'white'" :color="$q.dark.isActive ? 'white' : 'grey-9'"
            :label-color="$q.dark.isActive ? 'grey-4' : 'grey-7'" />
        </div>

        <div class="col-6 col-sm-3 col-md-auto" style="min-width: 140px">
          <q-select outlined dense v-model="filters.yearRange"
            :options="['Pre-1950', '1950-1960', '1960-1970', '1970-1980', '1980+']" label="ERA"
            :bg-color="$q.dark.isActive ? 'grey-9' : 'white'" :color="$q.dark.isActive ? 'white' : 'grey-9'"
            :label-color="$q.dark.isActive ? 'grey-4' : 'grey-7'" />
        </div>

        <div class="col-6 col-sm-3 col-md-auto" style="min-width: 140px">
          <q-select outlined dense v-model="filters.condition"
            :options="['For Parts', 'Refurbished', 'Good', 'Near Mint', 'Mint']" label="CONDITION"
            :bg-color="$q.dark.isActive ? 'grey-9' : 'white'" :color="$q.dark.isActive ? 'white' : 'grey-9'"
            :label-color="$q.dark.isActive ? 'grey-4' : 'grey-7'" />
        </div>

        <div class="col-6 col-sm-3 col-md-auto" style="min-width: 140px">
          <q-select outlined dense v-model="filters.price"
            :options="['Under $10k', '$10k - $25k', '$25k - $50k', '$50k+']" label="BUDGET"
            :bg-color="$q.dark.isActive ? 'grey-9' : 'white'" :color="$q.dark.isActive ? 'white' : 'grey-9'"
            :label-color="$q.dark.isActive ? 'grey-4' : 'grey-7'" />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, watch } from 'vue'
import { getCategories } from 'src/services/api/categories/categories'

interface Category {
  id: number
  name: string
}

const emit = defineEmits(['search'])

const categories = ref<Category[]>([])

const filters = reactive({
  categoryId: null as number | null,
  make: null,
  yearRange: null,
  condition: null,
  price: null
})

const loadCategories = async () => {
  try {
    const res = await getCategories()
    categories.value = Array.isArray(res.data) ? res.data : (res.data.categories || [])
    console.log('SearchToolbar: Loaded categories', categories.value)
  } catch (err) {
    console.error('Failed to load categories', err)
  }
}

const emitSearch = () => {
  console.log('SearchToolbar: Emitting search with filters', filters)
  emit('search', filters)
}

onMounted(() => {
  void loadCategories()
})

// Auto-trigger search when filters change
watch(filters, () => {
  emitSearch()
})
</script>

<style scoped>
.font-mono {
  font-family: 'Roboto Mono', monospace;
}

.search-toolbar {
  /* Using a semi-transparent border to blend with both light and dark backgrounds, 
     or relying on Quasar's 'border-bottom' class utility if available, 
     but here we'll just make it subtle. */
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.body--dark .search-toolbar {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}
</style>
