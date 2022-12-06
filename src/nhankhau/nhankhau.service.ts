import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { DondinhChinhNhanKhauDto } from 'src/dto/donDinhChinhNhanKhau.dto';
import { GiayKhaiTuDto } from 'src/dto/giayKhaiTu.dto';
import { nhanKhauDto } from 'src/dto/nhanKhau.dto';

@Injectable()
export class NhankhauService {
  constructor(private readonly db: DatabaseService) {}
  searchNhanKhau({limit= 10, page= 1, condition}) {
    return this.db
      .nhan_khau_table()
      .where(condition)
      .limit(10)
      .offset(limit * (page - 1));
  }
  themNhanKhau(nhanhKhauInfo: nhanKhauDto, option) {
    const { giayKhaiSinh, hokhau, quanHeChuHo } = option;
    return this.db.knex.transaction(async (trx) => {
      const nhanKhauIds = await trx.insert(nhanhKhauInfo).into('nhan_khau');

      const so_ho_khau_id = giayKhaiSinh
        ? (
            await trx
              .select('so_ho_khau_id')
              .from('nhan_khau_so_ho_khau')
              .where(
                'nhan_khau_id',
                giayKhaiSinh.bo_id ? giayKhaiSinh.bo_id : giayKhaiSinh.me_id,
              )
          )[0].so_ho_khau_id
        : hokhau;
      const quan_he_chu_ho = giayKhaiSinh ? 'Con' : quanHeChuHo;
      await trx('nhan_khau_so_ho_khau').insert({
        nhan_khau_id: nhanKhauIds[0],
        so_ho_khau_id,
        quan_he_chu_ho,
      });
      if (giayKhaiSinh)
        await trx
          .insert({ ...giayKhaiSinh, nhan_khau_id: nhanKhauIds[0] })
          .into('giay_khai_sinh');
    });
  }
  xoaNhanKhau(id: number, giayKhaiTu?: GiayKhaiTuDto) {
    return this.db.knex.transaction((trx) => {
      return this.db
        .editById('nhan_khau', id, { isActive: false })
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
  dinhChinh(...don: Array<DondinhChinhNhanKhauDto>) {
    return this.db.don_dinh_chinh_nhan_khau_table().insert(don);
  }
  acceptDinhChinh(id: number) {
    return this.db.knex.transaction(async (trx) => {
      const arrPromise = [];
      arrPromise.push(
        trx
          .from('don_dinh_chinh_nhan_khau')
          .where('id', id)
          .select('mo_ta', 'nhan_khau_id'),
      );
      arrPromise.push(
        trx
          .from('don_dinh_chinh_nhan_khau')
          .where('id', id)
          .update({ trang_thai: 'PHE_DUYET' }),
      );
      const rsPromise = await Promise.all(arrPromise);
      const { mo_ta, nhan_khau_id } = rsPromise[0][0];
      await trx
        .from('nhan_khau')
        .where('id', nhan_khau_id)
        .update(JSON.parse(mo_ta).thong_tin_moi);
    });
  }
}
