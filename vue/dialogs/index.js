import vue from "vue";

import ConfirmDialog from "./confirmDialog.vue";

const {
  SpinalMountExtention,
} = require("spinal-env-viewer-panel-manager-service");

const dialogs = [
  {
    name: "deleteEndpointDialog",
    vueMountComponent: vue.extend(ConfirmDialog),
    parentContainer: document.body,
  },
];

for (let index = 0; index < dialogs.length; index++) {
  SpinalMountExtention.mount(dialogs[index]);
}
