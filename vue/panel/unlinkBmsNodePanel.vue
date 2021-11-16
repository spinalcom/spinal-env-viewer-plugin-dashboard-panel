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
  <!-- <md-dialog :md-active.sync="showDialog"
             @md-closed="closeDialog(false)">
    <md-dialog-title class="_dialogTitle">Unlink Control Point to group
    </md-dialog-title> -->

  <!-- <md-dialog-content class="_unLinkDialogContent"> -->
  <div class="_unLinkBmsPanelContent">
    <div class="content"
         v-if="state === PAGES.loaded">
      <div class="state"
           v-if="nodes.length === 0">
        No BmsNetwork node linked
      </div>

      <md-list class="list_content md-scrollbar"
               v-else>
        <md-list-item v-for="item in nodes"
                      :key="item.id">

          <div class="md-list-item-text">
            <p>{{item.name}} <span class="item_type">({{item.type}})</span></p>

          </div>

          <md-button class="md-icon-button md-list-action"
                     @click="unLinkNode(item.id, item.type)">
            <md-icon class="md-accent">link_off</md-icon>
          </md-button>
        </md-list-item>
      </md-list>

    </div>

    <div class="state"
         v-else>
      <md-progress-spinner v-if="state === PAGES.loading"
                           md-mode="indeterminate"></md-progress-spinner>

      <md-icon class="md-size-5x"
               v-else>error</md-icon>
    </div>
  </div>
  <!-- </md-dialog-content> -->

  <!-- <md-dialog-actions>
      <md-button class="md-accent"
                 @click="closeDialog(false)">close</md-button>
    </md-dialog-actions> 
  </md-dialog>-->
</template>

<script>
const {
  spinalPanelManagerService,
} = require("spinal-env-viewer-panel-manager-service");

import endpointUtilities from "../../js/endpoint_utilities";

export default {
  name: "unlinkBmsNetworkToNodePanel",
  props: ["onFinised"],
  data() {
    this.PAGES = {
      loaded: 0,
      loading: 1,
      error: 2,
    };
    this.selectedNodeId;
    return {
      showDialog: true,
      state: this.PAGES.loading,
      nodes: [],
    };
  },
  mounted() {},

  methods: {
    opened({ id, name }) {
      this.state = this.PAGES.loading;
      this.selectedNodeId = id;

      this.getBmsNetworkNode(id)
        .then((result) => {
          this.setTitle(name);

          this.nodes = result;
          this.state = this.PAGES.loaded;
        })
        .catch((err) => {
          console.error(err);
          this.state = this.PAGES.error;
        });
    },

    closed(option) {},

    async getBmsNetworkNode(nodeId) {
      const children = await endpointUtilities.getBmsNodeLinked(nodeId);
      return children.map((child) => child.get());
    },

    unLinkNode(nodeId, nodeType) {
      this.state = this.PAGES.loading;
      return endpointUtilities
        .unLinkBmsNetworkToNode(this.selectedNodeId, nodeId, nodeType)
        .then(() => {
          this.nodes = this.nodes.filter((el) => el.id !== nodeId);
          this.state = this.PAGES.loaded;
        })
        .catch((err) => {
          console.error(err);
          this.state = this.PAGES.error;
        });
    },

    setTitle(title) {
      spinalPanelManagerService.panels.unlinkBmsNetworkToNode.panel.setTitle(
        `Unlink bmsNetwork to Node : ${title}`
      );
    },
  },
};
</script>

<style scoped>
._unLinkBmsPanelContent {
  width: 100%;
  height: calc(100% - 30px);
}

._unLinkBmsPanelContent .content {
  width: 100%;
  height: 100%;
}

._unLinkBmsPanelContent .content .list_content {
  max-height: calc(100% - 15px);
  overflow: auto;
}

._unLinkBmsPanelContent .content .list_content .item_type {
  color: grey;
}

._unLinkBmsPanelContent .state {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
}
</style>

<style>
._unLinkBmsPanelContent .md-list-item-content {
  width: calc(100% - 50px);
}
</style>