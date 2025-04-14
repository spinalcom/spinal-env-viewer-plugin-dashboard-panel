import { SpinalGraphService } from "spinal-env-viewer-graph-service"
import { SpinalBmsNetwork, SpinalBmsDevice, SpinalBmsEndpoint, SpinalBmsEndpointGroup } from "spinal-model-bmsnetwork";
import { BACNET_ORGAN_TYPE, SpinalPilotModel } from 'spinal-model-bacnet';
import { OPCUA_ORGAN_TYPE, SpinalOPCUAPilot } from "spinal-model-opcua";

export default {
   getEndpointOrgan(endpointNodeId) {
      const organTypes = [BACNET_ORGAN_TYPE, OPCUA_ORGAN_TYPE]
      return this.findParents(endpointNodeId, [SpinalBmsNetwork.relationName, SpinalBmsDevice.relationName, SpinalBmsEndpoint.relationName, SpinalBmsEndpointGroup.relationName], (node => {
         if (organTypes.includes(node.getType().get())) {
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

   getNetwork(endpointNodeId) {
      return this.findParents(endpointNodeId, [SpinalBmsNetwork.relationName, SpinalBmsDevice.relationName, SpinalBmsEndpoint.relationName, SpinalBmsEndpointGroup.relationName], (node => {
         if (node.getType().get() === SpinalBmsNetwork.nodeTypeName) {
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

   async findParents(startId, relations, predicate, stopAtFirstFound = true) {
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
                  if (stopAtFirstFound) break;
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
   },

   async sendUpdateRequest(nodeId, endpointNode, value) {
      const [organNode] = await this.getEndpointOrgan(nodeId);
      const devices = await this.getDevices(nodeId);

      if (organNode && devices && devices.length > 0) {
         switch (organNode.getType().get()) {
            case BACNET_ORGAN_TYPE:
               const organ = await organNode.getElement();
               return this.sendBacnetRequest(organ, endpointNode, devices, value);
            case OPCUA_ORGAN_TYPE:
               return this.sendOPCUARequest(organNode, endpointNode, value, devices);
            default:
               break;
         }

      }
   },

   async sendBacnetRequest(organ, endpointNode, devices, value) {
      const endpointElement = await endpointNode.getElement();

      const requests = devices.map((device) => {
         return {
            address: device.info.address && device.info.address.get(),
            deviceId: device.info.idNetwork && device.info.idNetwork.get(),
            SADR: device.info.SADR && device.info.SADR.get(),
            objectId: {
               type: endpointElement.typeId.get(),
               instance: endpointElement.id.get(),
            },
            value: value,
         };
      });

      const spinalPilot = new SpinalPilotModel(organ, requests);
      await spinalPilot.addToNode(endpointNode);
      return spinalPilot;
   },

   async sendOPCUARequest(organ, endpointNode, value, devices) {
      // const [network] = await this.getNetwork(endpointNode.getId().get())
      const request = devices.map((device) => ({
         nodeId: endpointNode.info.idNetwork && endpointNode.info.idNetwork.get(),
         value,
         networkInfo: (device.info.server && device.info.server.get()) || {}
      }));
      // const request = {
      //    nodeId: endpointNode.info.idNetwork && endpointNode.info.idNetwork.get(),
      //    value,
      //    networkInfo: (network.info.serverInfo && network.info.serverInfo.get()) || {}
      // }

      const spinalPilot = new SpinalOPCUAPilot(organ, request);
      await spinalPilot.addToNode(endpointNode);
      return spinalPilot;
   }


}