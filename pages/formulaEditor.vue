<template>
    <div class="modules-example">
        <v-btn @click="log(editor.toJSON().nodes)">Получить ноды</v-btn>
        <div id="rete" class="node-editor"></div>
    </div>
</template>

<script>
import Rete from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import AlightRenderPlugin from "rete-alight-render-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import ModulePlugin from "rete-module-plugin";
import AreaPlugin from "rete-area-plugin";
import Vue from "vue";
//import VueRenderPlugin from 'rete-vue-render-plugin';



let numSocket = new Rete.Socket("Number");
let floatSocket = new Rete.Socket("Float");
let selectItems = [
    {name: "Бочки", value: 1, id: 0},
    {name: "Кубы", value: 2, id: 1},
    {name: "Хуи", value: 3, id: 2},
    {name: "Говны", value: 4, id: 3},
]
let selectID = 0

class TextControl extends Rete.Control {
    constructor(emitter, key, readonly, type = "text") {
        super(key);
        this.emitter = emitter;
        this.key = key;
        this.type = type;
        this.template = `<input type="${type}" :readonly="readonly" :value="value" @input="change($event)"/>`;

        this.scope = {
            value: null,
            readonly,
            change: this.change.bind(this)
        };
    }

    onChange() {}

    change(e) {
        this.scope.value =
            this.type === "number" ? +e.target.value : e.target.value;
        this.update();
        this.onChange();
    }

    update() {
        if (this.key) this.putData(this.key, this.scope.value);
        this.emitter.trigger("process");
        this._alight.scan();
    }

    mounted() {
        this.scope.value =
            this.getData(this.key) || (this.type === "number" ? 0 : "...");
        this.update();
    }

    setValue(val) {
        this.scope.value = val;
        this._alight.scan();
    }
}

/*
const VueSelectControl = {
    props: ['emitter', 'ikey', 'getData', 'putData', 'selectItems'],
    template: '<select :items="selectItems" :value="value" @input="change($event)"></select>',
    data() {
        return {
            value: '',
        }
    },
    mixins: [VueRenderPlugin.mixin],
    methods: {
        change(e){
            this.value = +e.target.value;
            this.update();
        },
        update() {
            if (this.ikey)
                this.putData(this.ikey, this.value)
            this.emitter.trigger('process');
        }
    },
    mounted() {
        this.value = this.getData(this.ikey);
    }
}
*/

class SelectControl extends Rete.Control {
    innerid = 0;
    select = null
    constructor(emitter, key, id) {
        super(key);
        this.emitter = emitter;
        this.key = key;
        this.innerid = id
        this.type = 'number'
        this.template = `<select id="${id}" @input="change($event)">${this.returnOption()}</select>`;

        this.scope = {
            value: null,
            change: this.change.bind(this)
        };
    }
    onChange() {
    }

    change(e) {
        console.log(this.select.value)
        this.scope.value = +this.select.value
        /*this.scope.value =
            this.type === "number" ? +e.target.value : e.target.value;*/
        this.update();
        this.onChange();
    }

    update() {
        if (this.key) this.putData(this.key, this.scope.value);
        this.emitter.trigger("process");
        this._alight.scan();
    }

    mounted() {
        Vue.nextTick(()=>{
            this.select = document.getElementById(this.innerid.toString())
        })
        this.scope.value = 0
        this.update();
    }
    setValue(val) {
        this.scope.value = val;
        this._alight.scan();
    }

    returnOption(){
        let start = '<option value="'
        let mid = '">'
        let finish = '</option>'
        let result = ''
        selectItems.forEach(item=>{result+=(start+item.value+mid+item.name+finish)})
        return result
    }
}



class InputComponent extends Rete.Component {
    constructor() {
        super("Input");
        this.module = {
            nodeType: "input",
            socket: numSocket
        };
    }

    builder(node) {
        node.data.val = 0
        let out1 = new Rete.Output("val", "Number", numSocket);
        let ctrl = new SelectControl(this.editor, "val", 'select'+selectID);
        selectID++
        return node.addControl(ctrl).addOutput(out1);
    }
    worker(node, inputs, outputs) {
        outputs["val"] = node.data.val;
    }
}

class ModuleComponent extends Rete.Component {
    constructor() {
        super("Module");
        this.module = {
            nodeType: "module"
        };
    }

    builder(node) {
        let ctrl = new TextControl(this.editor, "module");
        ctrl.onChange = () => {
            console.log(this);
            this.updateModuleSockets(node);
            node._alight.scan();
        };
        return node.addControl(ctrl);
    }

