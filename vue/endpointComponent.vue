

<template>
  <div class="endpointContent">
    <div v-if="endpoint"
         class="endpointDiv">
      <div class="name"
           :title="endpoint.name">
        {{endpoint.name}}
      </div>
      <div class="value"
           :title="endpoint.currentValue">
        <div class="currentValue">{{endpoint.currentValue}}</div>
        <div class="currentUnit">{{endpoint.unit}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "endpointComponent",
  props: ["endpointNode"],
  data() {
    return {
      endpoint: null
    };
  },
  mounted() {
    this.getEndpointValue();
  },
  methods: {
    async getEndpointValue() {
      if (this.endpointNode) {
        let endpointElement = await this.endpointNode.getElement();

        endpointElement.bind(() => {
          this.endpoint = this.getEndpointDetail(endpointElement);
        });
      }
    },
    getEndpointDetail(endpoint) {
      console.log(endpoint);
      var endpointToObject = {};

      endpointToObject["id"] = endpoint.id.get();
      endpointToObject["name"] = endpoint.name.get();
      endpointToObject["path"] = endpoint.path.get();
      endpointToObject["min"] = endpoint.seuilMin.get();
      endpointToObject["max"] = endpoint.seuilMax.get();
      endpointToObject["unit"] = endpoint.unit.get();
      endpointToObject["type"] = endpoint.dataType.get();
      endpointToObject["currentValue"] = endpoint.currentValue.get();

      return endpointToObject;
    }
  },
  watch: {
    endpointNode: function() {
      this.getEndpointValue();
    }
  }
};
</script>

<style>
div .endpointContent {
  width: calc(100% / 3 - 24px);
  height: 130px;
  display: inline-block;
  justify-content: center;
  padding: 7px;
  margin: 5px;
  background: #242424;
}

div .endpointContent .endpointDiv .name {
  width: 100%;
  height: 20%;
  text-align: center;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bold;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

div .endpointContent .endpointDiv .value {
  width: 100%;
  height: 50%;
  min-height: 20px;
  color: #f68204;
  align-items: center;
  padding-top: 8px;
  text-align: center;
  text-transform: uppercase;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

div .endpointContent .endpointDiv .value .currentValue {
  font-size: 25px;
}

div .endpointContent .endpointDiv .value .currentUnit {
  text-align: right;
  font-size: 10px;
}
</style>
