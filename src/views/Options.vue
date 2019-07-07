<template>
  <div>
    <nav class="header">
      <h1 class="header-title">{{ name }}</h1>
    </nav>
    <b-container>
      <div class="add-tab">
        <b-button variant="success">{{ geti18nText('newInspect') }}</b-button>
      </div>
      <b-card no-body>
        <b-tabs card>
          <b-tab title="Tab 1" active>
            <b-card-body>
              <b-form @submit.stop.prevent>
                <b-form-row>
                  <b-col cols="8">
                    <b-form-group
                      :label="geti18nText('targetURL')"
                      label-for="url"
                      :description="geti18nText('URLDesc')"
                    >
                      <b-form-input
                        id="url"
                        v-model="URL"
                        type="text"
                        required
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col cols="3" offset="1">
                    <b-form-group
                      :label="geti18nText('matchMode')"
                      label-for="mode"
                      :description="geti18nText('modeDesc')"
                    >
                      <b-form-select
                        v-model="selected"
                        :options="options"
                      ></b-form-select>
                    </b-form-group>
                  </b-col>
                </b-form-row>
                <label>Replace Content:</label>
                <div class="code-editer"></div>
                <div class="action">
                  <b-button variant="success" class="save" @click="save"
                    >Save</b-button
                  >
                </div>
              </b-form>
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
import CodeMirror from 'codemirror/lib/codemirror.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';

const defaultText =
  "(function(){\n  \"use strict\";\n  /* Start of your code */\n  function greetMe(yourName) {\n    alert('Hello ' + yourName);\n  }\n  \n  greetMe('World');\n  /* End of your code */\n})();";

export default {
  data() {
    return {
      URL: localStorage.getItem('URL') || '',
      cm: null,
      selected: null,
      options: [
        { value: null, text: 'URL match' },
        { value: 'a', text: 'URL wildcard' },
        { value: 'b', text: 'URL regex' },
        { value: { C: '3PO' }, text: 'This is an option with object value' },
        { value: 'd', text: 'This one is disabled', disabled: true }
      ],
      replacedText: localStorage.getItem('text') || defaultText,
      name: chrome.i18n.getMessage('appName')
    };
  },
  mounted() {
    this.cm = CodeMirror(document.querySelector('.code-editer'), {
      value: this.replacedText,
      mode: 'javascript',
      theme: 'monokai',
      indentUnit: 2,
      lineNumbers: true
    });
  },
  methods: {
    save() {
      const text = this.cm.getValue();
      localStorage.setItem('text', text);
      localStorage.setItem('URL', this.URL);
      this.$bvToast.toast('Save Success', {
        title: `Message`,
        variant: 'success',
        solid: true
      });
    },
    geti18nText(name) {
      return chrome.i18n.getMessage(name);
    }
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
</style>
