import { CreatePhienSuDungDto } from "./create-phienSuDung.dto";
import { CreatePhieuMuonDto } from "./create-phieuMuon.dto";
import { CreateSaokeDto } from "./create-saoke.dto";

export class MuonDto {
  phienSuDung: Array<CreatePhienSuDungDto>;
  phieuMuon: CreatePhieuMuonDto;
  saoKe: CreateSaokeDto
}
