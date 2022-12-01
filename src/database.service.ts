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
  public don_chuyen_khau_table = this.knex.from('don_chuyen_khau').as('dck');
  public don_dinh_chinh_do_ho_khau_table = this.knex.from(
    'don_dinh_chinh_so_ho_khau',
  );
  public don_dinh_chinh_nhan_khau_table = this.knex
    .from('don_dinh_chinh_nhan_khau')
    .as('dcnk');
  public don_nhap_khau_table = this.knex.from('don_nhap_khau').as('dnk');
  public don_nhap_khau_nhap_cung_table = this.knex
    .from('don_nhap_khau_nhap_cung')
    .as('dnkc');
  public don_tach_khau_table(isAlias = false, alias = 'dtk') {
    return this.knex.from(`don_tach_khau ${isAlias ? `AS ${alias}` : ''}`);
  }
  public don_tach_khau_tach_cung_table(isAlias = false, alias = 'dtkc') {
    return this.knex.from(`don_tach_khau_cung ${isAlias ? `AS ${alias}` : ''}`);
  }
  public don_tam_tru_table(isAlias = false, alias = 'dtt') {
    return this.knex.from(`don_tam)tru ${isAlias ? `AS ${alias}` : ''}`);
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
  public hoa_don_muon_thiet_bi_table(isAlias = false, alias = 'hdmtb') {
    return this.knex.from(
      `hoa_don_muon_thiet_bi ${isAlias ? `AS ${alias}` : ''}`,
    );
  }
  public hoa_don_muon_thiet_bi_bao_gom_table(
    isAlias = false,
    alias = 'hdmtbbg',
  ) {
    return this.knex.from(
      `hoa_don_muon_thiet_bi_bao_gom ${isAlias ? `AS ${alias}` : ''}`,
    );
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
  public thiet_bi_table = this.knex.from('thiet_bi').as('tb');
  public user_table = this.knex.from('user');
}
