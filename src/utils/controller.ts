import {Count} from '@loopback/repository';
import {Baby, Feedings} from '../models';
import {BabyRepository, UserRepository} from '../repositories';
import {BabyWithEvents} from '../types';
import {Diapers} from './../models/diapers.model';

export const returnListOfBabiesOnUser = (
  userRepository: UserRepository,
  userId: string,
): Promise<Baby[]> => userRepository.babies(userId).find();

export const returnBabyInfo = (
  babyRepository: BabyRepository,
  babyId: string,
): Promise<Baby> => babyRepository.findById(babyId);

export const returnBabyFeedingEvents = (
  babyRepository: BabyRepository,
  babyId: string,
): Promise<Feedings[]> =>
  babyRepository.feedings(babyId).find({order: ['date DESC']});

export const returnBabyDiapersEvents = (
  babyRepository: BabyRepository,
  babyId: string,
): Promise<Diapers[]> =>
  babyRepository.diapers(babyId).find({order: ['date DESC']});

export const returnBabyWithEvents = async (
  babyRepository: BabyRepository,
  babyId: string,
): Promise<BabyWithEvents> => {
  const babyInfo = returnBabyInfo(babyRepository, babyId);
  const feedings = returnBabyFeedingEvents(babyRepository, babyId);
  const diapers = returnBabyDiapersEvents(babyRepository, babyId);
  const values = await Promise.all([babyInfo, feedings, diapers]);
  return {...values[0], feedings: values[1], diapers: values[2]};
};

export const deleteBabyAndEvents = (
  babyRepository: BabyRepository,
  babyId: string,
): Promise<[Count, Count, void]> =>
  Promise.all([
    babyRepository.feedings(babyId).delete(),
    babyRepository.diapers(babyId).delete(),
    babyRepository.deleteById(babyId),
  ]);
