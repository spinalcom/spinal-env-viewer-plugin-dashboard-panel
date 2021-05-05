const { SpinalContextApp } = require("spinal-env-viewer-context-menu-service");
const { spinalPanelManagerService } = require("spinal-env-viewer-panel-manager-service");

import { SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";

import { TYPES, RELATION_NAMES } from "../js/constants";



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

      if (!(option.selectedNode instanceof SpinalNode)) {
        // SpinalGraphService._addNode(option.selectedNode);
        selectedNode = SpinalGraphService.getRealNode(option.selectedNode.id.get());
      }

      const selectType = selectedNode.getType().get();

      if (TYPES.indexOf(selectType) !== -1) {
        return Promise.resolve(true);
      }

      const nodeRelations = selectedNode.getRelationNames();

      const found = nodeRelations.find(el => RELATION_NAMES.indexOf(el) !== -1);

      return Promise.resolve(found ? true : -1);
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
