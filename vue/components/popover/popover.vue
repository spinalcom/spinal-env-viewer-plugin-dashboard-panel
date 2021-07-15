<template>
   <v-popover offset="16">
      <md-button
         class="md-icon-button md-dense tooltip-target b3"
         title="Update">
         <md-icon class="endpointIcons">
            settings
         </md-icon>
      </md-button>

      <template slot="popover">
         <div class="endpoint_popover_container">
            <div class="popover-content" v-if="state === STATES.normal">
               <number-component  v-if="type === TYPES.number" :data="data" ></number-component>
               <boolean-component v-else-if="type === TYPES.boolean" :data="data"></boolean-component>
            </div>

            <div class="popover-content" v-else>
               <div v-if="state === STATES.processing">Processing...</div>
               <div v-else-if="state === STATES.error">Error</div>
               <div v-else-if="state === STATES.success">Success</div>
            </div>
                       

            <!-- <div class="popover-content"
               >
               isBool
            </div> -->

            <div class="actions">
               <!-- <a class="btn"
                  v-close-popover >Close</a>
               <a class="btn" :disabled="state !== STATES.normal"
                  @click="update">Save</a> -->
                  <md-button v-close-popover class="md-dense md-accent">Close</md-button>
                  <md-button class="md-dense md-primary" :disabled="state !== STATES.normal" @click="update">Update</md-button>
            </div>
         </div>

      </template>
   </v-popover>
</template>

<script>
import utilities from "../../../js/utilities";
import { SpinalPilotModel, STATES } from "spinal-model-bacnet";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";

import booleanComponent from "./boolean.vue";
import numberComponent from "./number.vue";

export default {
   name : "popoverComponent",
   components : {
      "boolean-component": booleanComponent,
      "number-component": numberComponent
   },
   props: {
      show: {
         type: Boolean,
         default: false,
      },
      endpoint: {},
      endpointElement: {},
      endpointNode: {},
   },
   
   data() {
      this.TYPES = {
         string : 0,
         boolean : 1,
         number: 2
      }

      this.STATES = {
         normal: 1,
         processing : 2,
         success : 3,
         error : 4
      }

      return {
         data : {
            value: undefined,
         },
         type: undefined,
         state: this.STATES.normal
         // isBoolean: false,
      };
   },
   mounted() {
      // if (typeof this.endpoint.currentValue === "boolean") {
      //    // this.isBoolean = true;
      //    this.type
      //    this.value = this.endpoint.currentValue;
      // } else if (
      //    typeof this.endpoint.currentValue === "string" ||
      //    (typeof this.endpoint.currentValue === "number" &&
      //       !isNaN(this.endpoint.currentValue))
      // ) {
      //    this.isBoolean = false;
      // }
      this.data.value = this.endpoint.currentValue;
      this.type = this.TYPES[typeof this.data.value];
   },
   methods: {
      async update() {
         const id = this.endpointNode.id.get();

         const [organNode] = await utilities.getEndpointOrgan(id);
         const devices = await utilities.getDevices(id);

         if (organNode && devices && devices.length > 0) {
            const organ = await organNode.getElement();
            if (organ) {

               const requests = devices.map((device) => {
                  return {
                     address: device.info.address && device.info.address.get(),
                     deviceId:
                        device.info.idNetwork && device.info.idNetwork.get(),
                     objectId: {
                        type: this.endpointElement.typeId.get(),
                        instance: this.endpointElement.id.get(),
                     },
                     value: this.data.value,
                  };
               });

               const spinalPilot = new SpinalPilotModel(organ, requests);
               const endpointNode = SpinalGraphService.getRealNode(id);
               spinalPilot.addToNode(endpointNode);

               this.bindState(spinalPilot)
               
            } else {
               this.endpointElement.currentValue.set(this.data.value);
            }
         }
      },

      bindState(spinalPilot) {
         spinalPilot.state.bind(async () => {
            switch (spinalPilot.state.get()) {
               case "process":
                  this.state = this.STATES.processing;
                  break;
               case "success":
                  this.state = this.STATES.success;
                  this.endpointElement.currentValue.set(this.data.value);
                  await spinalPilot.removeToNode();
                  break;
               case "error":
                  this.state = this.STATES.error;
                  await spinalPilot.removeToNode();
                  break;
            
               default:
                  break;
            }
         })
      }
   },
};
</script>

