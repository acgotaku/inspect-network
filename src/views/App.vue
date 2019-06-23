<template>
  <div id="app">
    <Options />
  </div>
</template>

<script>
import Options from '/views/Options.vue';
export default {
  components: {
    Options
  }
};
</script>

<style lang="scss">
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
</style>
