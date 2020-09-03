export type BabyWithEvents = {
  babyId: string;
  name: string;
  dob: Date;
  userId: string;
  feedings: Feedings[];
  diapers: Diapers[];
};
