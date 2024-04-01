"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const config_1 = __importDefault(require("../constants/config"));
function generate() {
    return fs.promises.readFile(path.join(process.cwd(), config_1.default.FileName), 'utf8').then((data) => {
        const config = JSON.parse(data);
        const { generator: { default: { length, lowercase, numbers, symbols, uppercase } } } = config;
        return generateRandomPassword(length, { uppercase, lowercase, numbers, symbols });
    }).catch(err => {
        console.error(`${config_1.default.FileName} file is required in the project root folder.`);
        console.error(err.message);
        return '';
    });
}
exports.generate = generate;
function generateRandomPassword(length, options) {
    const uppercaseChars = config_1.default.UppercaseChars;
    const lowercaseChars = config_1.default.LowercaseChars;
    const numberChars = config_1.default.NumberChars;
    const symbolChars = config_1.default.SymbolChars;
    let chars = '';
    if (options.uppercase)
        chars += uppercaseChars;
    if (options.lowercase)
        chars += lowercaseChars;
    if (options.numbers)
        chars += numberChars;
    if (options.symbols)
        chars += symbolChars;
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
