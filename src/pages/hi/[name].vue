<script setup lang="ts">
const router = useRouter()

const route = useRoute()

const name = computed(() => {
  return route.params.name
})
</script>

<template>
  <div>
    <p>
      {{ name }}
    </p>
    <p text-sm op50>
      <em>Dynamic route!</em>
    </p>

    <Counter :initial="4" />

    <div>
      <button
        class="btn m-3 text-sm mt-8"
        @click="router.back()"
      >
        Back
      </button>
    </div>
  </div>
</template>
