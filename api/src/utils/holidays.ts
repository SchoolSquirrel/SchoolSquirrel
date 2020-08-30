import axios from "axios";
import { HolidayData } from "../entity/Holiday";

export async function getHolidays(countryCode: string, state: string): Promise<HolidayData> {
    const data = {};
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
    for (const year of years) {
        await new Promise((r) => {
            axios.get(`https://raw.githubusercontent.com/SchoolSquirrel/holiday-data/master/data/${countryCode}/${state}/${year}.json`).then((result) => {
                data[year] = result.data;
                r();
            }, () => {
                r();
            });
        });
    }
    return data;
}
