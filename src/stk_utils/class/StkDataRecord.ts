import { type IStkDataRecord } from "@stk_utils/class/StkDataStore";

export class StkDataRecord implements IStkDataRecord {
  public readonly id: number;
  public name = "unnamed";
  public description = "";
  public createdAt;
  public updatedAt;
  public dbVersion;

  public constructor(record: IStkDataRecord) {
    this.id = record.id;
    this.name = record.name;
    this.description = record.description;
    this.createdAt = record.createdAt;
    this.updatedAt = record.updatedAt;
    this.dbVersion = record.dbVersion;
  }
}
