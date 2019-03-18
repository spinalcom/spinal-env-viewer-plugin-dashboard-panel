import vue from "vue";
import dashboardPanel from "./vue/dashboardPanel.vue";
import OpenDasboardPanel from "./buttons/openDasboardPanel";

const sidebarName = "GraphManagerSideBar";
const {
  SpinalForgeExtention
} = require("spinal-env-viewer-panel-manager-service_spinalforgeextention");
const {
  spinalContextMenuService
} = require("spinal-env-viewer-context-menu-service");




spinalContextMenuService.registerApp(sidebarName, new OpenDasboardPanel(), [7]);



/*** Register Panel */

const dashboardExtension = SpinalForgeExtention.createExtention({
  name: "spinal_dashboard_panel",
  vueMountComponent: vue.extend(dashboardPanel),
  panel: {
    title: "Dashboard",
    classname: "spinal_dashboard_panel",
    closeBehaviour: "hide"
  },
  style: {
    left: "400px"
  }
});

SpinalForgeExtention.registerExtention("spinal_dashboard_panel",
  dashboardExtension);