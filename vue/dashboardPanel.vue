
<template>
  <div v-if="endpointsNode">
    <div class="_endpoint_div_content">
      <endpoint-component v-for="(endpoint, index) in endpointsNode"
                          :key="index"
                          :endpointNode="endpoint"
                          @selectEndpoint="selectNode(endpoint)"
                          :endpointSelected="endpointSelected"></endpoint-component>
    </div>
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

import geographicService from "spinal-env-viewer-context-geographic-service";

export default {
  name: "dashboard-panel",
  components: { endpointComponent },
  data() {
    return {
      endpointsNode: null,
      endpointSelected: null
    };
  },
  methods: {
    opened(option, viewer) {
      this.getEndpointsNode(option).then(el => {
        this.endpointsNode = el;
      });
    },
    // removed(option, viewer) {
    //   console.log("removed option", option);
    //   console.log("removed viewer", viewer);
    // },
    closed() {},
    getEndpointsNode(node) {
      if (node.type.get() !== geographicService.constants.EQUIPMENT_TYPE) {
        console.log("if", node.type.get());
        return SpinalGraphService.getChildren(node.id.get(), [
          dashboardVariables.ENDPOINT_RELATION_NAME
        ]).then(el => {
          return el;
        });
      } else {
        console.log("else");
        return find(
          node.id.get(),
          [
            "hasEndPoint",
            SpinalBmsDevice.relationName,
            SpinalBmsEndpoint.relationName,
            SpinalBmsEndpointGroup.relationName
          ],
          el => {
            console.log(el.type.get());
            return el.type.get() === SpinalBmsEndpoint.nodeTypeName;
          }
        );
      }
    },
    selectNode(node) {
      this.endpointSelected = node;
    }
  }
};
</script>