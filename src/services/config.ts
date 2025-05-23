import { ConfigResponse, InstanceResponse, OnlineOptions } from '@/types/Generics';
import { databaseRequest, GenericResponse } from './requests';
import { RoleTypes } from '@/types/SettingsTypes';
import { CommandType } from '@/types/Scopes';

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

export async function setInstanceOnlineMode(status: OnlineOptions): Promise<DefaultSettingsResponse> {
  // 0=off, 1=on, 2=off(weekend) 3=off (vacation) 4=off (holiday) // 5=off for all roles (Lock out)

  const response = await databaseRequest(
    {
      model: 'Settings',
      method: 'setInstanceOnlineMode',
      arguments: { status },
    },
    ['updater_id']
  );

  return response as DefaultSettingsResponse;
}

export async function setOauthStatus(status: boolean): Promise<DefaultSettingsResponse> {
  const response = await databaseRequest(
    {
      model: 'Settings',
      method: 'setOauthStatus',
      arguments: { status: status ? 1 : 0 },
    },
    ['updater_id']
  );

  return response as DefaultSettingsResponse;
}

export async function setAllowRegistration(status: boolean): Promise<DefaultSettingsResponse> {
  const response = await databaseRequest(
    {
      model: 'Settings',
      method: 'setAllowRegistration',
      arguments: { status: status ? 1 : 0 },
    },
    ['updater_id']
  );

  return response as DefaultSettingsResponse;
}

export async function addCSV(csv: string, room_id: string, user_level: RoleTypes): Promise<GenericResponse> {
  const response = await databaseRequest({
    model: 'User',
    method: 'addCSV',
    arguments: {
      csv,
      room_id,
      user_level,
    },
  });

  return response as GenericResponse;
}

export interface CommandResponse extends GenericResponse {
  data: CommandType[];
}

export async function getCommands(limit: number, offset: number): Promise<CommandResponse> {
  const response = await databaseRequest(
    {
      model: 'Command',
      method: 'getCommands',
      arguments: { limit, offset },
    },
    ['updater_id']
  );

  return response as CommandResponse;
}

interface AddCommandRequest {
  cmd_id: number;
  command: string;
  target_id?: string;
  parameters: string | number;
  date_start: string;
}

export async function addCommand(args: AddCommandRequest): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'Command',
      method: 'addCommand',
      arguments: args,
    },
    ['updater_id']
  );

  return response as GenericResponse;
}

export async function deleteCommand(command_id: number): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'Command',
      method: 'deleteCommand',
      arguments: { command_id },
    },
    ['updater_id']
  );

  return response as GenericResponse;
}
