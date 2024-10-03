import { DynamicObject, withoutNulls } from "./util";

 interface MediaData {
    name?:string;
    type?:string;
    size?:number;
    url?:string;
}

export default class Media {

    name?:string;
    type?:string;
    size?:number;
    url?:string;

    constructor({
        name,
        type,
        size,
        url,
    }:{
    name?:string;
    type?:string;
    size?:number;
    url?:string;
    }){
        this.name =name,
        this.size=size;
        this.type=type;
        this.url=url;

    }

    toFirestore(){
        const serialized = withoutNulls({
            name: this.name,
            type: this.type,
            size: this.size,
            url: this.url
        });
    
        return serialized;
    }
   static fromFirestore(data:MediaData){
    const deserialized =   new Media({
            name:data.name,
            type:data.type,
            size:data.size,
            url:data.url
        });
        return deserialized;
    }
}

export {MediaData}