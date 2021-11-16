import {
  SpinalGraphService,
  SPINAL_RELATION_LST_PTR_TYPE,
  SPINAL_RELATION_PTR_LST_TYPE,
} from "spinal-env-viewer-graph-service";
import {
  BMS_ENDPOINT_RELATIONS,
  CONTROL_ENDPOINT_RELATIONS,
  hasControlEnpoint,
} from "./constants";
import {
  SpinalBmsDevice,
  SpinalBmsEndpoint,
  SpinalBmsEndpointGroup,
  SpinalBmsNetwork,
} from "spinal-model-bmsnetwork";

export const endpointsMap = new Map();

export default {
  getTreeStructure(nodeId) {
    return Promise.all([
      this.getEndpoints(nodeId),
      this.getControlEndpoints(nodeId),
    ])
      .then(([endpoints, controlPoints]) => {
        return {
          endpoints,
          controlPoints,
        };
      })
      .catch(() => {
        return {
          endpoints: [],
          controlPoints: [],
        };
      });
  },

  getEndpoints(nodeId) {
    return SpinalGraphService.findNodesByType(
      nodeId,
      BMS_ENDPOINT_RELATIONS,
      SpinalBmsEndpoint.nodeTypeName
    )
      .then((endpoints) => {
        return endpoints.map((el) => {
          SpinalGraphService._addNode(el);
          const id = el.getId().get();

          return {
            id,
            name: el.getName().get(),
          };
        });
      })
      .catch((err) => {
        console.log(err);
        return [];
      });
  },

  async getControlEndpoints(nodeId) {
    const controlPoints = await SpinalGraphService.getChildren(nodeId, [
      hasControlEnpoint,
    ]);
    if (controlPoints.length === 0) return [];

    const promises = controlPoints.map((el) => {
      return SpinalGraphService.findNodesByType(
        el.id.get(),
        CONTROL_ENDPOINT_RELATIONS,
        SpinalBmsEndpoint.nodeTypeName
      );
    });

    return Promise.all(promises)
      .then((result) => {
        const endpoints = result.flat();
        return endpoints.map((endpoint) => {
          SpinalGraphService._addNode(endpoint);
          return {
            id: endpoint.getId().get(),
            name: endpoint.getName().get(),
          };
        });
      })
      .catch((err) => {});
  },

  getBmsNodeLinked(nodeId) {
    return SpinalGraphService.getChildren(nodeId, BMS_ENDPOINT_RELATIONS);
  },

  async unLinkBmsNetworkToNode(nodeId, bmsNetworkId, bmsNetworkType) {
    let relation = this.getRelation(bmsNetworkType);
    console.log(nodeId, bmsNetworkId, bmsNetworkType, relation);

    try {
      return this.removeRelationBytype(
        nodeId,
        bmsNetworkId,
        relation,
        SPINAL_RELATION_PTR_LST_TYPE
      );
    } catch (err) {
      console.log("inside catch");
      return this.removeRelationBytype(
        nodeId,
        bmsNetworkId,
        relation,
        SPINAL_RELATION_LST_PTR_TYPE
      );
    }
  },

  removeRelationBytype(nodeId, bmsNetworkId, relation, relationType) {
    return SpinalGraphService.removeChild(
      nodeId,
      bmsNetworkId,
      relation,
      relationType
    );
  },

  getRelation(type) {
    switch (type) {
      case SpinalBmsNetwork.nodeTypeName:
        return SpinalBmsNetwork.relationName;

      case SpinalBmsDevice.nodeTypeName:
        return SpinalBmsDevice.relationName;

      case SpinalBmsEndpointGroup.nodeTypeName:
        return SpinalBmsEndpointGroup.relationName;

      case SpinalBmsEndpoint.nodeTypeName:
        return SpinalBmsEndpoint.relationName;
      default:
        return "hasEndpoint";
    }
  },
};
