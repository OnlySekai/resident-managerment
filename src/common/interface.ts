export interface TrackBackData<T> {
  date: Date;
  type: String;
  cu: T;
  moi: T;
}

export interface TrackBackDataResponse<T> {
  data: TrackBackData<T>[];
}

export interface TrackBackQuest {
  id: number;
  startDate: Date;
  endDate: Date;
}
