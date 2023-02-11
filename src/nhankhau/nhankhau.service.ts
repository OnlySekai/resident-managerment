import { Injectable, NotFoundException } from '@nestjs/common';
import { DON_STATUS, getIds, queryName } from 'src/common/constant';
import { DatabaseService } from 'src/database.service';
import { DondinhChinhNhanKhauDto } from 'src/dto/donDinhChinhNhanKhau.dto';
import { GiayKhaiTuDto } from 'src/dto/giayKhaiTu.dto';
import { nhanKhauDto } from 'src/dto/nhanKhau.dto';
import { pheDuyet } from 'src/utils';
import { searchKhaiSinh } from './dto/searchKhaiSinh.dto';
import { omit } from 'lodash/fp';
@Injectable()
export class NhankhauService {
  readonly omitField = omit([
    'name',
    'ten',
    'ten_bo',
    'ten_me',
    'cccd',
    'cccd_bo',
    'cccd_me',
    'id',
    'id_bo',
    'id_me',
  ]);
  constructor(private readonly db: DatabaseService) {}
  searchKhaiSinh(query: searchKhaiSinh) {
    const normalQuery = this.omitField(this.searchKhaiSinh);
    let queryKhaiSinh = this.db
      .giay_khai_sinh_table(true)
      .select('gks.*')
      .select({
        nhan_khau_id: 'nk.id',
        cccd: 'nk.cccd',
        ten: this.db.knex.raw(`concat(nk.ho, ' ', nk.ten_dem, ' ', nk.ten)`),
      })
      .select({
        cccd_bo: 'bo.cccd',
        ten_bo: this.db.knex.raw(`concat(bo.ho, ' ', bo.ten_dem, ' ', bo.ten)`),
      })
      .select({
        cccd_nguoi_khai_sinh: 'nks.cccd',
        ten_nguoi_khai_sinh: this.db.knex.raw(
          `concat(nks.ho, ' ', nks.ten_dem, ' ', nks.ten)`,
        ),
      })
      .select(
        ' me.cccd as cccd_me',
        this.db.knex.raw(
          `concat(me.ho, ' ', me.ten_dem, ' ', me.ten) as ten_me`,
        ),
      )
      .leftJoin('nhan_khau as nk', 'nhan_khau_id', 'nk.id')
      .leftJoin('nhan_khau as me', 'me.id', 'nk.id')
      .leftJoin('nhan_khau as bo', 'bo.id', 'nk.id')
      .leftJoin('nhan_khau as nks', 'nguoi_khai_sinh', 'nks.id')
      .where(normalQuery);

    const { cccd, cccd_bo, cccd_me, ten, ten_bo, ten_me, id, bo_id, me_id } =
      query;
    if (cccd) queryKhaiSinh = queryKhaiSinh.whereILike('nk.cccd', `%${cccd}%`);
    if (cccd_bo)
      queryKhaiSinh = queryKhaiSinh.whereILike('bo.cccd', `%${cccd_bo}%`);
    if (cccd_me)
      queryKhaiSinh = queryKhaiSinh.whereILike('me.cccd', `%${cccd_me}%`);
    if (ten) queryKhaiSinh = queryKhaiSinh.whereRaw(queryName(ten, 'nk'));
    if (cccd) queryKhaiSinh = queryKhaiSinh.whereILike('nk.cccd', `%${cccd}%`);
    if (ten_bo) queryKhaiSinh = queryKhaiSinh.whereRaw(queryName(ten_bo, 'bo'));
    if (cccd_bo)
      queryKhaiSinh = queryKhaiSinh.whereILike('bo.cccd', `%${cccd_bo}%`);
    if (ten_me) queryKhaiSinh = queryKhaiSinh.whereRaw(queryName(ten_me, 'me'));
    if (cccd_me)
      queryKhaiSinh = queryKhaiSinh.whereILike('me.cccd', `%${cccd_me}%`);
    if (id) queryKhaiSinh = queryKhaiSinh.whereIn('nk.id', getIds(id));
    console.log(getIds(bo_id));
    if (bo_id) queryKhaiSinh = queryKhaiSinh.whereIn('bo_id', getIds(bo_id));
    if (me_id) queryKhaiSinh = queryKhaiSinh.whereIn('me_id', getIds(me_id));
    return queryKhaiSinh;
  }
  searchNhanKhau({ limit = 10, page = 1, condition }) {
    let { ten, cccd, active = true, ids } = condition;
    if (ids !== undefined && !Array.isArray(ids)) ids = [ids];
    console.log(ids);
    const queryName = ten
      ? `MATCH(ho, ten_dem , ten ) against('${ten
          .split(' ')
          .join('* ')}*' in boolean mode)`
      : '';
    let getNhanKhuQuery = this.db
      .nhan_khau_table()
      .whereRaw(queryName)
      .whereILike('cccd', cccd ? `%${cccd}%` : '%')
      .where('active', active);
    getNhanKhuQuery = ids
      ? getNhanKhuQuery.whereIn('id', ids)
      : getNhanKhuQuery;
    return [
      this.db.knex
        .select('shk.*', 'nk.*')
        .fromRaw(
          `(${getNhanKhuQuery.limit(limit).offset(limit * (page - 1))}) as nk`,
        )
        .leftJoin(
          'nhan_khau_so_ho_khau as nkshk',
          'nk.id',
          'nkshk.nhan_khau_id',
        )
        .leftJoin('so_ho_khau as shk', 'shk.id', 'nkshk.so_ho_khau_id'),
      getNhanKhuQuery.count('id'),
    ];
  }

