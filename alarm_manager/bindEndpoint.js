import {
  utilities
} from "./utilities"

// import EndpointComponent from "../vue/endpointComponent.vue";

import bimObjectService from "spinal-env-viewer-plugin-bimobjectservice";

let timeOutMap = new Map();

let temp_Alarm_List;

window.onload = function() {
  let viewer = window.spinal.ForgeViewer.viewer;

  // addMenu(viewer);

  utilities.getInAlarmList().then(inAlarmList => {
    if (inAlarmList && inAlarmList.length > 0) {
      inAlarmList.bind(() => {
        temp_Alarm_List = inAlarmList;

        // clearTimeOut();

        for (let i = 0; i < inAlarmList.length; i++) {
          const nodeId = inAlarmList[i].get();
          colorItem(nodeId, viewer);
        }


      })
    }
  })

}

let colorItem = function(nodeId, viewer) {

  // let x = 0;
  utilities.getAllDbIds(nodeId).then(el => {
    // timeOutMap.set(nodeId, setInterval(function() {
    //   if (x % 2 == 0) {
    //     console.log("set color");
    setTimeout(() => {
      viewer.setColorMaterial(el, "#FF0000")
    }, 1000)
    //   } else {
    //     console.log("reset color");
    //     viewer.restoreColorMaterial(el);
    //   }
    //   x++;
    // }, 1000))
  })
}

let clearTimeOut = function() {
  timeOutMap.forEach((value) => {
    clearInterval(value);
  })
}

let addMenu = function(viewer) {
  viewer.registerContextMenuCallback("addItem", async (menu, status) => {
    if (temp_Alarm_List && status.hasSelected) {
      console.log();

    }
  })
}

let isInAlarm = async (itemSelected) => {
  let bimNode = await bimObjectService.getBIMObject(itemSelected);
  temp_Alarm_List.find(el => {
    el.get() === bimNode.info.id.get();
  })
}