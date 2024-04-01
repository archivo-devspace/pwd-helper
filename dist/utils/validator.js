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
exports.checkStrengthStatus = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const config_1 = __importDefault(require("../constants/config"));
function checkStrengthStatus({ password, key = "default", }) {
    return fs.promises
        .readFile(path.join(process.cwd(), config_1.default.FileName), "utf8")
        .then((data) => {
        const config = JSON.parse(data);
        return checkPasswordStrength({
            password,
            validatorConfig: config.validator,
            key,
        });
    })
        .catch((err) => {
        if (err.code === "ENOENT") {
            console.error(`${config_1.default.FileName} file is required in the project root folder.`);
        }
        else {
            console.log("Error : ", err);
            console.error("Error message : ", err.message);
        }
        return {
            status: null,
            message: `Error : ${err.message}`,
        };
    });
}
exports.checkStrengthStatus = checkStrengthStatus;
function checkPasswordStrength({ password, validatorConfig, key, }) {
    const vConfig = validatorConfig[key];
    const minLength = vConfig.minLength;
    const criteria = {};
    if (vConfig.lowercase) {
        criteria.lowercases = config_1.default.LowercaseChars;
    }
    if (vConfig.numbers) {
        criteria.numbers = config_1.default.NumberChars;
    }
    if (vConfig.uppercase) {
        criteria.uppercases = config_1.default.UppercaseChars;
    }
    if (vConfig.symbols) {
        criteria.symbols = config_1.default.SymbolChars;
    }
    // Determine password strength status
    if (password.length < minLength) {
        return {
            status: "low",
            message: "Password should be at least 8 characters long.",
        };
    }
    const missingCriteria = Object.entries(criteria)
        .filter(([_, regex]) => !regex.test(password))
        .map(([key]) => key);
    if (missingCriteria.length > 0) {
        return {
            status: "medium",
            message: `Password should contain ${missingCriteria.join(", ")}.`,
        };
    }
    // Password meets all criteria
    return {
        status: "high",
        message: "Password is strong.",
    };
}
