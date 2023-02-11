export enum DON_STATUS {
  PHE_DUYET = 'PHE_DUYET',
  TAO_MOI = 'TAO_MOI',
  TU_CHOI = 'TU_CHOI',
}

export enum COMMON_STATUS {
  TAO_MOI = 'TAO_MOI',
  PHE_DUYET = 'PHE_DUYET',
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

export const queryName = (ten: string, table) =>
  `MATCH(${table}.ho, ${table}.ten_dem , ${table}.ten ) against('${ten
    .trim()
    .split(' ')
    .join('* ')}*' in boolean mode)`;

export const getIds = (ids) => {
  if (ids && !Array.isArray(ids)) return [ids];
  return ids;
};

export const reject = (userId, ghi_chu?) => {
  return {
    user_phe_duyet: userId,
    ghi_chu,
    ngay_phe_duyet: new Date(),
    trang_thai: COMMON_STATUS,
  };
};

export const test = {};
