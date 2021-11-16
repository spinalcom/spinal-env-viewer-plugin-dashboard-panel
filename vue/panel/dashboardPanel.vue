<!--
Copyright 2021 SpinalCom - www.spinalcom.com

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
  <div class="dashboardPanelContent"
       v-if="pageSelected === PAGES.normal">
    <div class="header">
      <panel-header :itemCountPerLine="itemCountPerLine"
                    @increments="itemCountPerLine++"
                    @decrements="itemCountPerLine--"></panel-header>
    </div>

    <div class="content">
      <panel-content :itemCountPerLine="itemCountPerLine"
                     :endpoints="endpoints"
                     :controlEndpoints="controlEndpoints"></panel-content>
    </div>
  </div>

  <div class="dashboardPanelContent state"
       v-else>
    <md-progress-spinner v-if="pageSelected === PAGES.loading"
                         md-mode="indeterminate">
    </md-progress-spinner>

    <md-icon v-else-if="pageSelected === PAGES.error"
             class="md-size-4x">
      close
    </md-icon>
  </div>
</template>

<script>
const {
  spinalPanelManagerService,
} = require("spinal-env-viewer-panel-manager-service");

import endpointUtilities from "../../js/endpoint_utilities";
import HeaderComponent from "../components/header.vue";
import ContentComponent from "../components/content.vue";

export default {
  name: "dashboard-panel",
  components: {
    "panel-header": HeaderComponent,
    "panel-content": ContentComponent,
  },
  data() {
    this.viewer;
    this.PAGES = {
      normal: 1,
      loading: 2,
      error: 3,
    };

    return {
      pageSelected: this.PAGES.normal,
      // endpointsNode: null,
      // endpointSelected: null,
      itemCountPerLine: 3,
      endpoints: [],
      controlEndpoints: [],
    };
  },
  methods: {
    opened(option, viewer) {
      this.viewer = viewer;

      this.setTitle(option.name.get());
      this.pageSelected = this.PAGES.loading;
      endpointUtilities
        .getTreeStructure(option.id.get())
        .then((result) => {
          this.endpoints = result.endpoints;
          this.controlEndpoints = result.controlPoints;

          this.pageSelected = this.PAGES.normal;
        })
        .catch((err) => (this.pageSelected = this.PAGES.error));
    },

    closed() {},

    // getEndpointsNode(node) {
    //    return SpinalGraphService.findNodesByType(
    //       node.id.get(),
    //       RELATION_NAMES,
    //       SpinalBmsEndpoint.nodeTypeName
    //    )
    //       .then((endpoints) => {
    //          return endpoints.map((el) => {
    //             SpinalGraphService._addNode(el);
    //             return SpinalGraphService.getInfo(el.getId().get());
    //          });
    //       })
    //       .catch((err) => {
    //          console.log(err);
    //          return [];
    //       });
    // },

    setTitle(title) {
      spinalPanelManagerService.panels.spinal_dashboard_panel.panel.setTitle(
        `Dashboard : ${title}`
      );
    },
  },
  computed: {
    V6() {
      return parseInt(window.LMV_VIEWER_VERSION) === 6;
    },
  },
};
</script>

<style scoped>
.dashboardPanelContent {
  width: calc(100% - 10px);
  height: calc(100% - 20px);
  margin: auto;
  background-color: #424242;
}

.dashboardPanelContent .header {
  width: 100%;
  height: 50px;
}

.dashboardPanelContent .content {
  width: 100%;
  height: calc(100% - 50px);
}

.dashboardPanelContent.state {
  width: calc(100% - 10px);
  height: calc(100% - 20px);
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
