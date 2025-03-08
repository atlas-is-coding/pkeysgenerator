# Private Keys Generator

A simple and efficient tool for generating evm-compatible private keys. This tool allows you to generate multiple private keys automatically saves them in a designated files

## Prerequisites

### Installing Bun

#### macOS
```bash
curl -fsSL https://bun.sh/install | bash
```

#### Windows
1. In Powershell:
   ```powershell
   powershell -c "irm bun.sh/install.ps1|iex"
   ```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/atlas-is-coding/pkeysgenerator.git
cd pkeysgenerator
```

2. Install dependencies:
```bash
bun install
```

## Usage

1. Run the script:
```bash
bun run index.ts
```

2. Follow the interactive prompts:

## File Storage

Generated private keys are stored in the `files` directory within the project folder:
- Private key is saved at `keys/output.txt` in `public_address:private_key` format

## Features

- Interactive command-line interface

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
