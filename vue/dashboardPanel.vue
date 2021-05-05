
<template>
   <div
      class="dashboardPanelContent"
      :class="{viewerVSix : V6}"
      v-if="endpointsNode"
   >
      <div class="md-layout dash_sidebar">
         <p class="md-layout-item md-size-60 sidebarText">
            NUMBER OF COLUMNS :
            <span>{{itemCountPerLine}}</span>
         </p>

         <md-button
            class="md-layout-item md-size-15"
            @click="changeItemCountPerLine('-1')"
         >-1</md-button>
         <md-button
            class="md-layout-item md-size-15"
            @click="changeItemCountPerLine('+1')"
         >+1</md-button>
      </div>

      <md-content
         class="md-scrollbar _endpoint_div_content"
         v-if="pageSelected === PAGES.normal"
      >
         <endpoint-component
            v-for="(endpoint, index) in endpointsNode"
            :key="index"
            :endpointNode="endpoint"
            @selectEndpoint="selectNode(endpoint)"
            :endpointSelected="endpointSelected"
            :itemCount="itemCountPerLine"
            :viewer="viewer"
         ></endpoint-component>

         <div
            class="state"
            v-if="endpointsNode.length === 0"
         >
            <h3>No endpoint found !</h3>
         </div>
      </md-content>

      <md-content
         class="state"
         v-else-if="pageSelected === PAGES.loading"
      >
         <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
      </md-content>

      <md-content
         class="state"
         v-else-if="pageSelected === PAGES.error"
      >
         <md-icon class="md-size-4x">close</md-icon>
      </md-content>
   </div>
</template>

<script>
import endpointComponent from "./endpointComponent.vue";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { RELATION_NAMES } from "../js/constants";
import { SpinalBmsEndpoint } from "spinal-model-bmsnetwork";
const {
   spinalPanelManagerService,
} = require("spinal-env-viewer-panel-manager-service");

// import { spinalControlPointService } from "spinal-env-viewer-plugin-control-endpoint-service";
// import { dashboardVariables } from "spinal-env-viewer-dashboard-standard-service";
// import { SpinalBmsEndpoint, SpinalBmsDevice, SpinalBmsEndpointGroup } from "spinal-model-bmsnetwork";
// import geographicService from "spinal-env-viewer-context-geographic-service";
// import { find } from "../find";

const MAX_PER_LINE = 5;
const MIN_PER_LINE = 1;

export default {
   name: "dashboard-panel",
   components: { endpointComponent },
   data() {
      this.viewer;
      this.PAGES = {
         normal: 1,
         loading: 2,
         error: 3,
      };
      return {
         pageSelected: this.PAGES.normal,
         endpointsNode: null,
         endpointSelected: null,
         itemCountPerLine: 3,
      };
   },
   methods: {
      opened(option, viewer) {
         this.viewer = viewer;
         this.setTitle(option.name.get());
         this.pageSelected = this.PAGES.loading;

         this.getEndpointsNode(option)
            .then((endpoints) => {
               this.endpointsNode = endpoints;
               this.pageSelected = this.PAGES.normal;
            })
            .catch((err) => {
               this.pageSelected = this.PAGES.error;
            });
         //  Promise.all(this.getEndpointsNode(option)).then((el) => {
         //     this.endpointsNode = el[0]
         //        .concat(el[1])
         //        .filter((el) => typeof el !== "undefined");
         //  });
      },

      closed() {},

      getEndpointsNode(node) {
         return SpinalGraphService.findNodesByType(
            node.id.get(),
            RELATION_NAMES,
            SpinalBmsEndpoint.nodeTypeName
         )
            .then((endpoints) => {
               return endpoints.map((el) => {
                  SpinalGraphService._addNode(el);
                  return SpinalGraphService.getInfo(el.getId().get());
               });
            })
            .catch((err) => {
               console.log(err);
               return [];
            });
         //  return [
         //     SpinalGraphService.getChildren(node.id.get(), [
         //        dashboardVariables.ENDPOINT_RELATION_NAME,
         //     ]).then((el) => {
         //        return el;
         //     }),
         //     find(
         //        node.id.get(),
         //        [
         //           "hasEndPoint",
         //           // dashboardVariables.ENDPOINT_RELATION_NAME,
         //           SpinalBmsDevice.relationName,
         //           SpinalBmsEndpoint.relationName,
         //           SpinalBmsEndpointGroup.relationName,
         //           spinalControlPointService.ROOM_TO_CONTROL_GROUP,
         //        ],
         //        (el) => {
         //           return el.type.get() === SpinalBmsEndpoint.nodeTypeName;
         //        }
         //     ),
         //  ];
      },

      selectNode(node) {
         this.endpointSelected = node;
      },

      changeItemCountPerLine: function (name) {
         if (name == "+1" && this.itemCountPerLine < MAX_PER_LINE) {
            this.itemCountPerLine += 1;
         } else if (name == "-1" && this.itemCountPerLine > MIN_PER_LINE) {
            this.itemCountPerLine -= 1;
         }
      },

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
   width: 100%;
   height: 100%;
}

.dash_sidebar {
   border-bottom: 1px solid white;
   margin-bottom: 10px;
   height: 50px;
}

.dash_sidebar .sidebarText {
   padding-left: 5px;
   font-size: 15px;
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
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

.state {
   width: 100%;
   height: calc(100% - 65px);
   display: flex;
   justify-content: center;
   align-items: center;
}

.dockingPanelScroll.right {
   overflow: hidden !important;
}

.viewerVSix ._endpoint_div_content {
   height: calc(100% - 75px);
}
</style>
