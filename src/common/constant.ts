import { UserPayloadDto } from 'src/auth/dto/userPayload.dto';
import { Role } from 'src/model/role.enum';

export enum DON_STATUS {
  PHE_DUYET = 'PHE_DUYET',
  TAO_MOI = 'TAO_MOI',
  TU_CHOI = 'TU_CHOI',
  HUY_BO = 'HUY_BO',
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

export enum TINH_TRANG_TAM_TRU {
  ALL = 0,
  TAM_TRU = 1,
  TAM_VANG = 2,
  NHAN_KHAU = 3,
  DA_CHET = 4,
}

export enum GIOI_TINH {
  NAM = 0,
  NU = 1,
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

export const reject = (user: UserPayloadDto, ghi_chu?) => {
  return {
    user_phe_duyet: user.userId,
    ghi_chu,
    ngay_phe_duyet: new Date(),
    trang_thai:
      user.roles === Role.Admin ? COMMON_STATUS.TU_CHOI : DON_STATUS.HUY_BO,
  };
};

export const test = {};
