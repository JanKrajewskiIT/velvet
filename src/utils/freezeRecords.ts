export const freezeRecords = <const T extends readonly object[]>(records: T): Readonly<T> => {
  for (const record of records) Object.freeze(record);
  return Object.freeze(records);
};
