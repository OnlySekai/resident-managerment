import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { DonTamVangDto } from 'src/dto/donTamVang.dto';
import { pheDuyet } from 'src/utils';

@Injectable()
export class TamvangService {
  constructor(private readonly db: DatabaseService) {}
  themTamVang(don: DonTamVangDto) {
    return this.db.knex.transaction((trx) => {
      return this.db
        .editById('nhan_khau', don.nhan_khau_id, { isActive: false })
        .transacting(trx)
        .then(() => this.db.don_tam_vang_table().insert(don).transacting(trx))
        .then(trx.commit)
        .catch(trx.rollback);
    });
  }
  acceptTamVang(id: number, userId: number, note?) {
    return this.db
      .getByIds('don_tam_vang', id)
      .select('nhan_khau_id')
      .then((ids): Promise<any> => {
        if (!ids.length)
          throw new NotFoundException('Don Tam Vang Khong Ton Tai');
        const nhanKhauId = ids[0].nhan_khau_id;
        return this.db.knex.transaction(async (trx)=> {
          await Promise.all([
            this.db
              .getByIds('nhan_khau', nhanKhauId)
              .update({ isActive: false })
              .transacting(trx),
            this.db
              .editById('don_tam_vang', id, pheDuyet(userId, note))
              .transacting(trx),
          ]);
        });
      });
  }
}
