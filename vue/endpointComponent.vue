<template>
  <div @click="selectEndpoint"
       :class=" {'endpointContent' : true, endpointSelected : isSelected()}"
       :style="style">
    <div v-if="endpoint"
         class="endpointDiv">
      <div class="name"
           v-tooltip="endpoint.name">
        {{endpoint.name}}
      </div>
      <div class="value"
           v-tooltip="'Value : ' + endpoint.currentValue + ' ' + endpoint.unit">
        <div class="currentValue">{{formatCurrentValue(endpoint.currentValue)}}</div>
        <div class="currentUnit">{{endpoint.unit}}</div>
      </div>

      <!-- <div class="typeInfo">
        <div class="type"
             v-tooltip="'type : ' + endpoint.type">
          <md-icon>category</md-icon>
          <span>{{endpoint.type}}</span>
        </div>
        <div class="reference"
             v-tooltip="'Reference : ' + endpoint.type"
             v-if="endpoint.ref">
          <md-icon>link</md-icon>
          <span>{{endpoint.ref}}</span>
        </div>
      </div> -->

      <div class="btnGroup"
           v-if="iconsItems.length <= 2">
        <md-button v-for="icon in iconsItems"
                   :key="icon.iconName"
                   class="md-icon-button md-dense"
                   :title="icon.title"
                   @click="icon.clickMethod">
          <md-icon class="endpointIcons">
            {{icon.iconName}}
          </md-icon>
        </md-button>
      </div>

      <div class="menuBtn"
           v-else>
        <md-menu md-size="medium"
                 :md-offset-x="127"
                 :md-offset-y="-36">
          <md-button class="md-icon-button md-dense"
                     title="open"
                     md-menu-trigger>
            <md-icon class="endpointIcons"> more_vert </md-icon>
          </md-button>

          <md-menu-content>
            <md-menu-item v-for="icon in iconsItems"
                          :key="icon.iconName"
                          @click="icon.clickMethod">
              <p>
                <md-icon class="endpointIcons">
                  {{icon.iconName}}
                </md-icon>
                &nbsp;
                {{icon.title}}
              </p>
            </md-menu-item>
          </md-menu-content>

        </md-menu>
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
  props: ["endpointNode", "endpointSelected", "itemCount"],
  data() {
    this.iconsItems = [
      {
        title: "open Graph Panel",
        clickMethod: this.openGraphPanel,
        iconName: "pie_chart"
      },
      {
        title: "config threshold",
        clickMethod: this.configThreshold,
        iconName: "low_priority"
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
      endpointToObject["type"] = endpoint.type.get();
      endpointToObject["ref"] = endpoint.referenceOf
        ? endpoint.referenceOf.get()
        : undefined;
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
    },
    configThreshold() {
      spinalPanelManagerService.openPanel(
        "thresholdConfigDialog",
        this.endpointNode
      );
    }
  },
  watch: {
    endpointNode: function() {
      this.endpointElement.unbind(this.endpointBinded);
      this.getEndpointValue();
    }
  },
  computed: {
    style() {
      return {
        width: `calc(100% / ${this.itemCount} - 24px)`
      };
    }
  }
};
</script>

<style scoped>
div .endpointContent {
  /* width: calc(100% / 3 - 24px); */
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

div .endpointContent .menuBtn {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: flex-end;
}

div .endpointContent .btnGroup .md-icon,
div .endpointContent .menuBtn .md-icon {
  width: 20px !important;
  height: 20px !important;
  font-size: 20px !important;
  margin-left: -13px;
}
</style>
