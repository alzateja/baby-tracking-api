import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Baby extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    required: false,
  })
  id: string;

  @property({
    type: 'date',
  })
  dob?: string;

  @property({
    type: 'string',
  })
  gender?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<Baby>) {
    super(data);
  }
}

export interface BabyRelations {
  // describe navigational properties here
}

export type BabyWithRelations = Baby & BabyRelations;
