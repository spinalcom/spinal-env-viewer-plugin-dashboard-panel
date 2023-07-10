<!--
Copyright 2022 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <div class="panel_content">
    <div class="tabs">
      <div class="tab"
           :class="{ active: tabSelected == tabs.endpoints }"
           @click="selectTab(tabs.endpoints)">
        Endpoints
      </div>
      <div class="tab"
           :class="{ active: tabSelected == tabs.controlPoints }"
           @click="selectTab(tabs.controlPoints)">
        Control Points
      </div>
    </div>
    <div class="main">
      <tab-content-component @removed="removeEndpoint"
                             :isControlPoint="tabSelected == tabs.controlPoints"
                             :data="contents"
                             :itemCountPerLine="itemCountPerLine">
      </tab-content-component>
    </div>
  </div>
</template>

<script>
import TabContentTemplate from "./tabs/tab-template.vue";

export default {
  name: "panel-content",
  components: {
    "tab-content-component": TabContentTemplate,
  },
  props: {
    itemCountPerLine: {
      type: Number,
      default: 3,
    },
    tabs: {},
    endpoints: Array,
    controlEndpoints: Array,
  },
  data() {
    return {
      tabSelected: "",
      contents: [],
    };
  },

  mounted() {
    this.tabSelected = this.tabs.endpoints;
    // this.endpoints = this.data.endpoints;
    // this.controlpoints = this.data.controlPoints;
  },

  methods: {
    selectTab(tabName) {
      this.tabSelected = tabName;
    },

    updateContents() {
      switch (this.tabSelected) {
        case this.tabs.endpoints:
          this.contents = this.endpoints;
          break;
        case this.tabs.controlPoints:
          this.contents = this.controlEndpoints;
          break;
        default:
          return [];
      }
    },

    removeEndpoint(data) {
      this.$emit("removed", { id: data, type: this.tabSelected });
    },
  },
  watch: {
    tabSelected() {
      this.updateContents();
    },

    endpoints() {
      this.updateContents();
    },

    controlEndpoints() {
      this.updateContents();
    },
  },
  // computed: {
  // 	contents() {
  // 		switch (this.tabSelected) {
  // 			case this.tabs.endpoints:
  // 				return this.data.endpoints;
  // 			case this.tabs.controlPoints:
  // 				return this.data.controlPoints;
  // 			default:
  // 				return [];
  // 		}
  // 	},
  // },
};
</script>

<style scoped>
.panel_content {
  width: 100%;
  height: 100%;
}

.panel_content .tabs {
  width: 100%;
  height: 50px;
  display: flex;
}

.panel_content .tabs .tab {
  flex: 1 1 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #222;

  /* border: 1px solid grey; */
}

.panel_content .tabs .tab:hover {
  cursor: pointer;
}

.panel_content .tabs .tab.active {
  border-bottom: 2px solid #448aff;
}

.panel_content .main {
  width: 100%;
  height: calc(100% - 50px);
  overflow: hidden;
  /* display: grid;
		grid-auto-rows: minmax(140px, 140px);
		overflow: hidden;
		overflow-y: auto; */
}
</style>
