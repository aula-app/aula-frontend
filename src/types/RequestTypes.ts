import {ObjectPropByName} from './Generics'

export interface ModelRequest {
  model: string,
  method: string,
  arguments: ObjectPropByName,
}