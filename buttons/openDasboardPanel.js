const {
  SpinalContextApp
} = require("spinal-env-viewer-context-menu-service");

const {
  spinalPanelManagerService
} = require("spinal-env-viewer-panel-manager-service");

import {
  dashboardService
} from "spinal-env-viewer-dashboard-standard-service";

class OpenDashboardPanel extends SpinalContextApp {
  constructor() {
    super("open dashboard", "open dashboard", {
      icon: "dashboard",
      icon_type: "in",
      backgroundColor: "#FF0000",
      fontColor: "#FFFFFF"
    });
  }

  isShown(option) {
    return Promise.resolve(true);
  }

  action(option) {
    spinalPanelManagerService.openPanel(
      "spinal_dashboard_panel",
      option.selectedNode
    );
  }
}

module.exports = OpenDashboardPanel;