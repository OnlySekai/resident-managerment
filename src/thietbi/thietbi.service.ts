import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { CreateThietbiDto } from './dto/create-thietbi.dto';
import {CreatePhienSuDungDto} from './dto/create-phienSuDung.dto'
import { MuonDto } from './dto/muon.dto';
import { TraDto } from './dto/tra.dto';
import { UpdateThietbiDto } from './dto/update-thietbi.dto';

@Injectable()
export class ThietbiService {
  constructor(private readonly db: DatabaseService) {}
  createThietbi(createThietbiDto: CreateThietbiDto) {
    return this.db.tai_nguyen_table().insert(createThietbiDto)
  }
  muonThietBi(phieuMuon: MuonDto) {
    return this.db.knex.transaction( async(trx) => {
      const saoKeId = await trx('sao_ke').insert(phieuMuon.saoKe).then(rs => rs[0])
      const phieuMuonId = await trx('phieu_muon').insert({...phieuMuon.phieuMuon, trang_thai: 'CREATE', sao_ke_dang_ki: saoKeId}).then(rs => rs[0])
      let phienSuDungIds = trx('phien_su_dung')
      phieuMuon.phienSuDung.forEach(value => phienSuDungIds = phienSuDungIds.insert({...value, phieu_id:phieuMuonId}))
      await phieuMuonId
    })
  }
  traThietBi(phieuTra: TraDto) {
    return this.db.knex.transaction( async(trx) => {
      const missing = Object.keys(phieuTra.note)
      const tainguyenId = await this.db.phien_su_dung_table().select('tai_nguyen_id').where('phieu_id', phieuTra.phieuMuonId)
      const normalUpdate = trx('phien_su_dung').whereIn('tai_nguyen_id', tainguyenId).whereNotIn('tai_nguyen_id', missing).update({ngay_tra: new Date()})
      const updateMissing = trx('tai_nguyen').whereIn('tai_nguyen_id', missing).update({tinh_trang: 'LOST'})
      await Promise.all([normalUpdate, updateMissing])
    })
  }
  findAllTainguyenType() {
    return this.db.tai_nguyen_type_table()
  }

  async findAllTaiNguyenKhaDung(type: number, startDate, endDate) {
    const rs = await this.db.tai_nguyen_table().where('loai_id', type);
    const omitIds = await this.db.phien_su_dung_table().where( w => w.where('ngay_muon','<=', endDate).orWhere('ngay_hen_tra', '>=', startDate))
    .andWhere('thiet_bi')
  }
  findAll() {
    return `This action returns all thietbi`;
  }

  findOne(id: number) {
    return `This action returns a #${id} thietbi`;
  }

  update(id: number, updateThietbiDto: UpdateThietbiDto) {
    return `This action updates a #${id} thietbi`;
  }

  remove(id: number) {
    return `This action removes a #${id} thietbi`;
  }
  private async checkValidPhien(phiens: Array<CreatePhienSuDungDto>){}
}
