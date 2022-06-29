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
  <div class="endpointDiv"
       :class="{ selected: isSelected }"
       @click="selectEndpoint"
       v-if="endpoint">
    <div class="name"
         v-tooltip="endpoint.name">{{ endpoint.name }}</div>
    <div class="values">
      <div class="value"
           v-tooltip="endpoint.currentValue">
        {{ endpoint.currentValue | formatValue }}
      </div>

      <div class="unit"
           v-tooltip="endpoint.unit">
        {{ endpoint.unit | formatUnit }}
      </div>
    </div>

    <div class="btnGroup">
      <template v-if="iconsItems.length < 3">
        <md-button v-for="icon in iconsItems"
                   :key="icon.iconName"
                   class="md-icon-button md-dense"
                   :title="icon.title"
                   @click="icon.clickMethod">
          <md-icon class="endpointIcons">
            {{ icon.iconName }}
          </md-icon>
        </md-button>
      </template>
      <popover-component ref="popover"
                         :defaultValue="endpoint.currentValue"
                         @update="update"></popover-component>
      <template v-if="iconsItems.length >= 3">
        <md-menu md-size="small">
          <md-button md-menu-trigger
                     class="md-icon-button">
            <md-icon>more_vert</md-icon>
          </md-button>

          <md-menu-content>
            <md-menu-item v-for="icon in iconsItems"
                          class="endpointMenuItem"
                          :key="icon.iconName"
                          :title="icon.title"
                          @click="icon.clickMethod">
              <md-icon class="endpointIcons">
                {{ icon.iconName }}
              </md-icon>
              {{icon.title}}
            </md-menu-item>
          </md-menu-content>
        </md-menu>

        <!-- <md-button v-for="icon in iconsItems"
                   :key="icon.iconName"
                   class="md-icon-button md-dense"
                   :title="icon.title"
                   @click="icon.clickMethod">
          <md-icon class="endpointIcons">
            {{ icon.iconName }}
          </md-icon>
        </md-button> -->
      </template>

    </div>
  </div>

  <div class="endpointDiv loading"
       v-else>
    <md-progress-spinner md-mode="indeterminate"> </md-progress-spinner>
  </div>
</template>

<script>
const {
  spinalPanelManagerService,
} = require("spinal-env-viewer-panel-manager-service");

import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import pilotageUtilities from "../../../js/pilotage_utilities";
import PopoverComponent from "../popover/popover.vue";

export default {
  name: "endpoint-component",
  props: ["endpointId", "endpointSelected"],
  components: {
    "popover-component": PopoverComponent,
  },
  data() {
    this.iconsItems = [
      {
        title: "open Graph Panel",
        clickMethod: this.openGraphPanel,
        iconName: "show_chart",
      },
      {
        title: "Documentation",
        clickMethod: this.openDocumentationPanel,
        iconName: "folder",
      },
      {
        title: "Delete",
        clickMethod: this.deleteEndpoint,
        iconName: "delete",
      },
    ];
    this.bindId;

    return {
      endpointElement: null,
      endpointNode: null,
      endpoint: {},
    };
  },
  async mounted() {
    this.endpointNode = SpinalGraphService.getRealNode(this.endpointId);
    this.endpointElement =
      this.endpointNode && (await this.endpointNode.getElement());

    this.bindEndpointElement();
  },
  methods: {
    selectEndpoint() {
      this.$emit("select", this.endpointId);
    },

    openGraphPanel() {
      spinalPanelManagerService.openPanel("endpoint_chart_viewer", {
        selectedNode: SpinalGraphService.getInfo(this.endpointId),
      });
    },

    openDocumentationPanel() {
      let realNode = SpinalGraphService.getRealNode(this.endpointId);
      let paramSent = {
        selectedNode: realNode,
        info: realNode.info,
      };
      paramSent.selectedNode.id = realNode.info.id;
      spinalPanelManagerService.openPanel("panel-documentation", paramSent);
    },

    bindEndpointElement() {
      this.bindId = this.endpointElement.bind(() => {
        this.endpoint = this.endpointElement.get();
      });
    },

    async update(value) {
      const p = this.$refs["popover"];
      const popovers = Array.isArray(p) ? p : [p];

      try {
        const id = this.endpointId;
        const spinalPilot = await pilotageUtilities.sendUpdateRequest(
          id,
          this.endpointNode,
          value
        );
        if (spinalPilot) {
          this.bindState(spinalPilot, popovers, value);
        } else {
          this.endpointElement.currentValue.set(value);
        }
      } catch (error) {
        console.error(error);
        popovers.map((el) => el.setErrorMode());
      }
    },

    bindState(spinalPilot, popovers, value) {
      const bindId = spinalPilot.state.bind(async () => {
        switch (spinalPilot.state.get()) {
          case "success":
            this.endpointElement.currentValue.set(value);
            popovers.map((el) => el.setSuccessMode());
            spinalPilot.state.unbind(bindId);
            await spinalPilot.removeToNode();
            break;
          case "error":
            popovers.map((el) => el.setErrorMode());
            spinalPilot.state.unbind(bindId);
            await spinalPilot.removeToNode();
            break;

          default:
            break;
        }
      });
    },

    deleteEndpoint() {
      spinalPanelManagerService.openPanel("deleteEndpointDialog", {
        title: "This endpoint will be removed from graph",
        message: "You won't be able to revert this!",
        callback: async () => {
          await SpinalGraphService.removeFromGraph(this.endpointId);
          this.$emit("removed", this.endpointId);
        },
      });
    },
  },
  computed: {
    isSelected() {
      return this.endpointSelected === this.endpointId;
    },
  },
  filters: {
    formatValue(argCurrentValue) {
      var argCurrentValueNumber = Number(argCurrentValue);
      if (
        !isNaN(argCurrentValueNumber) &&
        !Number.isInteger(argCurrentValueNumber)
      )
        return Number(argCurrentValue).toFixed(2);
      return argCurrentValue;
    },

    formatUnit(argUnit) {
      return argUnit && argUnit.length > 0 ? argUnit : "-";
    },
  },

  beforeDestroy() {
    if (this.endpointElement) this.endpointElement.unbind(this.bindId);
  },
};
</script>

<style scoped>
.endpointDiv {
  width: 95%;
  height: 95%;
  padding: 7px;
  border: 1px solid #fff;
  /* background: #000; */
}

.endpointDiv.loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.endpointDiv:hover {
  cursor: pointer;
}

.endpointDiv.selected {
  background: #356bab !important;
}

.endpointDiv .name {
  width: 100%;
  height: 20%;
  text-align: center;
  font-size: 1em;
  text-transform: uppercase;
  font-weight: bold;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.endpointDiv .values {
  width: 100%;
  height: 50%;
  color: #f68204;
  text-transform: uppercase;
}

.endpointDiv .values .value {
  width: 70%;
  height: 60%;
  margin: auto;
  padding-top: 7px;
  font-size: 1.9em;
  align-items: center;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.endpointDiv .values .unit {
  width: 50%;
  height: 40%;
  float: right;
  text-align: right;
  font-size: 0.9em;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.endpointDiv .btnGroup {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>

<style>
.endpointDiv .btnGroup .md-button .md-ripple {
  padding: unset !important;
}

.endpointMenuItem .md-list-item-content.md-ripple {
  justify-content: unset !important;
}
</style>
