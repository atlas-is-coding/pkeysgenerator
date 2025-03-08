import { promises as fs } from 'fs';
import { dirname } from 'path';

async function ensureDirectoryExists(filePath: string): Promise<void> {
    const directory = dirname(filePath);
    try {
        await fs.access(directory);
    } catch {
        await fs.mkdir(directory, { recursive: true });
    }
}

export async function appendLine(filePath: string, line: string): Promise<void> {
    try {
        await ensureDirectoryExists(filePath);
        await fs.appendFile(filePath, line + '\n');
    } catch (error) {
        console.error(`Error while adding line to file ${filePath}:`, error);
        throw error;
    }
}

export async function appendLines(filePath: string, lines: string[]): Promise<void> {
    try {
        await ensureDirectoryExists(filePath);
        const content = lines.join('\n') + '\n';
        await fs.appendFile(filePath, content);
    } catch (error) {
        console.error(`Error while adding line to file ${filePath}:`, error);
        throw error;
    }
}
