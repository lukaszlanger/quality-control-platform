export class Reports {
  reportId?: number;
  creationDate: Date;
  archivingDate?: Date;
  damageType: number;
  description: string;
  photosPath: string;
  signature: string;
  decision?: number;
  reportAcceptance: number;
  isArchived: boolean;
  itemId: number;
  workerId: number;
}
