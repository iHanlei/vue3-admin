<script setup lang="ts">
import Error from './components/Error.vue'
import { useRouter } from 'vue-router'

const { replace } = useRouter()

const errorClick = () => {
  replace('/login')
}
</script>

<template>
  <Error type="403" @error-click="errorClick" />
</template>