<style scoped>

</style>

<style>
.endpoint_popover_container {
   width: 200px;
   height: 150px;
   pointer-events: all;
}

.endpoint_popover_container .popover-content {
   width: 100%;
   height: calc(100% - 30px);
   color: white;
   display: flex;
   flex-direction: column;
   justify-content: space-around;
}

.endpoint_popover_container .popover-content .md-field {
   min-height: unset !important;
   margin: unset !important;
}

.endpoint_popover_container .popover-content .slider {
   width: 100%;
   margin-top: 10px;
}

.endpoint_popover_container .actions {
   width: 100%;
   height: 30px;
   display: flex;
   justify-content: space-between;
   align-items: center;
}

/* .endpoint_popover_container .actions .btn {
   cursor: pointer;
} */

/*
////////////////////////////////////////////////////////
////                    Slider CSS                    //
////////////////////////////////////////////////////////
*/

/* component style */
.vue-slider-disabled {
   opacity: 0.5;
   cursor: not-allowed;
}

/* rail style */
.vue-slider-rail {
   background-color: #ccc;
   border-radius: 15px;
}

/* process style */
.vue-slider-process {
   background-color: #3498db;
   border-radius: 15px;
}

/* mark style */
.vue-slider-mark {
   z-index: 4;
}
.vue-slider-mark:first-child .vue-slider-mark-step,
.vue-slider-mark:last-child .vue-slider-mark-step {
   display: none;
}
.vue-slider-mark-step {
   width: 100%;
   height: 100%;
   border-radius: 50%;
   background-color: rgba(0, 0, 0, 0.16);
}
.vue-slider-mark-label {
   font-size: 14px;
   white-space: nowrap;
}
/* dot style */
.vue-slider-dot-handle {
   cursor: pointer;
   width: 100%;
   height: 100%;
   border-radius: 50%;
   background-color: #fff;
   box-sizing: border-box;
   box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32);
}
.vue-slider-dot-handle-focus {
   box-shadow: 0px 0px 1px 2px rgba(52, 152, 219, 0.36);
}

.vue-slider-dot-handle-disabled {
   cursor: not-allowed;
   background-color: #ccc;
}

.vue-slider-dot-tooltip-inner {
   font-size: 14px;
   white-space: nowrap;
   padding: 2px 5px;
   min-width: 20px;
   text-align: center;
   color: #fff;
   border-radius: 5px;
   border-color: #3498db;
   background-color: #3498db;
   box-sizing: content-box;
}
.vue-slider-dot-tooltip-inner::after {
   content: "";
   position: absolute;
}
.vue-slider-dot-tooltip-inner-top::after {
   top: 100%;
   left: 50%;
   transform: translate(-50%, 0);
   height: 0;
   width: 0;
   border-color: transparent;
   border-style: solid;
   border-width: 5px;
   border-top-color: inherit;
}
.vue-slider-dot-tooltip-inner-bottom::after {
   bottom: 100%;
   left: 50%;
   transform: translate(-50%, 0);
   height: 0;
   width: 0;
   border-color: transparent;
   border-style: solid;
   border-width: 5px;
   border-bottom-color: inherit;
}
.vue-slider-dot-tooltip-inner-left::after {
   left: 100%;
   top: 50%;
   transform: translate(0, -50%);
   height: 0;
   width: 0;
   border-color: transparent;
   border-style: solid;
   border-width: 5px;
   border-left-color: inherit;
}
.vue-slider-dot-tooltip-inner-right::after {
   right: 100%;
   top: 50%;
   transform: translate(0, -50%);
   height: 0;
   width: 0;
   border-color: transparent;
   border-style: solid;
   border-width: 5px;
   border-right-color: inherit;
}

.vue-slider-dot-tooltip-wrapper {
   opacity: 0;
   transition: all 0.3s;
}
.vue-slider-dot-tooltip-wrapper-show {
   opacity: 1;
}

/*# sourceMappingURL=default.css.map */
</style>