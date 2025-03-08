export interface MenuOption {
  name: string;
  value: string;
  description?: string;
}

export interface SingleChoiceConfig {
  message: string;
  choices: MenuOption[];
}

export interface MultiChoiceConfig {
  message: string;
  choices: MenuOption[];
  min?: number;
  max?: number;
}

export interface ProgressBarConfig {
  total: number;
  message: string;
  format?: string;
}

export interface InputConfig {
  message: string;
  initial?: string;
  validate?: (value: string) => boolean | string | Promise<boolean | string>;
}

export type MenuResult<T> = {
  success: boolean;
  data?: T;
  error?: Error;
}
