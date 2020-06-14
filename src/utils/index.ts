export const getFullDateFunction = (date: string): { date: number, month: number, year: number } => {
    const FullDate = new Date(date)

    return { date: FullDate.getDate(), month: FullDate.getMonth(), year: FullDate.getFullYear() }
}