export enum DON_STATUS {
  PHE_DUYET = 'PHE_DUYET',
  TAO_MOI = 'TAO_MOI',
  TU_CHOI = 'TU_CHOI',
}

export enum THIET_BI_STATUS {
  CREATE = 'CREATE',
  PAID = 'PAID',
  REJECT = 'REJECT',
  CANCEL = 'CANCEL',
  USING = 'USING',
  DONE = 'DONE',
  MISSING = 'MISSING',
  LOSS = 'LOSS',
}

export const queryName = (ten: string) =>
  `MATCH(ho, ten_dem , ten ) against('${ten
    .split(' ')
    .join('* ')}*' in boolean mode)`;
