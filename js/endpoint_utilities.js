import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { BMS_ENDPOINT_RELATIONS, CONTROL_ENDPOINT_RELATIONS } from "./constants";
import { SpinalBmsEndpoint } from "spinal-model-bmsnetwork";

export default {

   getTreeStructure(nodeId) {
      return Promise.all([this.getEndpoints(nodeId, BMS_ENDPOINT_RELATIONS),this.getEndpoints(nodeId, CONTROL_ENDPOINT_RELATIONS)])
               .then(([endpoints, controlPoints]) => {
                  return {
                     endpoints,
                     controlPoints
                  }
               })
               .catch(() => {
                  return {
                     endpoints : [],
                     controlPoints: []
                  }
               })
   },

   getEndpoints(nodeId, relations) {
      return SpinalGraphService.findNodesByType(nodeId, relations, SpinalBmsEndpoint.nodeTypeName)
               .then((endpoints) => {
                  return endpoints.map((el) => {
                     SpinalGraphService._addNode(el);
                     return SpinalGraphService.getInfo(el.getId().get());
                  });
               })
               .catch((err) => {
                  console.log(err);
                  return [];
               });
   }

}