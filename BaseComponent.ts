import {ContainerBuilder, YamlFileLoader, JsFileLoader, JsonFileLoader, FileLoader} from "node-dependency-injection";
import * as path from "path";
import * as fs from "fs";

export class BaseComponent {

    protected _componentDir: string = path.resolve(__dirname);
    protected _componentName: string;
    protected _componentConfigDir: string;
    private _fileLoader: FileLoader;
    protected _containerBuilder: ContainerBuilder;
    protected _componentConfigFilesFormat: string;

    private parseEnvironmentVars(configFileName: string): string {
        let fileContent = fs.readFileSync(
            path.join(
                this._componentDir,
                this._componentConfigDir,
                configFileName
            )
        ).toString();
        const envVars = {...process.env};
        for (const envParameterName in envVars) {
            fileContent = fileContent.replace(/%env\((.*)\)%/gmi, envVars[envParameterName]);
        }
        const tmpFile = fs.mkdtempSync(String((new Date()).getMilliseconds()));
        fs.writeFileSync(tmpFile, fileContent);
        return tmpFile;
    }

    protected getComponentDir(): string {
        return this._componentDir;
    }

    protected setComponentConfigFilesFormat(format: string): this {
        if (!this._containerBuilder) {
            throw new Error("You need first to specify container builder with setComponentConfigFilesFormat()");
        }
        switch(format) {
            case 'yml':
            case 'yaml':
                this._fileLoader = new YamlFileLoader(this._containerBuilder);
                this._componentConfigFilesFormat = 'yml';
                break;
            case 'js':
            case 'javascript':
                this._fileLoader = new JsFileLoader(this._containerBuilder);
                this._componentConfigFilesFormat = 'js';
                break;
            case 'json':
                this._fileLoader = new JsonFileLoader(this._containerBuilder);
                this._componentConfigFilesFormat = 'json';
                break;
            default:
                this._fileLoader = new FileLoader(this._containerBuilder);
                this._componentConfigFilesFormat = 'raw';
        }
        return this;
    }

    protected getComponentConfigFilesFormat(): string {
        return this._componentConfigFilesFormat;
    }

    protected load(configFileName: string): this {
        let tmpFilePath: string = this.parseEnvironmentVars(configFileName);
        this._fileLoader.load(tmpFilePath);
        return this;
    }

    protected setContainer(containerBuilder: ContainerBuilder): this {
        this._containerBuilder = containerBuilder;
        return this;
    }

    protected setComponentName(componentName: string): this {
        this._componentName = componentName;
        return this;
    }

    protected getComponentName(): string {
        return this._componentName;
    }

    protected getComponentConfigDir(): string {
        return this._componentConfigDir;
    }

    protected setComponentConfigDir(configFolder: string): this {
        this._componentConfigDir = configFolder;
        return this;
    }
}
