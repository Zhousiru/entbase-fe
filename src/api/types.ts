export interface ApiError {
  data: null
  total: null
  errorMsg: string
  success: false
}

export interface ApiOk<Data> {
  data: Data
  total: number | null
  errorMsg: null
  success: true
}

export type Api<Data> = ApiOk<Data> | ApiError
