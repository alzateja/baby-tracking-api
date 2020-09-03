import {Entity, model, property} from '@loopback/repository';

@model()
export class Feedings extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  feedingId?: string;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @property({
    type: 'string',
  })
  babyId: string;

  constructor(data?: Partial<Feedings>) {
    super(data);
  }
}

export interface FeedingsRelations {
  // describe navigational properties here
}

export type FeedingsWithRelations = Feedings & FeedingsRelations;
