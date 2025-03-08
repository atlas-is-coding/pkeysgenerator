import Enquirer from 'enquirer';
import type { SingleChoiceConfig, MultiChoiceConfig, ProgressBarConfig, MenuResult, InputConfig } from './models';
import { MenuValidationError, MenuRenderError, MenuInteractionError } from './exceptions';

export class CustomMenu {
  private enquirer: Enquirer;

  constructor() {
    this.enquirer = new Enquirer();
  }

  public async singleChoice(config: SingleChoiceConfig): Promise<MenuResult<string>> {
    try {
      const response = await this.enquirer.prompt({
        type: 'select',
        name: 'result',
        message: config.message,
        choices: config.choices.map(c => ({ name: c.name, value: c.value, hint: c.description })),
        scroll: true
      }) as { result: string };
      
      return {
        success: true,
        data: response.result,
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          error: new MenuInteractionError(error.message)
        };
      }
      return {
        success: false,
        error: new MenuInteractionError('Unknown error')
      };
    }
  }

  public async multiChoice(config: MultiChoiceConfig): Promise<MenuResult<string[]>> {
    try {
      const response = await this.enquirer.prompt({
        type: 'multiselect',
        name: 'result',
        message: config.message,
        choices: config.choices.map(c => ({ name: c.name, value: c.value, hint: c.description })),
        scroll: true
      }) as { result: string[] };

      const selected = (response.result || []).filter(Boolean);
      
      if (config.min && selected.length < config.min) {
        throw new MenuValidationError(`Минимальное количество выборов: ${config.min}`);
      }
      
      if (config.max && selected.length > config.max) {
        throw new MenuValidationError(`Максимальное количество выборов: ${config.max}`);
      }

      return {
        success: true,
        data: selected
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          error: new MenuInteractionError(error.message)
        };
      }
      return {
        success: false,
        error: new MenuInteractionError('Unknown error')
      };
    }
  }

  public async showProgress(config: ProgressBarConfig): Promise<MenuResult<{
    increment: () => void;
    update: (value: number) => void;
    stop: () => void;
  }>> {
    try {
      let current = 0;
      const total = config.total;
      
      const updateProgress = () => {
        process.stdout.write(`\r${config.message} [${current}/${total}] ${Math.round((current / total) * 100)}%`);
      };

      updateProgress();

      return {
        success: true,
        data: {
          increment: () => { 
            current = Math.min(current + 1, total);
            updateProgress();
          },
          update: (value: number) => {
            current = Math.min(Math.max(0, value), total);
            updateProgress();
          },
          stop: () => {
            process.stdout.write('\n');
          }
        }
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          error: new MenuRenderError(error.message)
        };
      }
      return {
        success: false,
        error: new MenuRenderError('Unknown error')
      };
    }
  }

  public async input(config: InputConfig): Promise<MenuResult<string>> {
    try {
      const response = await this.enquirer.prompt({
        type: 'input',
        name: 'result',
        message: config.message,
        initial: config.initial,
        validate: config.validate
      }) as { result: string };

      return {
        success: true,
        data: response.result
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          error: new MenuInteractionError(error.message)
        };
      }
      return {
        success: false,
        error: new MenuInteractionError('Unknown error')
      };
    }
  }
}
