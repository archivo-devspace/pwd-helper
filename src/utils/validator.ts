import * as fs from "fs";
import * as path from "path";
import ConfigType, { ValidatorConfigType } from "../types/config.type";
import Config from "../constants/config";
import { PasswordStrengthStatus } from "../types/validator.type";

export async function checkStrengthStatus({
  password,
  key = "default",
}: {
  password: string;
  key?: keyof ValidatorConfigType;
}): Promise<{
  status: PasswordStrengthStatus | null;
  message: string;
}> {
  try {
    const data = await fs.promises
      .readFile(path.join(process.cwd(), Config.FileName), "utf8");
    const config: ConfigType = JSON.parse(data);
    return checkPasswordStrength({
      password,
      validatorConfig: config.validator,
      key,
    });
  } catch (err : any) {
    if (err.code === "ENOENT") {
      console.error(
        `${Config.FileName} file is required in the project root folder.`
      );
    } else {
      console.log("Error : ", err);
      console.error("Error message : ", err.message);
    }
    return {
      status: null,
      message: `Error : ${err.message}`,
    };
  }
}

function checkPasswordStrength({
  password,
  validatorConfig,
  key,
}: {
  password: string;
  validatorConfig: ValidatorConfigType;
  key: keyof ValidatorConfigType;
}): {
  status: PasswordStrengthStatus;
  message: string;
} {
  const vConfig = validatorConfig[key];
  const minLength = vConfig.minLength;
  const criteria: any = {};

  if (vConfig.lowercase) {
    criteria.lowercases = Config.LowercaseChars;
  }

  if (vConfig.numbers) {
    criteria.numbers = Config.NumberChars;
  }

  if (vConfig.uppercase) {
    criteria.uppercases = Config.UppercaseChars;
  }

  if (vConfig.symbols) {
    criteria.symbols = Config.SymbolChars;
  }

  // Determine password strength status
  if (password.length < minLength) {
    return {
      status: "low",
      message: "Password should be at least 8 characters long.",
    };
  }

  const missingCriteria = Object.entries<RegExp>(criteria)
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
