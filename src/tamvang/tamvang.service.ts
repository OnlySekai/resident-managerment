import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { DonTamVangDto } from 'src/dto/donTamVang.dto';

@Injectable()
export class TamvangService {
  constructor(private readonly db: DatabaseService) {}
  themTamVang(don: DonTamVangDto) {
    return this.db.knex.transaction((trx) => {
      return (
        this.db
          //TODO: Phe duyet moi xet
          .editById('nhan_khau', don.nhan_khau_id, { isActive: false })
          .transacting(trx)
          .then(() => this.db.don_tam_vang_table().insert(don).transacting(trx))
          .then(trx.commit)
          .catch(trx.rollback)
      );
    });
  }
}
