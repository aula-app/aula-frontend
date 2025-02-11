import { ConfigResponse, InstanceResponse } from '@/types/Generics';
import { databaseRequest, GenericResponse } from './requests';

interface DefaultDurationsResponse extends GenericResponse {
  data: Array<number>;
}

export async function getDefaultDurations(): Promise<DefaultDurationsResponse> {
  const response = await databaseRequest({
    model: 'Converters',
    method: 'getGlobalPhaseDurations',
    arguments: {},
  });

  return response as DefaultDurationsResponse;
}

interface DefaultConfigResponse extends GenericResponse {
  data: ConfigResponse;
}

export async function getGlobalConfigs(): Promise<DefaultConfigResponse> {
  const response = await databaseRequest({
    model: 'Settings',
    method: 'getGlobalConfig',
    arguments: {},
  });

  return response as DefaultConfigResponse;
}

interface DefaultSettingsResponse extends GenericResponse {
  data: InstanceResponse;
}

export async function getInstanceSettings(): Promise<DefaultSettingsResponse> {
  const response = await databaseRequest({
    model: 'Settings',
    method: 'getInstanceSettings',
    arguments: {},
  });

  return response as DefaultSettingsResponse;
}
