import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Baby extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    required: false,
  })
  babyId: string;

  @property({
    type: 'Date',
    jsonSchema: {
      format: 'date',
    },
  })
  dob?: Date;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      uniqueItems: true,
    },
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
