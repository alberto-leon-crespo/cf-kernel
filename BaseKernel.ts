import {EventEmitter} from "events";
import * as fs from "fs";
import * as yaml from "js-yaml";
import {ContainerBuilder, Definition, JsFileLoader, JsonFileLoader, YamlFileLoader} from "node-dependency-injection";
import * as path from "path";
import * as tmp from "tmp";
import {Server} from "./http/Server";
import {BaseComponentInterface} from "./BaseComponentInterface";

export class BaseKernel {
    protected _ConfigDir: string;
    protected _LogDir: string;
    protected _RootDir: string;
    protected _Environment: string;
    protected _Container: ContainerBuilder;
    protected _Components: BaseComponentInterface[];
    protected _Port: number;
    protected _Ip: string;
    protected _SSL: boolean;

    public constructor(
        port: number,
        ip: string,
        ssl: boolean,
        relativeConfigDirProjectPath: string,
        components: BaseComponentInterface[]
    ) {
        this._Port = port;
        this._Ip = ip;
        this._SSL = ssl;
        if (relativeConfigDirProjectPath) {
            this._ConfigDir = path.join(process.cwd(), relativeConfigDirProjectPath);
        }
        this._RootDir = path.join(process.cwd());
        this._Container = new ContainerBuilder(true);
        const serverDefinition = new Definition(Server, [port, ip, ssl]);
        serverDefinition.addMethodCall('setKernel', [this]);
        this._Container.setDefinition('server', serverDefinition);
        const kernelDefinition = new Definition(BaseKernel);
        kernelDefinition.synthetic = true;
        this._Container.setDefinition('kernel', kernelDefinition);
        this._Container.set('kernel', this);
        this._Components = components;
    }

    public boot() {
        this.initializeContainerConfig();
        this.initializeComponents();
        this.compileContainer();
        this.postCompileContainerActions();
        this._Container.get('server').start();
    }

    public getEnvironment() {
        return this._Environment;
    }

    public getRootDir() {
        return this._RootDir;
    }

    public getConfigDir() {
        return this._ConfigDir;
    }

    public getContainer() {
        return this._Container;
    }

    public getLogDir() {
        return this._LogDir;
    }

    public getCharset() {
        return "UTF-8";
    }

    public getServer() {
        return this._Container.get('server');
    }

    private parseEnvironmentVars(rawFileContent: string): string {
        const envVars = {...process.env};
        for (const envParameterName in envVars) {
            rawFileContent = rawFileContent.replace(/%env\((.*)\)%/gmi, envVars[envParameterName]);
        }
        const tmpFile = tmp.fileSync();
        fs.writeFileSync(tmpFile, rawFileContent);
        return tmpFile;
    }

    private initializeContainerConfig() {
        const yamlFileLoader: YamlFileLoader = new YamlFileLoader(this._Container);
        const jsonFileLoader: JsonFileLoader = new JsonFileLoader(this._Container);
        const jsFileLoader: YamlFileLoader = new JsFileLoader(this._Container);
        fs.readdirSync(this._ConfigDir).forEach((file) => {
            let rawContent = fs.readFileSync(path.join(this._ConfigDir, file)).toString();
            const [fileName, fileNameWithoutExtension, fileExtension] =/^([a-zA-Z]*)\.(\S+)$/gmi.exec(file);
            let parsedFilePath = this.parseEnvironmentVars(rawContent);
            switch (fileExtension.toLowerCase()) {
                case "json":
                    jsonFileLoader.load(parsedFilePath);
                    break;
                case "js":
                    jsFileLoader.load(parsedFilePath);
                    break;
                case "yaml":
                    yamlFileLoader.load(parsedFilePath);
                    break;
                case "yml":
                    yamlFileLoader.load(parsedFilePath);
                    break;
            }
            fs.unlinkSync(parsedFilePath);
        });
        this._Environment = process.env.CF_ENVIRONMENT;
        if (!this._Environment) {
            throw new Error("You must especify local environment var CF_ENVIRONMENT");
        }
        if (this._Environment === "production") {
            process.env.PWD = path.join(process.env.PWD, "dist");
            this._RootDir = process.env.PWD;
        }
        this._Container.setParameter("environment", this._Environment);
    }

    private initializeComponents() {
        for (const componentIndex in this._Components) {
            this._Components[componentIndex].loadComponent(this._Container);
        }
    }

    private compileContainer() {
        this._Container.compile();
    }

    private postCompileContainerActions() {
        this._Container.get('server').setKernel(this);
        if (this._Container.hasDefinition("eventmanager")) {
            const eventManagerService = this._Container.get("eventmanager");
            this._Container.get('server').setEventManager(eventManagerService);
        } else {
            this._Container.get('server').setEventManager(
                {
                    getEventEmitter() {
                        return new EventEmitter();
                    }
                }
            );
        }
    }
}
