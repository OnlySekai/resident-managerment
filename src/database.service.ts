import { Injectable } from '@nestjs/common';
import knex from 'knex';
@Injectable()
export class DatabaseService {
  public knex = knex({
    client: 'mysql2',
    connection: process.env.DATABASE_URL,
  });
  public getByIds(table: string, ...id: Array<number>) {
    return this.knex(table).whereIn('id', id);
  }
  public delByIds(table: string, ...id: Array<number>) {
    return this.knex(table).whereIn('id', id).del();
  }
  public editById(table: string, id: number, newRecord) {
    return this.knex(table).where('id', id).update(newRecord);
  }
  public getNhanKhauByHoKhau(hoKhauId: number, option = { detail: true }) {
    const { detail } = option;
    let result = this.nhan_khau_so_ho_khau_table(true).where(
      'so_ho_khau_id',
      hoKhauId,
    );
    if (detail)
      result = result.innerJoin(
        'nhan_khau AS nk',
        'nk.id',
        'nkhk.nhan_khau_id',
      );
    else result = result.select('nhan_khau_id');
    return result;
  }
  public don_chuyen_khau_table(isAlias = false, alias = 'dck') {
    return this.knex.from(`don_chuyen_khau ${isAlias ? `AS ${alias}` : ''}`);
  }
  public don_dinh_chinh_so_ho_khau_table(isAlias = false, alias = 'ddcshk') {
    return this.knex.from(
      `don_dinh_chinh_so_ho_khau ${isAlias ? `AS ${alias}` : ''}`,
    );
  }
  public don_dinh_chinh_nhan_khau_table(isAlias = false, alias = 'ddcnk') {
    return this.knex.from(
      `don_dinh_chinh_nhan_khau ${isAlias ? `AS ${alias}` : ''}`,
    );
  }
  public don_nhap_khau_table(isAlias = false, alias = 'dnk') {
    return this.knex.from(`don_nhap_khau ${isAlias ? `AS ${alias}` : ''}`);
  }
  public don_nhap_khau_nhap_cung_table(isAlias = false, alias = 'dnknc') {
    return this.knex.from(
      `don_nhap_khau_nhap_cung ${isAlias ? `AS ${alias}` : ''}`,
    );
  }
  public don_tach_khau_table(isAlias = false, alias = 'dtk') {
    return this.knex.from(`don_tach_khau ${isAlias ? `AS ${alias}` : ''}`);
  }
  public don_tach_khau_tach_cung_table(isAlias = false, alias = 'dtkc') {
    return this.knex.from(
      `don_tach_khau_tach_cung ${isAlias ? `AS ${alias}` : ''}`,
    );
  }
  public don_tam_tru_table(isAlias = false, alias = 'dtt') {
    return this.knex.from(`don_tam_tru ${isAlias ? `AS ${alias}` : ''}`);
  }
  public don_tam_vang_table(isAlias = false, alias = 'dtv') {
    return this.knex.from(`don_tam_vang ${isAlias ? `AS ${alias}` : ''}`);
  }
  public giay_khai_sinh_table(isAlias = false, alias = 'gks') {
    return this.knex.from(`giay_khai_sinh ${isAlias ? `AS ${alias}` : ''}`);
  }
  public giay_khai_tu_table(isAlias = false, alias = 'gkt') {
    return this.knex.from(`giay_khai_tu ${isAlias ? `AS ${alias}` : ''}`);
  }
  public nhan_khau_table(isAlias = false, alias = 'nk') {
    return this.knex.from(`nhan_khau ${isAlias ? `AS ${alias}` : ''}`);
  }
  public nhan_khau_so_ho_khau_table(isAlias = false, alias = 'nkhk') {
    return this.knex.from(
      `nhan_khau_so_ho_khau ${isAlias ? `AS ${alias}` : ''}`,
    );
  }
  public so_ho_khau_table(isAlias = false, alias = 'shk') {
    return this.knex.from(`so_ho_khau ${isAlias ? `AS ${alias}` : ''}`);
  }
  public user_table(isAlias = false, alias = 'u') {
    return this.knex.from(`user ${isAlias ? `AS ${alias}` : ''}`);
  }
  public phien_su_dung_table(isAlias = false, alias = 'psd') {
    return this.knex.from(`phien_su_dung ${isAlias ? `AS ${alias}` : ''}`);
  }

  public tai_nguyen_table(isAlias = false, alias = 'tn') {
    return this.knex.from(`tai_nguyen ${isAlias ? `AS ${alias}` : ''}`);
  }

  public sao_ke_table(isAlias = false, alias = 'sk') {
    return this.knex.from(`sao_ke ${isAlias ? `AS ${alias}` : ''}`);
  }

  public tai_nguyen_type_table(isAlias = false, alias = 'tnt') {
    return this.knex.from(`loai_tai_nguyen ${isAlias ? `AS ${alias}` : ''}`);
  }

  public phieu_muon_table(isAlias = false, alias = 'pm') {
    return this.knex.from(`phieu_muon ${isAlias ? `AS ${alias}` : ''}`);
  }

  public don_chuyen_khau_nhan_khau_table(isAlias = false, alias = 'dcknk') {
    return this.knex.from(
      `don_chuyen_khau_nhan_khau ${isAlias ? `AS ${alias}` : ''}`,
    );
  }

  public getNhanKhauIdsHoKhau(hoKhauId: number) {
    return this.nhan_khau_so_ho_khau_table()
      .where('so_ho_khau_id', hoKhauId)
      .then((value) => value.map((value) => value['nhan_khau_id']));
  }
}
