import vue from "vue";
import dashboardPanel from "./dashboardPanel.vue";
const { SpinalForgeExtention } = require("spinal-env-viewer-panel-manager-service_spinalforgeextention");


const panels = [
   {
      name: "spinal_dashboard_panel",
      vueMountComponent: vue.extend(dashboardPanel),
      panel: {
        title: "Dashboard",
        classname: "spinal_dashboard_panel",
        closeBehaviour: "hide"
      },
      style: {
        width: '600px',
        height: '500px',
        "min-width": "600px",
        left: "400px"
      }
    }
]


for (const data of panels) {
   const extension = SpinalForgeExtention.createExtention(data);
   SpinalForgeExtention.registerExtention(data.name, extension);
}

// SpinalForgeExtention.createExtention();



