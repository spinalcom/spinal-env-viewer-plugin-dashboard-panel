const {
  SpinalContextApp
} = require("spinal-env-viewer-context-menu-service");

const {
  spinalPanelManagerService
} = require("spinal-env-viewer-panel-manager-service");

import {
  SpinalGraphService
} from "spinal-env-viewer-graph-service";

import {
  dashboardVariables
} from "spinal-env-viewer-dashboard-standard-service";

import {
  SpinalBmsEndpoint,
  SpinalBmsDevice,
  SpinalBmsEndpointGroup
} from "spinal-model-bmsnetwork";

let hasEndPoint = "hasEndPoint";
let types = [SpinalBmsDevice.nodeTypeName, SpinalBmsEndpoint.nodeTypeName,
  SpinalBmsEndpointGroup
]
// import { Spina } from 'spinal-model-bmsNetwork';

class OpenDashboardPanel extends SpinalContextApp {
  constructor() {
    super("open in dashboard panel", "open dashboard", {
      icon: "dashboard",
      icon_type: "in",
      backgroundColor: "#FF0000",
      fontColor: "#FFFFFF"
    });
  }

  isShown(option) {
    return SpinalGraphService.getChildren(option.selectedNode.id.get(),
      [dashboardVariables.ENDPOINT_RELATION_NAME, hasEndPoint]).then(el => {
      let type = option.selectedNode.type.get();

      if (el.length > 0 || types.indexOf(type) !== -1) return true;
      return -1;
    })
  }

  action(option) {
    spinalPanelManagerService.openPanel(
      "spinal_dashboard_panel",
      option.selectedNode
    );
  }
}

module.exports = OpenDashboardPanel;