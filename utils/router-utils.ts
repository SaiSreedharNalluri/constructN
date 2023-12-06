
export const updateQueryParam = (searchParams: URLSearchParams, key: string | string[], value?: string): string => {

    const params = new URLSearchParams(searchParams)

    if(value) params.set(key as string, value)

    else (key as string[]).forEach((k: string) => params.delete(k))

    return params.toString()
}