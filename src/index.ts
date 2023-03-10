import Serverless from "serverless";

class ServerlessLocalNodejsManager {
    serverless: Serverless;
    hooks: Record<string, Function>;

    constructor(serverless: Serverless) {
        this.serverless = serverless;
        this.hooks = {
            "before:package:initialize": () => this.checkLocalNodejsVersion(),
            "before:deploy:deploy": () => this.checkLocalNodejsVersion(),
        };
    }

    checkLocalNodejsVersion(): void {
        const service = this.serverless.service;
        const {localNodejsVersion} = service.custom;
        if (!localNodejsVersion) return;

        const version = localNodejsVersion.toString();
        const versionData = this.validateLocalNodejsVersion(version);

        const installedNodejsVersion = process.version.substring(1);
        const installedVersionData = this.getVersionData(installedNodejsVersion);

        const count = Math.min(versionData.length, installedVersionData.length);
        for (let i = 0; i < count; i++) {
            if (versionData[i] !== installedVersionData[i]) {
                this.throwServerlessError(`Installed Node.js version does not match required version: required=${version}, installed=${installedNodejsVersion}`);
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

    throwServerlessError(message: string): void {
        // @ts-ignore
        throw new this.serverless.classes.Error(message);
    }
}

module.exports = ServerlessLocalNodejsManager;