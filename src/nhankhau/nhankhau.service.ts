import { Injectable, NotFoundException } from '@nestjs/common';
import { DON_STATUS } from 'src/common/constant';
import { DatabaseService } from 'src/database.service';
import { DondinhChinhNhanKhauDto } from 'src/dto/donDinhChinhNhanKhau.dto';
import { GiayKhaiTuDto } from 'src/dto/giayKhaiTu.dto';
import { nhanKhauDto } from 'src/dto/nhanKhau.dto';
import { pheDuyet } from 'src/utils';

@Injectable()
export class NhankhauService {
  constructor(private readonly db: DatabaseService) {}
  searchNhanKhau({ limit = 10, page = 1, condition }) {
    const { ten, cccd, active = true } = condition;
    const queryName = ten
      ? `MATCH(ho, ten_dem , ten ) against('${ten
          .split(' ')
          .join('* ')}*' in boolean mode)`
      : '';
    const getNhanKhuQuery = this.db
      .nhan_khau_table()
      .whereRaw(queryName)
      .whereILike('cccd', cccd ? `%${11}%` : '%')
      .where('active', active);
    return [
      this.db.knex
        .select('nk.*', 'shk.*')
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
