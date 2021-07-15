import { SpinalGraphService } from "spinal-env-viewer-graph-service"
import { SpinalBmsNetwork, SpinalBmsDevice, SpinalBmsEndpoint, SpinalBmsEndpointGroup } from "spinal-model-bmsnetwork";
import { BACNET_ORGAN_TYPE } from 'spinal-model-bacnet';

export default {
   getEndpointOrgan(endpointNodeId) {
      return this.findParents(endpointNodeId, [SpinalBmsNetwork.relationName, SpinalBmsDevice.relationName, SpinalBmsEndpoint.relationName, SpinalBmsEndpointGroup.relationName], (node => {
         if (node.getType().get() === BACNET_ORGAN_TYPE) {
            SpinalGraphService._addNode(node);
            return true;
         }
         return false;
      }))
   },

   getDevices(endpointNodeId) {
      return this.findParents(endpointNodeId, [SpinalBmsDevice.relationName, SpinalBmsEndpoint.relationName, SpinalBmsEndpointGroup.relationName], (node => {
         if (node.getType().get() === SpinalBmsDevice.nodeTypeName) {
            SpinalGraphService._addNode(node);
            return true;
         }
         return false;
      }))
   },

   filterContextIdsByType(contextIds, type) {
      return contextIds.filter(id => {
         const info = SpinalGraphService.getInfo(id)
         if (info && info.type.get() === type) return true;
         return false;
      })
   },

   async findParents(startId, relations, predicate) {
      if (typeof predicate !== 'function') {
         throw new Error('The predicate function must be a function');
      }
      const startNode = SpinalGraphService.getRealNode(startId);
      if (startNode) {
         const seen = new Set([startNode]);
         let promises = [];
         let nextGen = [startNode];
         let currentGen = [];
         const found = [];
         while (nextGen.length) {
            currentGen = nextGen;
            promises = [];
            nextGen = [];
            for (const node of currentGen) {
               promises.push(node.getParents(relations));
               if (predicate(node)) {
                  found.push(node);
               }
            }
            const parentArrays = await Promise.all(promises);
            for (const parents of parentArrays) {
               for (const parent of parents) {
                  if (parent) {
                     if (!seen.has(parent)) {
                        nextGen.push(parent);
                        seen.add(parent);
                     }
                  }

               }
            }
         }

         return found;
      }

      return []
   }
}