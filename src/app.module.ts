import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HokhauModule } from './hokhau/hokhau.module';
import { NhankhauModule } from './nhankhau/nhankhau.module';
import { HistoryModule } from './history/history.module';
import { TamtruModule } from './tamtru/tamtru.module';
import { TamvangModule } from './tamvang/tamvang.module';
import { ThongkeModule } from './thongke/thongke.module';
import { DatabaseService } from './database.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    HokhauModule,
    NhankhauModule,
    HistoryModule,
    TamtruModule,
    TamvangModule,
    ThongkeModule,
    AuthModule,
    UserModule,
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
  controllers: [AppController],
})
export class AppModule {}
