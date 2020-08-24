import {Entity, model, property} from '@loopback/repository';

@model()
export class Diapers extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  diaperId?: string;

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
  babyId?: string;

  constructor(data?: Partial<Diapers>) {
    super(data);
  }
}

export interface DiapersRelations {
  // describe navigational properties here
}

export type DiapersWithRelations = Diapers & DiapersRelations;