  themNhanKhau(nhanhKhauInfo: nhanKhauDto, option) {
    const { giayKhaiSinh, hokhau, quanHeChuHo } = option;
    return this.db.knex.transaction(async (trx) => {
      const nhanKhauIds = await trx.insert(nhanhKhauInfo).into('nhan_khau');
      if (hokhau && quanHeChuHo) {
        const so_ho_khau_id = hokhau;
        const quan_he_chu_ho = quanHeChuHo;
        await trx('nhan_khau_so_ho_khau').insert({
          nhan_khau_id: nhanKhauIds[0],
          so_ho_khau_id,
          quan_he_chu_ho,
        });
        if (giayKhaiSinh)
          await trx
            .insert({ ...giayKhaiSinh, nhan_khau_id: nhanKhauIds[0] })
            .into('giay_khai_sinh');
      }
    });
  }
  //TODO: Note đã chết trong bảng nhan khau so ho khau
  xoaNhanKhau(id: number, giayKhaiTu?: GiayKhaiTuDto) {
    return this.db.knex.transaction((trx) => {
      return this.db
        .editById('nhan_khau', id, { active: false })
        .transacting(trx)
        .then(() => {
          return this.db
            .nhan_khau_so_ho_khau_table()
            .where('nhan_khau_id', id)
            .transacting(trx);
        })
        .then(() => {
          if (giayKhaiTu.nguoi_lam_giay_id)
            return this.db
              .giay_khai_tu_table()
              .insert({ ...giayKhaiTu, nhan_khau_id: id })
              .transacting(trx);
        })
        .then(trx.commit)
        .then(trx.rollback);
    });
  }

  async dinhChinh(don: DondinhChinhNhanKhauDto) {
    const [nhanKhau] = await this.db.getByIds('nhan_khau', don.nhan_khau_id);
    if (!nhanKhau) throw new NotFoundException('Khong ton tai nhan khau');
    return this.db.don_dinh_chinh_nhan_khau_table().insert(don);
  }

  async acceptDinhChinh(id: number, userId: number) {
    //TODO: when id=${id} and trang_thai === TAO_MOI  xem lạithứ tự thực hiện
    const [don] = await this.db
      .getByIds('don_dinh_chinh_nhan_khau', id)
      .where({ trang_thai: DON_STATUS.TAO_MOI });
    if (!don)
      throw new NotFoundException('Khong tim thay don dinh chinh nhan khau');
    const [nhanKhau] = await this.db.getByIds('nhan_khau', don.nhan_khau_id);
    if (!nhanKhau)
      throw new NotFoundException('Khong tim thay don dinh chinh nhan khau');

    return this.db.knex.transaction(async (trx) => {
      const { mo_ta, nhan_khau_id } = don;
      await trx
        .from('nhan_khau')
        .where('id', nhan_khau_id)
        .update(JSON.parse(mo_ta));
      const [nhanKhauMoi] = await this.db.getByIds('nhan_khau', nhan_khau_id);
      await trx
        .from('don_dinh_chinh_nhan_khau')
        .where('id', id)
        .update({
          ...pheDuyet(userId),
          mo_ta: JSON.stringify({
            moi: { ...nhanKhauMoi },
            cu: { ...nhanKhau },
          }),
        });
    });
  }
}
