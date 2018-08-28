/**
 * Created by sky on 16/8/23.
 */


/*export class UserError extends Error{
    constructor(name,message,detail,source='system'){
        super(message)
        this.name = name;
        this.message = message;
        this.detail = detail;
        this.source = source;

    }


    toString(){
        //"name:"+this.name+",message:"+this.message
        return "异常";
    }
}*/

export function UserError(name, message, detail) {
    this.name = name;
    this.message = message || 'Default Message';
    this.detail = detail;
    this.stack = (new Error()).stack;
}

UserError.prototype = Object.create(Error.prototype);
UserError.prototype.constructor = UserError;
UserError.prototype.toString = function () {
    return this.message;
};

export const ERROR_TYPE = {
    'REQUEST_ERROR': 'REQUEST_ERROR',
    'DATA_ERROR': 'DATA_ERROR',
    'OTHER_ERROR': 'OTHER_ERROR',
    'NETWORK_ERROR': 'NETWORK_ERROR',
};