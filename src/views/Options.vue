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
          <h2 class="config-title">{{ geti18nText('settings') }}</h2>
        </div>
        <Tabs>
          <TabPane :label="getTabTitle(tab)" v-for="tab in tabList" :key="tab">
            <Pane
              :index="tab"
              @remove="removeTabList"
              @save="saveTabList"
              :removable="removable"
            />
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
      tabList: [1],
      name: chrome.i18n.getMessage('appName')
    };
  },
  mounted() {
    this.getConfig('tabList');
    window.reset = () => {
      this.clear();
    };
  },
  methods: {
    geti18nText(name) {
      return chrome.i18n.getMessage(name);
    },
    getTabTitle(index) {
      return chrome.i18n.getMessage('inspect') + ' ' + index;
    },
    getConfig(key) {
      chrome.storage.local.get(key, items => {
        if (items[key] !== undefined) {
          this[key] = items[key];
        }
      });
    },
    clear() {
      chrome.storage.local.clear();
      window.location.reload();
    },
    saveConfig(key, val) {
      chrome.storage.local.set({ [key]: val }, () => {
        console.log('chrome local set: %s, %s', key, val);
      });
    },
    addTabList() {
      const last = this.tabList.slice().pop();
      this.tabList.push(last + 1);
      this.saveConfig('tabList', this.tabList);
    },
    saveTabList() {
      this.saveConfig('tabList', this.tabList);
    },
    removeTabList(val) {
      const index = this.tabList.indexOf(val);
      this.tabList.splice(index, 1);
      this.saveConfig('tabList', this.tabList);
    }
  },
  computed: {
    removable: function() {
      return this.tabList.length > 1;
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
