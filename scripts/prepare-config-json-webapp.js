import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

function getNexusEnvs() {
    const result = {};

    for (const key in process.env) {
        if (key.toUpperCase().startsWith("NEXUS_")) {
            result[key] = process.env[key];
        }
    }
    return result;
}

try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const configPath = path.resolve(__dirname, "..", "frontend", "config.json")
    const fileContent = fs.readFileSync(configPath,  "utf8");
    const jsonConfig = JSON.parse(fileContent);
    const nexusEnv = getNexusEnvs();
    Object.keys(nexusEnv).forEach(configKey => {
        const config = jsonConfig[configKey];
        if (config) {
            console.log("Replacing value: ", configKey, "to: ", nexusEnv[configKey]);
            jsonConfig[configKey].value = nexusEnv[configKey];
        }
    });

    fs.writeFileSync(
        configPath,
        JSON.stringify(jsonConfig, null, 2),
        "utf8"
    );
    
    process.exit(0);

} catch (err) {
    console.error("Error while preparing config.json from env:", err)
    process.exit(1);
}
