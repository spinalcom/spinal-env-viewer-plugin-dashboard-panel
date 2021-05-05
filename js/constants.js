import { spinalControlPointService } from "spinal-env-viewer-plugin-control-endpoint-service"
import { SpinalBmsEndpoint, SpinalBmsDevice, SpinalBmsEndpointGroup } from "spinal-model-bmsnetwork";
import { dashboardVariables } from "spinal-env-viewer-dashboard-standard-service";
let hasEndPoint = "hasEndPoint";

export const TYPES = [SpinalBmsDevice.nodeTypeName, SpinalBmsEndpoint.nodeTypeName, SpinalBmsEndpointGroup.nodeTypeName];
export const RELATION_NAMES = [hasEndPoint, SpinalBmsDevice.relationName, SpinalBmsEndpoint.relationName, SpinalBmsEndpointGroup.relationName, dashboardVariables.ENDPOINT_RELATION_NAME, spinalControlPointService.ROOM_TO_CONTROL_GROUP];

