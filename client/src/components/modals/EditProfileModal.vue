<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Edit Profile</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit.prevent="saveProfile" ref="formRef">
          <q-input
            v-model="form.username"
            label="Username"
            filled
            dense
            class="q-mb-md"
            :rules="[val => !!val || 'Username is required']"
          />

          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            filled
            dense
            class="q-mb-md"
            :rules="[
              val => !!val || 'Email is required',
              val => /.+@.+\..+/.test(val) || 'Email must be valid'
            ]"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="grey-7" @click="closeModal" />
        <q-btn 
          flat 
          label="Save" 
          color="primary" 
          :loading="saving"
          @click="saveProfile"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useQuasar, type QForm } from 'quasar'
import { updateCurrentUser } from 'src/services/api/users/userApi'

/* ----------------------------------
 * Types
 * ---------------------------------- */
interface Props {
  modelValue: boolean
  user: { id: number; email: string; username?: string } | null
}

type ApiError = {
  response: {
    data: {
      error: string
    }
  }
}

/* ----------------------------------
 * Helpers
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

/* ----------------------------------
 * Setup
 * ---------------------------------- */
const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'saved': []
}>()

const $q = useQuasar()
const formRef = ref<QForm | null>(null)
const saving = ref(false)

const form = ref({
  username: '',
  email: ''
})

/* ----------------------------------
 * Watchers
 * ---------------------------------- */
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      form.value.username =
        newUser.username || newUser.email.split('@')[0] || ''
      form.value.email = newUser.email
    }
  },
  { immediate: true }
)

/* ----------------------------------
 * Actions
 * ---------------------------------- */
const closeModal = () => {
  emit('update:modelValue', false)
}

const saveProfile = async () => {
  const isValid = await formRef.value?.validate()
  if (!isValid) return

  saving.value = true
  try {
    await updateCurrentUser({
      username: form.value.username,
      email: form.value.email
    })

    emit('saved')
    closeModal()
  } catch (error: unknown) {
    console.error('Failed to update profile:', error)

    let message = 'Failed to update profile'

    if (isApiError(error)) {
      message = error.response.data.error
    } else if (error instanceof Error) {
      message = error.message
    }

    $q.notify({
      type: 'negative',
      message
    })
  } finally {
    saving.value = false
  }
}
</script>

