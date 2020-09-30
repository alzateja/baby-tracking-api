import {repository} from '@loopback/repository';
import {
  del,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Diapers} from '../models';
import {BabyRepository, DiapersRepository} from '../repositories';
import {returnBabyDiapersEvents} from '../utils/controller';
import {hasValidDiaperType, validIdPassed} from './../utils/validation';

export class DiapersController {
  constructor(
    @repository(DiapersRepository)
    public diapersRepository: DiapersRepository,
    @repository(BabyRepository)
    public babyRepository: BabyRepository,
  ) {}

  @post('/diapers', {
    responses: {
      '200': {
        description: 'Diapers model instance',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Diapers)},
          },
        },
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
    diaper: Omit<Diapers, 'diaperId'>,
  ): Promise<Diapers[]> {
    const {type, babyId} = diaper;
    hasValidDiaperType(type);
    validIdPassed(babyId);
    await this.diapersRepository.create(diaper);
    return returnBabyDiapersEvents(this.babyRepository, babyId);
  }

  @patch('/diapers/{id}', {
    responses: {
      '204': {
        description: 'Diapers PATCH success',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Diapers)},
          },
        },
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Diapers, {
            partial: true,
            title: 'UpdatedDiapers',
            exclude: ['diaperId', 'babyId'],
          }),
        },
      },
    })
    diapers: Diapers,
  ): Promise<Diapers[]> {
    const {type, babyId} = diapers;
    if (type !== undefined) {
      hasValidDiaperType(type);
    }

    validIdPassed(babyId);
    await this.diapersRepository.updateById(id, diapers);
    return returnBabyDiapersEvents(this.babyRepository, babyId);
  }

  @del('/diapers/{id}', {
    responses: {
      '204': {
        description: 'Diapers DELETE success',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Diapers)},
          },
        },
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<Diapers[]> {
    const diaperEvent = await this.diapersRepository.findById(id);
    await this.diapersRepository.deleteById(id);
    const {babyId} = diaperEvent;
    return returnBabyDiapersEvents(this.babyRepository, babyId);
  }
}
