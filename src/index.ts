import Serverless from "serverless";

const MAX_VERSION_DATA_LENGTH: number = 3;

class ServerlessLocalNodejsManager {
    serverless: Serverless;
    hooks: Record<string, Function>;

    constructor(serverless: Serverless) {
        this.serverless = serverless;
        this.hooks = {
            "before:package:initialize": () => this.checkLocalNodejsVersion(),
            "before:deploy:deploy": () => this.checkLocalNodejsVersion(),
            "before:deploy:function:initialize": () => this.checkLocalNodejsVersion(),
        };
    }

    checkLocalNodejsVersion(): void {
        const service = this.serverless.service;
        const {localNodejsVersion} = service.custom;
        if (!localNodejsVersion) return;

        if (typeof localNodejsVersion !== "string") {
            this.throwServerlessError("localNodejsVersion must be in string type");
        }
        const versionData = this.validateLocalNodejsVersion(localNodejsVersion);

        const installedNodejsVersion = process.version.substring(1);
        const installedVersionData = this.getVersionData(installedNodejsVersion);

        const count = Math.min(versionData.length, installedVersionData.length);
        for (let i = 0; i < count; i++) {
            if (versionData[i] !== installedVersionData[i]) {
                const requiredVersionString = this.getRequiredVersionString(versionData);
                this.throwServerlessError(`Installed Node.js version does not match required version: required=${requiredVersionString}, installed=${installedNodejsVersion}`);
            }
        }
    }

    getVersionData(version: string): string[] {
        return version.split(".");
    }

    validateLocalNodejsVersion(version: string): string[] {
        const versionData = this.getVersionData(version);
        for (let i = 0; i < versionData.length; i++) {
            const data = versionData[i];
            if (!data || Number(data) <= 0) {
                this.throwServerlessError(`Invalid local Node.js version: ${version}`);
            }
        }
        return versionData;
    }

    getRequiredVersionString(versionData: string[]): string {
        let str = versionData[0];
        for (let i = 1; i < MAX_VERSION_DATA_LENGTH; i++) {
            str += `.${versionData.length > i ? versionData[i] : "x"}`;
        }
        return str;
    }

    throwServerlessError(message: string): void {
        // @ts-ignore
        throw new this.serverless.classes.Error(message);
    }
}

module.exports = ServerlessLocalNodejsManager;