import {format} from 'date-fns'
export const pheDuyet = (user_phe_duyet=1, ghi_chu='') => {
  return {
    ngay_phe_duyet: format(Date.now(), 'yyyy-MM-dd'),
    user_phe_duyet,
    ghi_chu,
    trang_thai: 'PHE_DUYET'
  }
}