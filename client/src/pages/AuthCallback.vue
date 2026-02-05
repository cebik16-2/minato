<template>
  <q-page class="q-pa-md flex flex-center">
    <q-spinner v-if="loading" />
    <div v-else>
      <q-icon name="check_circle" color="green" size="lg" />
      <div class="text-h6 q-mt-sm">Your email has been confirmed!</div>
      <q-btn label="Go to Login" to="/" color="primary" class="q-mt-md" />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const loading = ref(true)
const route = useRoute()
const router = useRouter()

onMounted(() => {
  try {
    const token = route.query['access-token']
    const client = route.query['client']
    const uid = route.query['uid']

    if (!token || !client || !uid) {
      throw new Error('Missing confirmation parameters')
    }

    localStorage.setItem(
      'authToken',
      JSON.stringify({
        'access-token': token,
        client,
        uid
      })
    )

    loading.value = false
  } catch (e) {
    console.error('❌ Confirmation failed:', e)
    void router.replace('/')
  }
})
</script>
