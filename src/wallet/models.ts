export interface EVMKeyPair {
    privateKey: string;
    address: string;
}

export interface ValidationResult {
    isValid: boolean;
    address: string;
}
