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
import {Diapers} from '../models';
import {DiapersRepository} from '../repositories';

export class DiapersController {
  constructor(
    @repository(DiapersRepository)
    public diapersRepository : DiapersRepository,
  ) {}

  @post('/diapers', {
    responses: {
      '200': {
        description: 'Diapers model instance',
        content: {'application/json': {schema: getModelSchemaRef(Diapers)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Diapers, {
            title: 'NewDiapers',
            exclude: ['diaperId'],
          }),
        },
      },
    })
    diapers: Omit<Diapers, 'diaperId'>,
  ): Promise<Diapers> {
    return this.diapersRepository.create(diapers);
  }

  @get('/diapers/count', {
    responses: {
      '200': {
        description: 'Diapers model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Diapers) where?: Where<Diapers>,
  ): Promise<Count> {
    return this.diapersRepository.count(where);
  }

  @get('/diapers', {
    responses: {
      '200': {
        description: 'Array of Diapers model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Diapers, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Diapers) filter?: Filter<Diapers>,
  ): Promise<Diapers[]> {
    return this.diapersRepository.find(filter);
  }

  @patch('/diapers', {
    responses: {
      '200': {
        description: 'Diapers PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Diapers, {partial: true}),
        },
      },
    })
    diapers: Diapers,
    @param.where(Diapers) where?: Where<Diapers>,
  ): Promise<Count> {
    return this.diapersRepository.updateAll(diapers, where);
  }

  @get('/diapers/{id}', {
    responses: {
      '200': {
        description: 'Diapers model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Diapers, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Diapers, {exclude: 'where'}) filter?: FilterExcludingWhere<Diapers>
  ): Promise<Diapers> {
    return this.diapersRepository.findById(id, filter);
  }

  @patch('/diapers/{id}', {
    responses: {
      '204': {
        description: 'Diapers PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Diapers, {partial: true}),
        },
      },
    })
    diapers: Diapers,
  ): Promise<void> {
    await this.diapersRepository.updateById(id, diapers);
  }

  @put('/diapers/{id}', {
    responses: {
      '204': {
        description: 'Diapers PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() diapers: Diapers,
  ): Promise<void> {
    await this.diapersRepository.replaceById(id, diapers);
  }

  @del('/diapers/{id}', {
    responses: {
      '204': {
        description: 'Diapers DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.diapersRepository.deleteById(id);
  }
}
