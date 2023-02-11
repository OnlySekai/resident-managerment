import { userDto } from 'src/dto/user.dto';

export interface selfUpdateUserDto extends userDto {
  repassword: string;
  userId?: number;
}
