
<template>
  <div @click="selectEndpoint"
       :class=" {'endpointContent' : true, endpointSelected : isSelected()}">
    <div v-if="endpoint"
         class="endpointDiv">
      <div class="name"
           :title="endpoint.name">
        {{endpoint.name}}
      </div>
      <div class="value"
           :title="endpoint.currentValue">
        <div class="currentValue">{{formatCurrentValue(endpoint.currentValue)}}</div>
        <div class="currentUnit">{{endpoint.unit}}</div>
      </div>
      <div class="btnGroup">
        <md-button v-for="icon in iconsItems"
                   :key="icon.iconName"
                   class="md-icon-button md-dense"
                   :title="icon.title"
                   @click="icon.clickMethod">
          <md-icon>
            {{icon.iconName}}
          </md-icon>
        </md-button>
      </div>
    </div>

  </div>
</template>

<script>
const {
  spinalPanelManagerService
} = require("spinal-env-viewer-panel-manager-service");

export default {
  name: "endpointComponent",
  props: ["endpointNode", "endpointSelected"],
  data() {
    this.iconsItems = [
      {
        title: "open Graph Panel",
        clickMethod: this.openGraphPanel,
        iconName: "pie_chart"
      }
    ];

    return {
      endpoint: null,
      endpointBinded: null,
      endpointElement: null
    };
  },
  mounted() {
    this.getEndpointValue();
  },
  methods: {
    async getEndpointValue() {
      if (this.endpointNode) {
        this.endpointElement = await this.endpointNode.element.load();

        this.endpointBinded = this.endpointElement.bind(() => {
          this.endpoint = this.getEndpointDetail(this.endpointElement);
        });
      }
    },
    getEndpointDetail(endpoint) {
      var endpointToObject = {};
      endpointToObject["id"] = endpoint.id.get();
      endpointToObject["name"] = endpoint.name.get();
      endpointToObject["unit"] = endpoint.unit.get();
      endpointToObject["type"] = endpoint.dataType.get();
      endpointToObject["currentValue"] = endpoint.currentValue.get();
      return endpointToObject;
    },
    formatCurrentValue: function(argCurrentValue) {
      var argCurrentValueNumber = Number(argCurrentValue);
      if (
        !isNaN(argCurrentValueNumber) &&
        !Number.isInteger(argCurrentValueNumber)
      )
        return Number(argCurrentValue).toFixed(2);
      return argCurrentValue;
    },
    selectEndpoint: function() {
      this.$emit("selectEndpoint", this.endpointNode);
    },
    isSelected() {
      return (
        this.endpointNode &&
        this.endpointSelected &&
        this.endpointNode.id.get() === this.endpointSelected.id.get()
      );
    },
    openGraphPanel() {
      spinalPanelManagerService.openPanel("endpoint_chart_viewer", {
        selectedNode: this.endpointNode
      });
    }
  },
  watch: {
    endpointNode: function() {
      this.endpointElement.unbind(this.endpointBinded);
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
  margin: 4px;
  border: 1px solid;
}

div .endpointSelected {
  background: #356bab !important;
}

div .endpointContent:hover {
  cursor: pointer;
}

div .endpointContent .endpointDiv {
  width: calc(100%);
  height: calc(100%);
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

div .endpointContent .btnGroup {
  width: 100%;
  height: 20%;
}

div .endpointContent .btnGroup .md-icon {
  width: 20px !important;
  height: 20px !important;
  font-size: 20px !important;
}
</style>
