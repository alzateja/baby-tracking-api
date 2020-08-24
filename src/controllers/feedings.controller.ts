import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Feedings} from '../models';
import {FeedingsRepository} from '../repositories';

export class FeedingsController {
  constructor(
    @repository(FeedingsRepository)
    public feedingsRepository : FeedingsRepository,
  ) {}

  @post('/feedings', {
    responses: {
      '200': {
        description: 'Feedings model instance',
        content: {'application/json': {schema: getModelSchemaRef(Feedings)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Feedings, {
            title: 'NewFeedings',
            exclude: ['feedingId'],
          }),
        },
      },
    })
    feedings: Omit<Feedings, 'feedingId'>,
  ): Promise<Feedings> {
    return this.feedingsRepository.create(feedings);
  }

  @get('/feedings/count', {
    responses: {
      '200': {
        description: 'Feedings model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Feedings) where?: Where<Feedings>,
  ): Promise<Count> {
    return this.feedingsRepository.count(where);
  }

  @get('/feedings', {
    responses: {
      '200': {
        description: 'Array of Feedings model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Feedings, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Feedings) filter?: Filter<Feedings>,
  ): Promise<Feedings[]> {
    return this.feedingsRepository.find(filter);
  }

  @patch('/feedings', {
    responses: {
      '200': {
        description: 'Feedings PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Feedings, {partial: true}),
        },
      },
    })
    feedings: Feedings,
    @param.where(Feedings) where?: Where<Feedings>,
  ): Promise<Count> {
    return this.feedingsRepository.updateAll(feedings, where);
  }

  @get('/feedings/{id}', {
    responses: {
      '200': {
        description: 'Feedings model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Feedings, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Feedings, {exclude: 'where'}) filter?: FilterExcludingWhere<Feedings>
  ): Promise<Feedings> {
    return this.feedingsRepository.findById(id, filter);
  }

  @patch('/feedings/{id}', {
    responses: {
      '204': {
        description: 'Feedings PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Feedings, {partial: true}),
        },
      },
    })
    feedings: Feedings,
  ): Promise<void> {
    await this.feedingsRepository.updateById(id, feedings);
  }

  @put('/feedings/{id}', {
    responses: {
      '204': {
        description: 'Feedings PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() feedings: Feedings,
  ): Promise<void> {
    await this.feedingsRepository.replaceById(id, feedings);
  }

  @del('/feedings/{id}', {
    responses: {
      '204': {
        description: 'Feedings DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.feedingsRepository.deleteById(id);
  }
}
