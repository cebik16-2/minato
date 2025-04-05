<template>
  <q-page class="row items-center justify-evenly">
    <example-component
      title="Example component"
      active
      :todos="todos"
      :meta="meta"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Todo, Meta } from '../components/models';

import ExampleComponent from 'components/ExampleComponent.vue';

const todos = ref<Todo[]>([
  {
    id: 1,
    title: 'Task 1',
    done: false
  },
  {
    id: 2,
    title: 'Task 2',
    done: true
  },
  {
    id: 3,
    title: 'Task 3',
    done: false
  },
  {
    id: 4,
    title: 'Task 4',
    done: true
  },
  {
    id: 5,
    title: 'Task 5',
    done: false
  }
]);

const meta = ref<Meta>({
  totalCount: 1200
});
</script>
