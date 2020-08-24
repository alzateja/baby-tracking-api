import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Baby,
  Diapers,
} from '../models';
import {BabyRepository} from '../repositories';

export class BabyDiapersController {
  constructor(
    @repository(BabyRepository) protected babyRepository: BabyRepository,
  ) { }

  @get('/babies/{id}/diapers', {
    responses: {
      '200': {
        description: 'Array of Baby has many Diapers',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Diapers)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Diapers>,
  ): Promise<Diapers[]> {
    return this.babyRepository.diapers(id).find(filter);
  }

  @post('/babies/{id}/diapers', {
    responses: {
      '200': {
        description: 'Baby model instance',
        content: {'application/json': {schema: getModelSchemaRef(Diapers)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Baby.prototype.babyId,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Diapers, {
            title: 'NewDiapersInBaby',
            exclude: ['diaperId'],
            optional: ['babyId']
          }),
        },
      },
    }) diapers: Omit<Diapers, 'diaperId'>,
  ): Promise<Diapers> {
    return this.babyRepository.diapers(id).create(diapers);
  }

  @patch('/babies/{id}/diapers', {
    responses: {
      '200': {
        description: 'Baby.Diapers PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Diapers, {partial: true}),
        },
      },
    })
    diapers: Partial<Diapers>,
    @param.query.object('where', getWhereSchemaFor(Diapers)) where?: Where<Diapers>,
  ): Promise<Count> {
    return this.babyRepository.diapers(id).patch(diapers, where);
  }

  @del('/babies/{id}/diapers', {
    responses: {
      '200': {
        description: 'Baby.Diapers DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Diapers)) where?: Where<Diapers>,
  ): Promise<Count> {
    return this.babyRepository.diapers(id).delete(where);
  }
}
