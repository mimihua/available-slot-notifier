export interface TimeResult {
    imgURL: string;
    rsvNum: number;
    selectNum: number;
    alt: string;
    startTime: number;
    endTime: number;
    useDay: number;
    status: number;
}

export interface Tzone {
    tzoneNo: number;
    tzoneName: string;
    timeResult: TimeResult[];
}
export interface Result {
    result: Tzone[];
}

export interface ParkWeekInfo {
    bcdNm: string;
    bcd: string;
    purpose: string;
    weekList?: Result;
}