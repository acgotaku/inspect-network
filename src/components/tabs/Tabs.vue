<template>
  <div class="tabs">
    <ul role="tablist" class="tabs-nav">
      <li
        v-for="nav in navList"
        :key="nav.label"
        class="tabs-item"
        :class="{ 'o-active': activeName === nav.label }"
        @click="setActiveName(nav.label)"
      >
        {{ nav.label }}
      </li>
    </ul>
    <div class="tabs-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: '',
      navList: []
    };
  },
  methods: {
    addNav(nav) {
      this.navList.push(nav);
      if (!this.activeName) {
        this.activeName = nav.label;
      }
    },
    setActiveName(label) {
      this.activeName = label;
      this.$emit('on-click', this.activeName);
    }
  },
  provide() {
    return {
      rootTabs: this
    };
  }
};
</script>
<style lang="scss">
$border-color: #ccc;
$white: #fff;
.tabs {
  margin: 0 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  &-nav {
    list-style: none;
    display: flex;
    border-bottom: 1px solid $border-color;
  }

  &-item {
    cursor: pointer;
    padding: 0.5rem 1rem;
    border: 1px solid transparent;
    margin-bottom: -1px;

    &.o-active {
      border-color: $border-color $border-color $white;
    }
  }

  &-content {
    flex: 1;
  }
}
</style>
