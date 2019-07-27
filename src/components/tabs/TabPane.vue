<template>
  <div class="tab-pane" v-show="active">
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
  },
  inject: ['rootTabs'],
  provide() {
    return {
      tabPane: this
    };
  },
  created() {
    this.rootTabs.addNav({
      label: this.label
    });
  },
  computed: {
    active: function() {
      return this.rootTabs.activeName === this.label;
    }
  }
};
</script>
<style lang="scss">
.tab {
  &-pane {
    height: 100%;
  }
}
</style>
