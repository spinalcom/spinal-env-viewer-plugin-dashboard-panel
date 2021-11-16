const { SpinalContextApp } = require("spinal-env-viewer-context-menu-service");
const {
  spinalPanelManagerService,
} = require("spinal-env-viewer-panel-manager-service");

import {
  SpinalGraphService,
  SpinalNode,
} from "spinal-env-viewer-graph-service";

const {
  spinalContextMenuService,
} = require("spinal-env-viewer-context-menu-service");

import { TYPES, BMS_ENDPOINT_RELATIONS } from "../js/constants";

const SIDEBAR_HOOK_NAME = "GraphManagerSideBar";

class UnLinkBmsNetwork extends SpinalContextApp {
  constructor() {
    super("unlink bmsNetwork node", "unlink bmsNetwork node", {
      icon: "highlight_remove",
      icon_type: "in",
      backgroundColor: "#FF0000",
      fontColor: "#FFFFFF",
    });
  }

  isShown(option) {
    const type = option.selectedNode.type.get();

    if (TYPES.indexOf(type) !== -1) {
      return Promise.resolve(true);
    }
    const id = option.selectedNode.id.get();
    const realNode = SpinalGraphService.getRealNode(id);

    const nodeRelations = realNode.getRelationNames();

    const found = nodeRelations.find(
      (el) => BMS_ENDPOINT_RELATIONS.indexOf(el) !== -1
    );

    return Promise.resolve(found ? true : -1);
  }

  action(option) {
    // let selectedNode = option.selectedNode;
    // if (option.selectedNode instanceof SpinalNode) {
    //   SpinalGraphService._addNode(option.selectedNode);
    //   selectedNode = SpinalGraphService.getInfo(option.selectedNode.getId());
    // }

    spinalPanelManagerService.openPanel(
      "unlinkBmsNetworkToNode",
      option.selectedNode.get()
    );
  }
}

const unLinkBmsNetwork = new UnLinkBmsNetwork();

spinalContextMenuService.registerApp(SIDEBAR_HOOK_NAME, unLinkBmsNetwork, [3]);

export { unLinkBmsNetwork };
export default unLinkBmsNetwork;
