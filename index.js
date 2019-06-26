import vue from "vue";
import dashboardPanel from "./vue/dashboardPanel.vue";
import OpenDasboardPanel from "./buttons/openDasboardPanel";

const sidebarName = "GraphManagerSideBar";
const circularMenuHookname = "circularMenu";
const {
  SpinalForgeExtention
} = require("spinal-env-viewer-panel-manager-service_spinalforgeextention");
const {
  spinalContextMenuService
} = require("spinal-env-viewer-context-menu-service");




spinalContextMenuService.registerApp(sidebarName, new OpenDasboardPanel(), [7]);
spinalContextMenuService.registerApp(circularMenuHookname,
  new OpenDasboardPanel(), [7]);


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
    width: '30vh',
    height: '50vh',
    "min-width": "460px",
    left: "400px"
  }
});

SpinalForgeExtention.registerExtention("spinal_dashboard_panel",
  dashboardExtension);


import "./alarm_manager/bindEndpoint";
