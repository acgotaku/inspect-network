<template>
  <div v-show="active">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      required: true,
      type: String
    }
  }
};
</script>
<style lang="scss"></style>
