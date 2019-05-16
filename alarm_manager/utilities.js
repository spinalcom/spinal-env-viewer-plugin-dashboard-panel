import {
  SpinalGraphService
} from "spinal-env-viewer-graph-service"

import {
  Model
} from "spinal-core-connectorjs_type";

import geographicService from "spinal-env-viewer-context-geographic-service";



const ENDPOINT_CONTEXT_NAME = ".EndpointThreshold"


let utilities = {
  getInAlarmList() {
    return this.waitService().then(() => {
      let context = SpinalGraphService.getContext(ENDPOINT_CONTEXT_NAME);


      if (typeof context !== "undefined") {
        if (typeof context.info.inAlarmList === "undefined") {
          context.info.add_attr({
            inAlarmList: []
          })
        }

        return context.info.inAlarmList;

      }

      return;
    })

  },

  waitService() {
    return new Promise((resolve) => {
      async function test() {
        if (SpinalGraphService.graph && SpinalGraphService
          .graph instanceof Model) {
          await SpinalGraphService.getChildren(SpinalGraphService.graph
            .getId()
            .get(), [])
          resolve()

        } else {
          setTimeout(() => {
            test()
          }, 500);
        }
      }
      test()
    })
  },

  getParents(nodeId) {
    let relationName = "hasEndPoint";
    let dashEndpointRelation = "hasDashEndpoint";

    // let node = SpinalGraphService.getRealNode(nodeId);

    return this.getRealNode(nodeId).then(node => {

      let linkRelation = node.parents[relationName];
      let dashRelation = node.parents[dashEndpointRelation];


      let relationLst = [];

      if (
        typeof linkRelation !== "undefined" &&
        typeof dashRelation !== "undefined"
      ) {
        relationLst = [...linkRelation, ...dashRelation];

      } else if (
        typeof linkRelation === "undefined" &&
        typeof dashRelation !== "undefined"
      ) {

        relationLst = [...dashRelation];
      } else if (
        typeof linkRelation !== "undefined" &&
        typeof dashRelation === "undefined"
      ) {

        relationLst = [...linkRelation];
      }

      if (relationLst.length) {
        relationLst = relationLst.map(el => {
          return el.load();
        });

        return Promise.all(relationLst).then(res => {
          res = res.map(el => {
            return el.parent.load();
          });

          return Promise.all(res).then(parents => {
            return parents.map(el => {
              SpinalGraphService._addNode(el);
              return SpinalGraphService.getInfo(el.info.id
                .get());
            });
          });
        });
      } else {
        return;
      }
    })
  },

  getBimObjectsId(nodeId) {
    // let realNode = SpinalGraphService.getRealNode(nodeId);

    return this.getRealNode(nodeId).then(realNode => {

      return realNode
        .find(geographicService.constants.GEOGRAPHIC_RELATIONS, node => {
          if (
            node.info.type.get() === geographicService.constants
            .EQUIPMENT_TYPE
          ) {
            return true;
          }
        })
        .then(bimNode => {
          return bimNode.map(el => {
            return el.info.dbid.get();
          });
        });

    })
  },

  getAllDbIds(nodeId) {
    return this.getParents(nodeId).then(parents => {

      parents = parents.filter(el => typeof el !== "undefined").map(
        el => {
          return this.getBimObjectsId(el.id.get());
        });

      return Promise.all(parents).then(values => {
        let dbIds = [];

        for (let i = 0; i < values.length; i++) {
          const element = values[i];
          dbIds = [...element];
        }


        return dbIds;
      });
    });
  },

  getRealNode(nodeId) {
    let realNode = SpinalGraphService.getRealNode(nodeId);
    if (typeof realNode !== "undefined") {
      return Promise.resolve(realNode);
    }
    return SpinalGraphService.findNode(nodeId).then(node => {
      return SpinalGraphService.getRealNode(node.id.get())
    });
  }

}

export {
  utilities
}