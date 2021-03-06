import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Diapers} from './diapers.model';
import {Feedings} from './feedings.model';
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
  dob: Date;

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

  @hasMany(() => Diapers)
  diapers: Diapers[];

  @hasMany(() => Feedings)
  feedings: Feedings[];

  constructor(data?: Partial<Baby>) {
    super(data);
  }
}

export interface BabyRelations {
  // describe navigational properties here
}

export type BabyWithRelations = Baby & BabyRelations;
