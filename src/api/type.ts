export interface Api {
  request: any
  response: any
}
export interface ApiResponse<Data> {
  data: Data
  errorMsg: string | null
  success: boolean
  total: number | null
}