    change(node, item) {
        node.data.module = item;
        this.editor.trigger("process");
    }
}

class OutputComponent extends Rete.Component {
    constructor() {
        super("Output");
        this.module = {
            nodeType: "output",
            socket: numSocket
        };
    }

    builder(node) {
        let inp = new Rete.Input("input", "Number", numSocket);
        let ctrl = new TextControl(this.editor, "name");

        return node.addControl(ctrl).addInput(inp);
    }
}

class OutputFloatComponent extends Rete.Component {
    constructor() {
        super("Float Output");
        this.module = {
            nodeType: "output",
            socket: floatSocket
        };
    }

    builder(node) {
        let inp = new Rete.Input("float", "Float", floatSocket);
        let ctrl = new TextControl(this.editor, "name");

        return node.addControl(ctrl).addInput(inp);
    }
}

class NumComponent extends Rete.Component {
    constructor() {
        super("Number");
    }

    builder(node) {
        let out1 = new Rete.Output("num", "Number", numSocket);
        let ctrl = new TextControl(this.editor, "num", false, "number");

        return node.addControl(ctrl).addOutput(out1);
    }

    worker(node, inputs, outputs) {
        outputs["num"] = node.data.num;
    }
}

class AddComponent extends Rete.Component {
    constructor() {
        super("Add");
    }

    builder(node) {
        let inp1 = new Rete.Input("num1", "Number", numSocket);
        let inp2 = new Rete.Input("num2", "Number", numSocket);
        let out = new Rete.Output("num", "Number", numSocket);

        inp1.addControl(new TextControl(this.editor, "num1", false, "number"));
        inp2.addControl(new TextControl(this.editor, "num2", false, "number"));

        return node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new TextControl(this.editor, "preview", true))
            .addOutput(out);
    }

    worker(node, inputs, outputs, { silent } = {}) {
        let n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;
        let n2 = inputs["num2"].length ? inputs["num2"][0] : node.data.num2;
        let res = n1 + n2;

        if (!silent)
            this.editor.nodes
                .find(n => n.id == node.id)
                .controls.get("preview")
                .setValue(res);

        outputs["num"] = res;
    }

    created(node) {
        console.log("created", node);
    }

    destroyed(node) {
        console.log("destroyed", node);
    }
}

class MinusComponent extends Rete.Component {
    constructor() {
        super("Minus");
    }

    builder(node) {
        let inp1 = new Rete.Input("num1", "Number", numSocket);
        let inp2 = new Rete.Input("num2", "Number", numSocket);
        let out = new Rete.Output("num", "Number", numSocket);

        inp1.addControl(new TextControl(this.editor, "num1", false, "number"));
        inp2.addControl(new TextControl(this.editor, "num2", false, "number"));

        return node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new TextControl(this.editor, "preview", true))
            .addOutput(out);
    }

    worker(node, inputs, outputs, { silent } = {}) {
        let n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;
        let n2 = inputs["num2"].length ? inputs["num2"][0] : node.data.num2;
        let res = n1 - n2;

        if (!silent)
            this.editor.nodes
                .find(n => n.id == node.id)
                .controls.get("preview")
                .setValue(res);

        outputs["num"] = res;
    }

    created(node) {
        console.log("created", node);
    }

    destroyed(node) {
        console.log("destroyed", node);
    }
}

class MultiplyComponent extends Rete.Component{
    constructor() {
        super("Multiply");
    }

    builder(node) {
        let inp1 = new Rete.Input("num1", "Number", numSocket);
        let inp2 = new Rete.Input("num2", "Number", numSocket);
        let out = new Rete.Output("num", "Number", numSocket);

        inp1.addControl(new TextControl(this.editor, "num1", false, "number"));
        inp2.addControl(new TextControl(this.editor, "num2", false, "number"));

        return node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new TextControl(this.editor, "preview", true))
            .addOutput(out);
    }

    worker(node, inputs, outputs, { silent } = {}) {
        let n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;
        let n2 = inputs["num2"].length ? inputs["num2"][0] : node.data.num2;
        let res = n1 * n2;

        if (!silent)
            this.editor.nodes
                .find(n => n.id === node.id)
                .controls.get("preview")
                .setValue(res);

        outputs["num"] = res;
    }

    created(node) {
        console.log("created", node);
    }

    destroyed(node) {
        console.log("destroyed", node);
    }
}

