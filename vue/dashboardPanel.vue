
<template>
  <div v-if="endpointsNode">
    <div class="_endpoint_div_content">
      <endpoint-component v-for="(endpoint, index) in endpointsNode"
                          :key="index"
                          :endpointNode="endpoint"></endpoint-component>
    </div>
  </div>
</template>

<script>
import endpointComponent from "./endpointComponent.vue";
import { dashboardVariables } from "spinal-env-viewer-dashboard-standard-service";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";

export default {
  name: "dashboard-panel",
  components: { endpointComponent },
  data() {
    return {
      endpointsNode: null
    };
  },
  methods: {
    opened(option, viewer) {
      this.getEndpointsNode(option).then(el => {
        this.endpointsNode = el;
      });
    },
    removed(option, viewer) {
      console.log("removed option", option);
      console.log("removed viewer", viewer);
    },
    closed(option, viewer) {
      console.log("closed option", option);
      console.log("closed viewer", viewer);
    },
    getEndpointsNode(node) {
      return SpinalGraphService.getChildren(node.id.get(), [
        dashboardVariables.ENDPOINT_RELATION_NAME
      ]).then(el => {
        return el;
      });
    }
  }
};
</script>