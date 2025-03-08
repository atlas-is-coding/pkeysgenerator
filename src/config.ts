import { readFileSync } from 'fs';
import { join, dirname } from 'path';

interface ConfigPaths {
    root_dir: string;
    files_dir: string;
    output_file: string;
}

interface Config {
    paths: ConfigPaths;
}

class Configuration {
    private static instance: Configuration;
    private config: Config;

    private constructor() {
        const isProduction = process.env.NODE_ENV === 'production';
        const rootDir = isProduction 
            ? dirname(process.execPath)
            : join(import.meta.dir, '..');

        const configPath = join(rootDir, 'data', 'config.toml');
        const configContent = readFileSync(configPath, 'utf-8');
        const rawConfig = Bun.TOML.parse(configContent) as Config;

        this.config = {
            paths: {
                root_dir: rootDir,
                files_dir: rawConfig.paths.files_dir.replace('${root_dir}', rootDir),
                output_file: rawConfig.paths.output_file
                    .replace('${root_dir}', rootDir)
                    .replace('${files_dir}', join(rootDir, 'files')),
            }
        };
    }

    public static getInstance(): Configuration {
        if (!Configuration.instance) {
            Configuration.instance = new Configuration();
        }
        return Configuration.instance;
    }

    public getPaths(): ConfigPaths {
        return this.config.paths;
    }
}

export const config = Configuration.getInstance();
export default config;
