export type Error = {
    status: number
    code: string
    message: string
}

 export type Result = {
    success: boolean
    message?: string
    data?: any
    token?: any
    total?: number
}

export type Range = {
    page: number,
    pageSize: number
}
