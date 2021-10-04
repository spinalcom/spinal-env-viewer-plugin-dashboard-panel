import { spinalControlPointService } from "spinal-env-viewer-plugin-control-endpoint-service"
import { SpinalBmsEndpoint, SpinalBmsDevice, SpinalBmsEndpointGroup } from "spinal-model-bmsnetwork";
import { dashboardVariables } from "spinal-env-viewer-dashboard-standard-service";
let hasEndPoint = "hasEndPoint";

export const hasControlEnpoint = spinalControlPointService.ROOM_TO_CONTROL_GROUP


export const TYPES = [SpinalBmsDevice.nodeTypeName, SpinalBmsEndpoint.nodeTypeName, SpinalBmsEndpointGroup.nodeTypeName];
export const BMS_ENDPOINT_RELATIONS = [hasEndPoint, SpinalBmsDevice.relationName, SpinalBmsEndpoint.relationName, SpinalBmsEndpointGroup.relationName, dashboardVariables.ENDPOINT_RELATION_NAME];

export const CONTROL_ENDPOINT_RELATIONS = [hasControlEnpoint, ...BMS_ENDPOINT_RELATIONS]
export const RELATION_NAMES = [...BMS_ENDPOINT_RELATIONS, ...CONTROL_ENDPOINT_RELATIONS] ;
