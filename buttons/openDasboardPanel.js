const {
  SpinalContextApp
} = require("spinal-env-viewer-context-menu-service");

const {
  spinalPanelManagerService
} = require("spinal-env-viewer-panel-manager-service");

import {
  SpinalGraphService,
  SpinalNode
} from "spinal-env-viewer-graph-service";

import {
  dashboardVariables
} from "spinal-env-viewer-dashboard-standard-service";

import {
  SpinalBmsEndpoint,
  SpinalBmsDevice,
  SpinalBmsEndpointGroup
} from "spinal-model-bmsnetwork";
// import SpinalNode from "spinal-model-graph/build/Nodes/SpinalNode";

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
    if (option.exist || option.selectedNode) {
      let selectedNode = option.selectedNode;

      if (option.selectedNode instanceof SpinalNode) {
        SpinalGraphService._addNode(option.selectedNode);
        selectedNode = SpinalGraphService.getInfo(option.selectedNode
          .getId());
      }
      return SpinalGraphService.getChildren(selectedNode.id.get(),
        [dashboardVariables.ENDPOINT_RELATION_NAME, hasEndPoint]).then(
        el => {
          let type = selectedNode.type.get();

          if (el.length > 0 || types.indexOf(type) !== -1) return true;
          return -1;
        })
    } else {
      return Promise.resolve(-1);
    }

  }

  action(option) {
    let selectedNode = option.selectedNode;
    if (option.selectedNode instanceof SpinalNode) {
      SpinalGraphService._addNode(option.selectedNode);
      selectedNode = SpinalGraphService.getInfo(option.selectedNode.getId());
    }

    spinalPanelManagerService.openPanel(
      "spinal_dashboard_panel",
      selectedNode
    );
  }
}

module.exports = OpenDashboardPanel;
