import { ServiceModel, AppObject, Component, ComponentDataInput, ComponentOption, ComponentComboBox } from 'backappjh';

export class Operations extends AppObject {
    private static languages: Array<any>;

    public static getLanguages() {
        return this.languages;
    }

    constructor(father?: Component) {
        super(father);
    }

    public run() {
        let _self = this;
    }
}
