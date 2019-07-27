<template slot="tabs">
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
        <b-button variant="success" class="save" @click="save">Save</b-button>
      </div>
    </b-form>
  </b-card-body>
</template>

<script>
import CodeMirror from 'codemirror/lib/codemirror.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';

const defaultText =
  "(function(){\n  \"use strict\";\n  /* Start of your code */\n  function greetMe(yourName) {\n    alert('Hello ' + yourName);\n  }\n  \n  greetMe('World');\n  /* End of your code */\n})();";

export default {
  props: {
    index: Number,
    active: Boolean
  },
  data() {
    return {
      URL: localStorage.getItem('URL') || '',
      cm: null,
      selected: 'match',
      options: [
        { value: 'match', text: this.geti18nText('URLMatch') },
        { value: 'wildcard', text: this.geti18nText('URLWildcard') },
        { value: 'regex', text: this.geti18nText('URLRegex') }
      ],
      replacedText: localStorage.getItem('text') || defaultText
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
    },
    getTabTitle(index) {
      return chrome.i18n.getMessage('inspect') + ' ' + index;
    },
    saveConfig() {
      const configData = {
        sync: this.sync
      };
      for (let key in configData) {
        chrome.storage.local.set({ [key]: configData[key] }, () => {
          console.log('chrome local set: %s, %s', key, configData[key]);
        });
        if (configData['sync'] === true) {
          chrome.storage.sync.set({ [key]: configData[key] }, () => {
            console.log('chrome sync set: %s, %s', key, configData[key]);
          });
        }
      }
    }
  }
};
</script>
<style lang="scss">
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
