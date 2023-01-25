import { PartialType } from '@nestjs/mapped-types';
import { CreateThietbiDto } from './create-thietbi.dto';

export class UpdateThietbiDto extends PartialType(CreateThietbiDto) {}
