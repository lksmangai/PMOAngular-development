export interface ICity {
  id?: number;
  cityCode?: string;
  cityName?: string;
}

export class City implements ICity {
  constructor(public id?: number, public cityCode?: string, public cityName?: string) {}
}
