export interface queryGetDonDto {
  id?: number | number[];
  status?: string;
  ten?: string;
  cccd?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  type?: string;
  limit?: number;
}
