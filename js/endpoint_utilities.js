import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { BMS_ENDPOINT_RELATIONS, CONTROL_ENDPOINT_RELATIONS, hasControlEnpoint } from "./constants";
import { SpinalBmsEndpoint } from "spinal-model-bmsnetwork";

export const endpointsMap = new Map();

export default {
   
   getTreeStructure(nodeId) {
      return Promise.all([this.getEndpoints(nodeId),this.getControlEndpoints(nodeId)])
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

   getEndpoints(nodeId) {
      return SpinalGraphService.findNodesByType(nodeId, BMS_ENDPOINT_RELATIONS, SpinalBmsEndpoint.nodeTypeName)
               .then((endpoints) => {
                  return endpoints.map((el) => {
                     SpinalGraphService._addNode(el);
                     const id = el.getId().get();

                     return {
                        id ,
                        name : el.getName().get()
                     };
                  });
               })
               .catch((err) => {
                  console.log(err);
                  return [];
               });

   },

   async getControlEndpoints(nodeId) {

      const controlPoints = await SpinalGraphService.getChildren(nodeId,[hasControlEnpoint]);
      if(controlPoints.length === 0) return [];
      
      const promises = controlPoints.map(el => {
         return SpinalGraphService.findNodesByType(el.id.get(),CONTROL_ENDPOINT_RELATIONS,SpinalBmsEndpoint.nodeTypeName);
      })

      return Promise.all(promises).then((result) => {
         const endpoints = result.flat();
         return endpoints.map(endpoint => {
            SpinalGraphService._addNode(endpoint);
            return  {
               id : endpoint.getId().get(),
               name : endpoint.getName().get()
            };

         })
      }).catch((err) => {
         
      });
   }

}