class DivideComponent extends Rete.Component{
    constructor() {
        super("Divide");
    }

    builder(node) {
        let inp1 = new Rete.Input("num1", "Number", numSocket);
        let inp2 = new Rete.Input("num2", "Number", numSocket);
        let out = new Rete.Output("num", "Number", numSocket);

        inp1.addControl(new TextControl(this.editor, "num1", false, "number"));
        inp2.addControl(new TextControl(this.editor, "num2", false, "number"));

        return node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new TextControl(this.editor, "preview", true))
            .addOutput(out);
    }

    worker(node, inputs, outputs, { silent } = {}) {
        let n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;
        let n2 = inputs["num2"].length ? inputs["num2"][0] : node.data.num2;
        let res = n1 / n2;

        if (!silent)
            this.editor.nodes
                .find(n => n.id === node.id)
                .controls.get("preview")
                .setValue(res);

        outputs["num"] = res;
    }

    created(node) {
        console.log("created", node);
    }

    destroyed(node) {
        console.log("destroyed", node);
    }
}

export default {
    name: "formulaEditor.vue",
    layout: "editor",
    data() {
        return {
            modules: {
                "index.rete": {
                    data: {
                        id: "demo@0.1.0",
                        nodes: {
                            "5": {
                                id: 5,
                                data: {
                                    num1: 0,
                                    num2: 0
                                },
                                inputs: {
                                    num1: {
                                        connections: [
                                            {
                                                node: 12,
                                                output: "...",
                                                data: {}
                                            }
                                        ]
                                    },
                                    num2: {
                                        connections: [
                                        ]
                                    }
                                },
                                outputs: {
                                    num: {
                                        connections: []
                                    }
                                },
                                position: [1217, 123],
                                name: "Add"
                            },
                            "12": {
                                id: 12,
                                data: {
                                    num: 1
                                },
                                inputs: {},
                                outputs: {
                                    num: {
                                        connections: [
                                            {
                                                node: 5,
                                                input: "...",
                                                data: {}
                                            },
                                        ]
                                    }
                                },
                                position: [410, 212],
                                name: "Number"
                            }
                        }
                    }
                },
            },
            currentModule: {},
            editor: null
        };
    },
    methods: {
        log(s){
            console.log(s)
        },
        async openModule(name) {
            this.currentModule.data = this.editor.toJSON();
            this.currentModule = this.modules[name];
            await this.editor.fromJSON(this.currentModule.data);
            this.editor.trigger("process");
        },
        /*addModule() {
            this.modules["module" + Object.keys(this.modules).length + ".rete"] = {
                data: this.initialData()
            };
        },*/
        initialData() {
            return { id: "demo@0.1.0", nodes: {} };
        }
    },
    mounted() {
        let container = document.querySelector("#rete");

        /*alight("#modules", {
            modules: this.modules,
            addModule: this.addModule,
            openModule: this.openModule
        });*/

        this.editor = new Rete.NodeEditor("demo@0.1.0", container);
        this.editor.use(ConnectionPlugin, { curvature: 0.4 });
        this.editor.use(AlightRenderPlugin);
        this.editor.use(ContextMenuPlugin);

        let engine = new Rete.Engine("demo@0.1.0");

        this.editor.use(ModulePlugin, { engine, modules: this.modules });
        //engine.use(ProfilerPlugin, { this.editor, enabled: true });
        [
            new NumComponent(),
            new AddComponent(),
            new InputComponent(),
            new ModuleComponent(),
            new OutputComponent(),
            new OutputFloatComponent(),
            new MultiplyComponent(),
            new MinusComponent(),
            new DivideComponent(),
        ].map(c => {
            this.editor.register(c);
            engine.register(c);
        });
        this.editor.on("process connectioncreated connectionremoved", async () => {
            if (this.editor.silent) return;

            await engine.abort();
            await engine.process(this.editor.toJSON());
        });
        this.editor.view.resize();
        this.openModule("index.rete").then(() => {
            AreaPlugin.zoomAt(this.editor);
        });
    }
};
</script>

<style lang="scss" scoped>
// Since node editor's parent must have a set height
.modules-example {
    height: 100vh;
    width: 100vw;
}

// From codepen
#rete {
    height: 100% !important;
}
#modules {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 5;
}
.module-list {
    padding: 5px;
    cursor: pointer;
}
.module:hover {
    color: #a167e7;
}
.node .socket.number {
    background: #96b38a;
}
.node .socket.float {
    background: red;
}
</style>
