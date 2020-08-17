import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {Baby} from '../models';
import {BabyRepository} from '../repositories';

export class BabyController {
  constructor(
    @repository(BabyRepository)
    public babyRepository: BabyRepository,
  ) {}

  @authenticate('jwt')
  @post('/babies', {
    responses: {
      '200': {
        description: 'Baby model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Baby, {exclude: ['id']}),
          },
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Baby, {
            title: 'NewBaby',
            exclude: ['id'],
          }),
        },
      },
    })
    baby: Omit<Baby, 'id'>,
  ): Promise<Baby> {
    return this.babyRepository.create(baby);
  }

  @authenticate('jwt')
  @get('/babies/count', {
    responses: {
      '200': {
        description: 'Baby model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Baby) where?: Where<Baby>): Promise<Count> {
    return this.babyRepository.count(where);
  }

  @authenticate('jwt')
  @get('/babies', {
    responses: {
      '200': {
        description: 'Array of Baby model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Baby, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Baby) filter?: Filter<Baby>): Promise<Baby[]> {
    return this.babyRepository.find(filter);
  }

  @authenticate('jwt')
  @patch('/babies', {
    responses: {
      '200': {
        description: 'Baby PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Baby, {partial: true}),
        },
      },
    })
    baby: Baby,
    @param.where(Baby) where?: Where<Baby>,
  ): Promise<Count> {
    return this.babyRepository.updateAll(baby, where);
  }

  @authenticate('jwt')
  @get('/babies/{id}', {
    responses: {
      '200': {
        description: 'Baby model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Baby, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Baby, {exclude: 'where'}) filter?: FilterExcludingWhere<Baby>,
  ): Promise<Baby> {
    return this.babyRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @patch('/babies/{id}', {
    responses: {
      '204': {
        description: 'Baby PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Baby, {partial: true}),
        },
      },
    })
    baby: Baby,
  ): Promise<void> {
    await this.babyRepository.updateById(id, baby);
  }

  @authenticate('jwt')
  @put('/babies/{id}', {
    responses: {
      '204': {
        description: 'Baby PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() baby: Baby,
  ): Promise<void> {
    await this.babyRepository.replaceById(id, baby);
  }

  @authenticate('jwt')
  @del('/babies/{id}', {
    responses: {
      '204': {
        description: 'Baby DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.babyRepository.deleteById(id);
  }
}
