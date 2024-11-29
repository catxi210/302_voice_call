import { apiKy, ErrorResponse } from '@/lib/api/api'

const url = 'v1/models'
const useHasPermission = () => {
  const doAjax = async () => {
    let flag = false
    let errorHint = true
    try {
      const json = await apiKy.get(url).json<ErrorResponse | unknown>()
      if (typeof json === 'object' && json && 'error' in json) {
        errorHint = false
      } else {
        flag = true;
      }
    } catch (error) {
      errorHint = false
    }
    return {
      flag,
      errorHint,
    }
  }
  return {
    doAjax,
  }
}
export default useHasPermission;
