<template>
  <div class="content">
    <nav class="header">
      <h1 class="header-title">{{ name }}</h1>
    </nav>
    <b-container>
      <div class="add-tab">
        <b-button variant="success" @click="addTabList">
          {{ geti18nText('newInspect') }}
        </b-button>
      </div>
      <b-card no-body>
        <div class="config">
          <h2 class="config-title">{{ geti18nText('globalConfig') }}</h2>
          <b-form-checkbox v-model="sync">
            {{ geti18nText('syncToCloud') }}
          </b-form-checkbox>
        </div>
        <Tabs>
          <TabPane :label="getTabTitle(tab)" v-for="tab in tabList" :key="tab">
            <Pane :index="tab" :sync="sync" />
          </TabPane>
        </Tabs>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import Tabs from '/components/tabs/Tabs.vue';
import TabPane from '/components/tabs/TabPane.vue';
import Pane from '/components/Pane.vue';

export default {
  components: {
    Tabs,
    TabPane,
    Pane
  },
  data() {
    return {
      sync: true,
      tabList: [1],
      name: chrome.i18n.getMessage('appName')
    };
  },
  mounted() {
    this.getConfig('sync');
    this.getConfig('tabList');
  },
  methods: {
    geti18nText(name) {
      return chrome.i18n.getMessage(name);
    },
    getTabTitle(index) {
      return chrome.i18n.getMessage('inspect') + ' ' + index;
    },
    getConfig(key) {
      chrome.storage.sync.get(key, items => {
        chrome.storage.local.set({ [key]: items[key] }, () => {
          console.log('chrome first local set: %s, %s', key, items[key]);
        });
      });
      chrome.storage.local.get(key, items => {
        if (items[key] !== undefined) {
          this[key] = items[key];
        }
      });
    },
    addTabList() {
      const last = this.tabList.slice().pop();
      this.tabList.push(last + 1);
    }
  },
  watch: {
    sync: function(val) {
      chrome.storage.sync.set({ sync: val }, () => {
        console.log('chrome sync set: %s, %s', 'sync', val);
      });
      chrome.storage.local.set({ sync: val }, () => {
        console.log('chrome local set: %s, %s', 'sync', val);
      });
    }
  }
};
</script>

<style lang="scss">
.content {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.container {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.card {
  flex: 1;
  min-height: 780px;
}
.header {
  width: 100%;
  height: 96px;
  display: flex;
  align-items: center;
  background-color: #8191f1;

  &-title {
    color: #fff;
    font-size: 4rem;
    margin-left: 40px;
  }
}
.add-tab {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
}
.code-editer {
  border: 1px solid #ddd;
}
.CodeMirror {
  height: auto;
}
.action {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
}
.config {
  padding: 1.25rem;

  &-title {
    font-size: 1.5rem;
  }
}
</style>
