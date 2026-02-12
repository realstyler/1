export type QuotaPeriodDTO = {
  periodStart: Date;
  periodEnd: Date;
  imagesUsed: number;
  imagesLimit: number;
};

export type QuotaPeriodCreateDTO = Omit<QuotaPeriodDTO, "imagesUsed">;

export type QuotaPeriodUpdateDTO = Partial<QuotaPeriodDTO>;
