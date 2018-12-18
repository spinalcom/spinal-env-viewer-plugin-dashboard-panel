
<template>
  <div>
    <div class="_endpoint_div_content">
      <endpoint-component v-for="(endpoint, index) in endpointsNode"
                          :key="index"
                          :endpointNode="endpoint"></endpoint-component>
    </div>
  </div>
</template>

<script>
import endpointComponent from "./endpointComponent.vue";
import utilities from "../getEndpoints";

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
        console.log(el);
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
    async getEndpointsNode(node) {
      let endpointsNode = await spinalNode.getChildren(ENDPOINT_RELATION_NAME);
      return endpointsNode;
    }
  }
};
</script>