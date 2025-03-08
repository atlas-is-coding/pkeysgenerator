import { Wallet } from 'ethers';
import { randomBytes } from 'crypto';
import type { EVMKeyPair, ValidationResult } from './models';
import { InvalidPrivateKeyError, KeyGenerationError, ValidationError } from './exceptions';

export class Generator {
    public async generateKeyPair(): Promise<EVMKeyPair> {
        try {
            const privateKeyBytes = randomBytes(32);
            const privateKeyHex = privateKeyBytes.toString('hex');
            const wallet = new Wallet('0x' + privateKeyHex);
            
            return {
                privateKey: privateKeyHex,
                address: await wallet.getAddress()
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new KeyGenerationError(`Failed to generate key pair: ${errorMessage}`);
        }
    }

    public async validatePrivateKey(privateKey: string): Promise<ValidationResult> {
        try {
            if (privateKey.length !== 64) {
                throw new InvalidPrivateKeyError('Private key must be a 32-byte hex string');
            }

            const wallet = new Wallet('0x' + privateKey);
            const address = await wallet.getAddress();

            return {
                isValid: true,
                address
            };
        } catch (error: unknown) {
            if (error instanceof InvalidPrivateKeyError) {
                throw error;
            }
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new ValidationError(`Failed to validate private key: ${errorMessage}`);
        }
    }

    public async createWalletFromPrivateKey(privateKey: string): Promise<Wallet> {
        try {
            const validation = await this.validatePrivateKey(privateKey);
            if (!validation.isValid) {
                throw new InvalidPrivateKeyError();
            }
            return new Wallet('0x' + privateKey);
        } catch (error: unknown) {
            if (error instanceof InvalidPrivateKeyError) {
                throw error;
            }
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new ValidationError(`Failed to create wallet: ${errorMessage}`);
        }
    }
}