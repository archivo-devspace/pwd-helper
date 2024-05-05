import * as fs from 'fs';
import * as path from "path";
import ConfigType from '../types/config.type';
import Config from '../constants/config';

export async function generate() {
    try {
        const data = await fs.promises.readFile(path.join(process.cwd(), Config.FileName), 'utf8');
        const config: ConfigType = JSON.parse(data);
        const { generator: { default: { length, lowercase, numbers, symbols, uppercase } } } = config;
        return generateRandomPassword(length, { uppercase, lowercase, numbers, symbols });
    } catch (err : any) {
        console.error(`${Config.FileName} file is required in the project root folder.`);
        console.error(err.message);
        return '';
    }
}

function generateRandomPassword(length: number, options: { uppercase?: boolean, lowercase?: boolean, numbers?: boolean, symbols?: boolean }): string {
    const uppercaseChars = Config.UppercaseChars;
    const lowercaseChars = Config.LowercaseChars;
    const numberChars = Config.NumberChars;
    const symbolChars = Config.SymbolChars;

    let chars = '';

    if (options.uppercase) chars += uppercaseChars;
    if (options.lowercase) chars += lowercaseChars;
    if (options.numbers) chars += numberChars;
    if (options.symbols) chars += symbolChars;

    if (chars.length === 0) {
        console.error("Please select at least one character set.");
        return '';
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }

    return password;
}
