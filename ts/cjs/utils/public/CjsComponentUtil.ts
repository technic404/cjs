import { CjsComponent } from "../../objects/CjsComponent";


export function wrap<T extends CjsComponent>(prototype: new () => T): T {
    const instance = new prototype();
    
    return instance;
}