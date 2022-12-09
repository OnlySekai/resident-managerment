import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { DonTamTruDto } from 'src/dto/donTamTru.dto';
import { nhanKhauDto } from 'src/dto/nhanKhau.dto';
import { pheDuyet } from 'src/utils';

@Injectable()
export class TamtruService {
  constructor(private readonly db: DatabaseService) {}
  themTamTru(nhanKhau: nhanKhauDto, don: DonTamTruDto) {
    return this.db.knex.transaction(async (trx) => {
      const nhanKhauExsist = await this.db
        .nhan_khau_table()
        .where('cccd', nhanKhau.cccd)
        .transacting(trx);
      if (!nhanKhauExsist.length) {
        const ids = await this.db
          .nhan_khau_table()
          .insert(nhanKhau)
          .transacting(trx);
        await this.db
          .don_tam_tru_table()
          .insert({ ...don, nhan_khau_id: ids[0] })
          .transacting(trx);
      } else
        await this.db
          .don_tam_tru_table()
          .insert({ ...don, nhan_khau_id: nhanKhauExsist[0].id })
          .transacting(trx);
    });
  }
  async acceptTamTru(id: number, userAccept: number, note?: string) {
    const isExist =
      (await this.db.getByIds('don_tam_tru', id)).length > 0 ? true : false;
    if (!isExist) throw new NotFoundException('Khong tim thay tam tru');
    return this.db.editById('don_tam_tru', id, pheDuyet(userAccept));
  }
}
