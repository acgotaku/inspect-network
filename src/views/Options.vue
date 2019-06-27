<template>
  <div>
    <nav class="header">
      <h1 class="header-title">{{ name }}</h1>
    </nav>
    <b-container>
      <div class="add-tab">
        <b-button variant="success">New Inspect</b-button>
      </div>
      <b-card no-body>
        <b-tabs card>
          <b-tab title="Tab 1">
            <b-card-body>
              <b-form @submit.stop.prevent>
                <label for="url">Target URL</label>
                <b-input
                  type="text"
                  id="url"
                  aria-describedby="url-help-block"
                ></b-input>
                <b-form-text id="url-help-block">
                  URL must be start with http or https.
                </b-form-text>
              </b-form>
              <div class=""></div>
            </b-card-body>
          </b-tab>
          <b-tab title="Tab 2">
            <b-card-text>Tab Contents 2</b-card-text>
          </b-tab>
        </b-tabs>
      </b-card>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: chrome.i18n.getMessage('appName'),
      newInspect: chrome.i18n.getMessage('newInspect'),
      inspects: localStorage.getItem('inspects') || 1
    };
  }
};
</script>

<style lang="scss">
.header {
  width: 100%;
  height: 96px;
  display: flex;
  align-items: center;
  background-color: #8191f1;

  &-title {
    color: #fff;
    font-size: 5rem;
    margin-left: 40px;
  }
}
.add-tab {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
}
</style>
