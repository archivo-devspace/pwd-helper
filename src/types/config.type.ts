export default interface ConfigType {
  validator: ValidatorConfigType;
  generator: GeneratorConfigType;
}

export interface ValidatorConfigType {
  default: {
    minLength: number;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
  };
}

export interface GeneratorConfigType {
  default: {
    length: number;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
  };
}
