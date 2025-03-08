import { CustomMenu } from './src/menu/menu';
import { Generator } from './src/wallet/generator';
import { config } from './src/config';
import { appendLines } from './src/utils';

async function generateEvmWallets(menu: CustomMenu, generator: Generator): Promise<void> {
    let walletsCount: number;
    while (true) {
        const inputResult = await menu.input({
            message: 'Number of wallet to generate:',
            validate: (value) => {
                const parsed = parseInt(value);
                if (isNaN(parsed) || parsed < 1) {
                    return 'Please, enter positive number';
                }
                return true;
            }
        });

        if (!inputResult.success) {
            console.error('Unable to get user input');
            process.exit(1);
        }

        walletsCount = parseInt(inputResult.data!);
        break;
    }

    const progressResult = await menu.showProgress({
        message: 'Generating EVM wallets',
        total: walletsCount
    });

    if (!progressResult.success || !progressResult.data) {
        console.error('Failed to initialize progress bar');
        process.exit(1);
    }

    const progress = progressResult.data;
    const wallets = [];

    try {
        for (let i = 0; i < walletsCount; i++) {
            const wallet = await generator.generateKeyPair();
            wallets.push(`${wallet.address}:${wallet.privateKey}`);
            progress.increment();
        }

        progress.stop();

        await appendLines(config.getPaths().output_file, wallets);
        
        console.log(`\nSuccessfully generated ${walletsCount} EVM wallets!`);
        console.log(`Results saved to: ${config.getPaths().output_file}`);
    } catch (error) {
        progress.stop();
        throw error;
    }
}

async function main() {
    const menu = new CustomMenu();
    const generator = new Generator();

    // Ensure required directories exist
    const paths = config.getPaths();
    const { promises: fs } = await import('fs');
    const { dirname } = await import('path');
    
    try {
        await fs.access(dirname(paths.output_file));
    } catch {
        await fs.mkdir(dirname(paths.output_file), { recursive: true });
    }

    const mainMenuResult = await menu.singleChoice({
        message: 'Select wallet type to generate:',
        choices: [
            { name: 'EVM Wallets', value: 'evm', description: 'Generate Ethereum-compatible wallets' },
            { name: 'Solana Wallets', value: 'sol', description: 'Generate Solana wallets' }
        ]
    });

    if (!mainMenuResult.success || !mainMenuResult.data) {
        console.error('Failed to get user choice');
        process.exit(1);
    }

    switch (mainMenuResult.data) {
        case 'Solana Wallets':
            console.log('Coming soon...');
            break;
        case 'EVM Wallets':
            await generateEvmWallets(menu, generator);
            break;
        default:
            console.error('Unknown wallet type');
            break;
    }
}

main().catch(error => {
    console.error('An error occurred:', error);
    process.exit(1);
});
