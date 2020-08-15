import {Entity, model, property} from '@loopback/repository';

@model()
export class Baby extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    required: false,
  })
  id: number;

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

  constructor(data?: Partial<Baby>) {
    super(data);
  }
}

export interface BabyRelations {
  // describe navigational properties here
}

export type BabyWithRelations = Baby & BabyRelations;
