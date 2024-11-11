<script setup lang="ts">
import { invoke } from '@tauri-apps/api/tauri'

const name = ref('')

const router = useRouter()
function go() {
  if (name.value) {
    invoke<string>('greet', { name: name.value }).then((res) => {
      router.push(`/hi/${encodeURIComponent(res)}`)
    })
  }
}
</script>

<template>
  <div>
    <p>
      <a rel="noreferrer" href="https://github.com/taruri-plugin-mips/tauri_v1" target="_blank">
        Starter Tauri mips V1
      </a>
    </p>
    <p>
      <em text-sm op75>Starter template for Vue</em>
    </p>

    <div py-4 />

    <Input
      v-model="name"
      placeholder="What's your name?"
      autocomplete="false"
      @keydown.enter="go"
    />

    <div>
      <button
        class="m-3 text-sm btn"
        :disabled="!name"
        @click="go"
      >
        Go
      </button>
    </div>
  </div>
</template>
