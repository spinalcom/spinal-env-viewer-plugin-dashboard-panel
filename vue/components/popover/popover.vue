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
  <v-popover offset="16"
             @hide="setNormalMode">
    <md-button class="md-icon-button md-dense tooltip-target b3"
               title="Update">
      <md-icon class="endpointIcons">edit </md-icon>
    </md-button>

    <template slot="popover">
      <div class="endpoint_popover_container">
        <div class="popover-content"
             v-if="state === STATES.normal">
          <number-component v-if="type === TYPES.number"
                            :data="data"></number-component>
          <boolean-component v-else-if="type === TYPES.boolean"
                             :data="data"></boolean-component>
        </div>

        <div class="popover-content"
             v-else>
          <div class="state-content"
               v-if="state === STATES.processing">
            <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
          </div>

          <div class="state-content"
               v-else-if="state === STATES.error">
            <div>
              <md-icon class="error md-size-3x">close</md-icon>
            </div>
            <div class="error">error</div>
          </div>

          <div class="state-content"
               v-else-if="state === STATES.success">
            <div>
              <md-icon class="success md-size-3x">check</md-icon>
            </div>
            <div class="success">Edited with Success</div>
          </div>
        </div>

        <div class="actions">
          <md-button v-close-popover
                     class="md-dense md-accent">
            Close
          </md-button>

          <md-button class="md-dense md-primary"
                     :disabled="state !== STATES.normal"
                     @click="update">Update</md-button>
        </div>
      </div>
    </template>
  </v-popover>
</template>

<script>
import booleanComponent from "./boolean.vue";
import numberComponent from "./number.vue";

export default {
  name: "popoverComponent",
  components: {
    "boolean-component": booleanComponent,
    "number-component": numberComponent,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    defaultValue: Number | Boolean | String,
  },

  data() {
    this.TYPES = {
      string: 0,
      boolean: 1,
      number: 2,
    };

    this.STATES = {
      normal: 1,
      processing: 2,
      success: 3,
      error: 4,
    };

    return {
      data: {
        value: undefined,
      },
      type: undefined,
      state: this.STATES.normal,
    };
  },
  mounted() {
    this.data.value = this.defaultValue;
    this.type = this.TYPES[typeof this.data.value];
    this.state = this.STATES.normal;
  },
  methods: {
    update() {
      this.state = this.STATES.processing;
      this.$emit("update", this.data.value);
    },

    setNormalMode() {
      this.state = this.STATES.normal;
    },

    setProcessingMode() {
      this.state = this.STATES.processing;
    },

    setSuccessMode() {
      this.state = this.STATES.success;
    },

    setErrorMode() {
      this.state = this.STATES.error;
    },
  },
  watch: {
    defaultValue() {
      this.data.value = this.defaultValue;
      this.type = this.TYPES[typeof this.data.value];
    },
  },
};
</script>

<style scoped>
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

.endpoint_popover_container .popover-content .state-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.endpoint_popover_container .popover-content .state-content .success {
  color: rgb(37, 216, 37);
}

.endpoint_popover_container .popover-content .state-content .error {
  color: #ff5252;
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
</style>

<style>
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
