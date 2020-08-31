import {repository} from '@loopback/repository';
import {
  del,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Diapers} from '../models';
import {DiapersRepository} from '../repositories';

export class DiapersController {
  constructor(
    @repository(DiapersRepository)
    public diapersRepository: DiapersRepository,
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
    const {type} = diapers;
    const validFeedingTypes = ['mixed', 'wet', 'dirty'];
    if (!validFeedingTypes.includes(type)) {
      throw new HttpErrors.Conflict(
        "You need to provide a valid type of either 'dirty', 'wet' or 'mixed'",
      );
    }
    return this.diapersRepository.create(diapers);
  }

  @patch('/diapers/{id}', {
    responses: {
      '204': {
        description: 'Diapers PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: string,
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

  @del('/diapers/{id}', {
    responses: {
      '204': {
        description: 'Diapers DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: string): Promise<void> {
    await this.diapersRepository.deleteById(id);
  }
}
