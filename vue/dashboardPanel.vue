
<template>
  <div class="dashboardPanelContent"
       :class="{viewerVSix : V6}"
       v-if="endpointsNode">
    <div class="md-layout dash_sidebar">
      <p class="md-layout-item md-size-60 sidebarText">
        NUMBER OF COLUMNS :
        <span>{{itemCountPerLine}}</span></p>

      <md-button class="md-layout-item md-size-15"
                 @click="changeItemCountPerLine('-1')">-1</md-button>
      <md-button class="md-layout-item md-size-15"
                 @click="changeItemCountPerLine('+1')">+1</md-button>
    </div>

    <md-content class="md-scrollbar _endpoint_div_content">
      <endpoint-component v-for="(endpoint, index) in endpointsNode"
                          :key="index"
                          :endpointNode="endpoint"
                          @selectEndpoint="selectNode(endpoint)"
                          :endpointSelected="endpointSelected"
                          :itemCount="itemCountPerLine"></endpoint-component>
    </md-content>
  </div>
</template>

<script>
import endpointComponent from "./endpointComponent.vue";
import { dashboardVariables } from "spinal-env-viewer-dashboard-standard-service";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { find } from "../find";
import {
  SpinalBmsEndpoint,
  SpinalBmsDevice,
  SpinalBmsEndpointGroup
} from "spinal-model-bmsnetwork";

// import geographicService from "spinal-env-viewer-context-geographic-service";

const MAX_PER_LINE = 5;
const MIN_PER_LINE = 1;

export default {
  name: "dashboard-panel",
  components: { endpointComponent },
  data() {
    return {
      endpointsNode: null,
      endpointSelected: null,
      itemCountPerLine: 3
    };
  },
  methods: {
    opened(option, viewer) {
      console.log(viewer);
      Promise.all(this.getEndpointsNode(option)).then(el => {
        this.endpointsNode = el[0]
          .concat(el[1])
          .filter(el => typeof el !== "undefined");
      });
    },
    closed() {},
    getEndpointsNode(node) {
      return [
        SpinalGraphService.getChildren(node.id.get(), [
          dashboardVariables.ENDPOINT_RELATION_NAME
        ]).then(el => {
          return el;
        }),
        find(
          node.id.get(),
          [
            "hasEndPoint",
            // dashboardVariables.ENDPOINT_RELATION_NAME,
            SpinalBmsDevice.relationName,
            SpinalBmsEndpoint.relationName,
            SpinalBmsEndpointGroup.relationName
          ],
          el => {
            return el.type.get() === SpinalBmsEndpoint.nodeTypeName;
          }
        )
      ];

      // if (node.type.get() !== geographicService.constants.EQUIPMENT_TYPE) {
      //   return SpinalGraphService.getChildren(node.id.get(), [
      //     dashboardVariables.ENDPOINT_RELATION_NAME
      //   ]).then(el => {
      //     return el;
      //   });
      // } else {
      // return find(
      //   node.id.get(),
      //   [
      //     "hasEndPoint",
      //     dashboardVariables.ENDPOINT_RELATION_NAME,
      //     SpinalBmsDevice.relationName,
      //     SpinalBmsEndpoint.relationName,
      //     SpinalBmsEndpointGroup.relationName
      //   ],
      //   el => {
      //     return el.type.get() === SpinalBmsEndpoint.nodeTypeName;
      //   }
      // );
      // }
    },
    selectNode(node) {
      this.endpointSelected = node;
    },
    changeItemCountPerLine: function(name) {
      if (name == "+1" && this.itemCountPerLine < MAX_PER_LINE) {
        this.itemCountPerLine += 1;
      } else if (name == "-1" && this.itemCountPerLine > MIN_PER_LINE) {
        this.itemCountPerLine -= 1;
      }
    }
  },
  computed: {
    V6() {
      return parseInt(window.LMV_VIEWER_VERSION) === 6;
    }
  }
};
</script>

<style scoped>
.dashboardPanelContent {
  width: calc(100%);
  height: calc(100%);
}
.dash_sidebar {
  border-bottom: 1px solid white;
  margin-bottom: 10px;
  height: 50px;
}

.dash_sidebar .sidebarText {
  padding-left: 5px;
  font-size: 15px;
}

.dash_sidebar .sidebarText span {
  color: red;
  font-size: 20px;
  margin-left: 5px;
  color: #f68204;
}

._endpoint_div_content {
  /* 60px = sidebarHeigth + marginBottom; 5px for hidden panel scrollbar */
  height: calc(100% - 65px);
  overflow: auto;
}

.dockingPanelScroll.right {
  overflow: hidden !important;
}

.viewerVSix ._endpoint_div_content {
  height: calc(100% - 75px);
}
</style>
