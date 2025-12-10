import { max, min } from "@stk_utils/funcs/StkMathUtils";
import {} from "@stk_utils/funcs/StkArrayUtils";

export type StkPickerDefinitionBase<T> = {
  qty?: number;
  qtyList?: Readonly<number[]>;
  validator?: (selected: Readonly<T[]>) => boolean;
  minQty?: number;
  maxQty?: number;
  needsValidateCombination?: boolean;
};
export type StkQtyPickerDefinition<T> = StkPickerDefinitionBase<T> & {
  qty: number;
};
export type StkQtyListPickerDefinition<T> = StkPickerDefinitionBase<T> & {
  qtyList: number[];
};
export type StkValidatorPickerDefinition<T> = StkPickerDefinitionBase<T> & {
  validator: (selected: Readonly<T[]>) => boolean;
};

export type StkPickerDefinition<T> = StkQtyPickerDefinition<T> | StkQtyListPickerDefinition<T> | StkValidatorPickerDefinition<T>;

export class StkPicker<T> {
  private readonly validator: (selected: Readonly<T[]>) => boolean;
  private readonly minQty: number;
  private readonly maxQty: number;
  public get qty() {
    return this.minQty === this.maxQty && this.minQty > -1 ? this.minQty : undefined;
  }

  // todo : エラーをハンドリングするメソッドを引数に追加。
  public constructor(definition: StkPickerDefinition<T>) {
    if (definition.qty && definition.qty > 0) {
      this.minQty = definition.qty;
      this.maxQty = definition.qty;
      this.validator = (selected) => selected.length === this.minQty;
      return;
    }
    if (definition.qtyList) {
      const qtyList = [...definition.qtyList].getDistinct();
      if (!qtyList.length) {
        this.minQty = -1;
        this.maxQty = -1;
        this.validator = () => false;
        return;
      }

      this.minQty = max(min(...qtyList), 0);
      this.maxQty = max(...qtyList);
      this.validator = (selected) => qtyList.includes(selected.length);
      if (!this.maxQty || this.maxQty < 0) {
        throw Error(`Illegal Definition. PickerDefinition:${definition}`);
      }
      return;
    }

    if (!definition.validator) {
      throw Error(`Illegal Definition. PickerDefinition:${definition}`);
    }

    this.validator = definition.validator;
    this.minQty = definition.minQty ?? 0;
    this.maxQty = definition.maxQty ?? Number.MAX_SAFE_INTEGER;
  }
  public readonly getAllPatterns = (selectables: Readonly<T[]>) => Array.from(selectables).getAllOnOffPattern(this.minQty, this.maxQty).filter(this.validator);
  public readonly validatePattern = (selected: Readonly<T[]>) => selected.length <= this.maxQty && selected.length >= this.minQty && this.validator(selected);
}
