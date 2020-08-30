export type Holiday = {
    name: string;
    startDate: Date;
    endDate: Date;
    isVacation: boolean;
}

export type HolidayData = {
    [year: number]: Holiday[];
}
