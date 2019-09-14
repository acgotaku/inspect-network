<template>
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
              v-model="matchMode"
              :options="options"
            ></b-form-select>
          </b-form-group>
        </b-col>
      </b-form-row>
      <label>Replace Content:</label>
      <div ref="code" class="code"></div>
      <div class="action">
        <b-button variant="success" class="save" @click="save">Save</b-button>
        <b-button variant="danger" class="remove">Remove</b-button>
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
    sync: Boolean
  },
  data() {
    return {
      URL: localStorage.getItem('URL') || '',
      cm: null,
      matchMode: 'match',
      options: [
        { value: 'match', text: this.geti18nText('URLMatch') },
        { value: 'wildcard', text: this.geti18nText('URLWildcard') },
        { value: 'regex', text: this.geti18nText('URLRegex') }
      ],
      replacedText: defaultText
    };
  },
  inject: ['tabPane'],
  mounted() {
    this.cm = CodeMirror(this.$refs.code, {
      value: this.replacedText,
      mode: 'javascript',
      theme: 'monokai',
      indentUnit: 2,
      lineNumbers: true
    });
    this.getPaneData('inspect' + this.index);
    console.log(this);
  },
  watch: {
    'tabPane.active': function(val) {
      if (val && this.cm) {
        this.cm.refresh();
      }
    }
  },
  methods: {
    save() {
      const text = this.cm.getValue();
      const key = 'inspect' + this.index;
      const paneData = {
        URL: this.URL,
        matchMode: this.matchMode,
        replacedText: text
      };
      this.savePaneData(key, paneData);
      this.$bvToast.toast('Save Success', {
        title: `Message`,
        variant: 'success',
        solid: true
      });
    },
    geti18nText(name) {
      return chrome.i18n.getMessage(name);
    },
    getPaneData(key) {
      chrome.storage.sync.get(key, items => {
        chrome.storage.local.set({ [key]: items[key] }, () => {
          console.log('chrome first local set: %s, %s', key, items[key]);
        });
      });
      chrome.storage.local.get(key, items => {
        const paneData = items[key];
        for (const paneKey in paneData) {
          this[paneKey] = paneData[paneKey];
        }
      });
    },
    savePaneData(key, val) {
      if (this.sync) {
        chrome.storage.sync.set({ [key]: val }, () => {
          console.log('chrome sync set: %s, %s', key, val);
        });
      }
      chrome.storage.local.set({ [key]: val }, () => {
        console.log('chrome local set: %s, %s', key, val);
      });
    }
  }
};
</script>
<style lang="scss">
.CodeMirror {
  height: 100% !important;
  position: absolute;
  width: 100%;
}
.card-body {
  height: 100%;
  form {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}
.code {
  flex: 1;
  position: relative;
}
.remove {
  margin-left: 16px;
}
</style>