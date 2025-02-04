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
