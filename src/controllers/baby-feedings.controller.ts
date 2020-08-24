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
  Feedings,
} from '../models';
import {BabyRepository} from '../repositories';

export class BabyFeedingsController {
  constructor(
    @repository(BabyRepository) protected babyRepository: BabyRepository,
  ) { }

  @get('/babies/{id}/feedings', {
    responses: {
      '200': {
        description: 'Array of Baby has many Feedings',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Feedings)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Feedings>,
  ): Promise<Feedings[]> {
    return this.babyRepository.feedings(id).find(filter);
  }

  @post('/babies/{id}/feedings', {
    responses: {
      '200': {
        description: 'Baby model instance',
        content: {'application/json': {schema: getModelSchemaRef(Feedings)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Baby.prototype.babyId,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Feedings, {
            title: 'NewFeedingsInBaby',
            exclude: ['feedingId'],
            optional: ['babyId']
          }),
        },
      },
    }) feedings: Omit<Feedings, 'feedingId'>,
  ): Promise<Feedings> {
    return this.babyRepository.feedings(id).create(feedings);
  }

  @patch('/babies/{id}/feedings', {
    responses: {
      '200': {
        description: 'Baby.Feedings PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Feedings, {partial: true}),
        },
      },
    })
    feedings: Partial<Feedings>,
    @param.query.object('where', getWhereSchemaFor(Feedings)) where?: Where<Feedings>,
  ): Promise<Count> {
    return this.babyRepository.feedings(id).patch(feedings, where);
  }

  @del('/babies/{id}/feedings', {
    responses: {
      '200': {
        description: 'Baby.Feedings DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Feedings)) where?: Where<Feedings>,
  ): Promise<Count> {
    return this.babyRepository.feedings(id).delete(where);
  }
}
