// @ts-ignore
import {ContainerBuilder, YamlFileLoader, JsFileLoader, JsonFileLoader, FileLoader} from "node-dependency-injection";

export class BaseComponent {

    protected _componentDir: string;
    protected _componentName: string;
    protected _componentConfigDir: string;
    protected _componentConfigFilesFormat: string;
    protected _fileLoader: FileLoader;

    public getComponentDir() {
        return this._componentDir;
    }

    public getComponentName() {
        return this._componentName;
    }

    public getComponentConfigDir() {
        return this._componentConfigDir;
    }

    public getFileLoader() {
        return this._fileLoader;
    }
}