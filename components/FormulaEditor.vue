<template>
	<v-dialog v-model="show" fullscreen persistent transition="dialog-bottom-transition">
			<div class="modules-example">
				<v-btn text color="green darken-2" @click="save">Сохранить</v-btn>
				<v-btn text color="grey lighten-1" @click="closeNoSave">Вернуться</v-btn>
<!--				<v-btn @click="log(editor.toJSON().nodes)">Получить ноды</v-btn>-->
				<div id="rete" class="node-editor" style="background-color: #17011F;"></div>
			</div>
	</v-dialog>
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
let selectItems = []
let comparisonSelectItems = [ //TODO: rework value on idx
	{name: "A < B", value: 0, short: '<'},
	{name: "A <= B", value: 1, short: '<='},
	{name: "A == B", value: 2, short: '=='},
	{name: "A != B", value: 3, short: '!='}
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

class SelectControl extends Rete.Control {
	innerid = 0;
	select = null
	array = []
	mode = 'name'
	constructor(emitter, key, id, array, mode = "name") {
		super(key)
		this.emitter = emitter
		this.key = key
		this.innerid = id
		this.type = 'text'
		this.mode = mode
		this.array = array
		this.template = `<select id="${id}" @input="change($event)">${this.returnOption()}</select>`

		this.scope = {
			value: null,
			change: this.change.bind(this)
		};
	}

	change(e) {
		this.scope.value = this.select.value
		/*this.scope.value =
			this.type === "number" ? +e.target.value : e.target.value;*/
		this.update();
	}

	update() {
		if (this.key) this.putData(this.key, this.scope.value);
		this.emitter.trigger("process");
		this._alight.scan();
	}

	mounted() {
		Vue.nextTick(()=>{
			this.select = document.getElementById(this.innerid.toString())
			this.scope.value = this.select.value
			this.update();
		})

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
		this.array.forEach(item=>{
			result+=(start+((this.mode==='name')?item.name:item.value)+mid+item.name+finish)
			console.log(item)
		})
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
		node.data.name = ''
		node.data.val = 0
		let out1 = new Rete.Output("val", "Number", numSocket)
		let ctrl = new SelectControl(this.editor, "name", 'select'+selectID, selectItems, 'name')
		let ctrlNum = new TextControl(this.editor, "val", false, "number")
		selectID++
		return node.addControl(ctrl).addControl(ctrlNum).addOutput(out1)
	}
	worker(node, inputs, outputs) {
		outputs["val"] = node.data.val
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
		/*node.data.res = 0
	    node.data.time = 0*/
		let inpRes = new Rete.Input("res", "Result", numSocket);
		let inpTime = new Rete.Input("time", "Time", numSocket);
		let ctrlRes = new TextControl(this.editor, "previewRes", true, "number");
		let ctrlTime = new TextControl(this.editor, "previewTime", true, "number");

		return node.addControl(ctrlRes).addControl(ctrlTime).addInput(inpRes).addInput(inpTime);
	}
	worker(node, inputs, outputs, {silent} = {}) {

		if (!silent){
			let gotNode = this.editor.nodes.find(n => n.id === node.id)
			gotNode
				.controls.get("previewRes")
				.setValue(inputs["res"][0]);
			gotNode
				.controls.get("previewTime")
				.setValue(inputs["time"][0]);

		}

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
}

class DivideComponent extends Rete.Component{
	constructor() {
		super("Divide");
	}

	builder(node) {
		let inp1 = new Rete.Input("num1", "Number", numSocket);
		let inp2 = new Rete.Input("num2", "Number", numSocket);
		let out1 = new Rete.Output("out1", "Rounded", numSocket);
		let out2 = new Rete.Output("out2", "Base", numSocket);
		let out3 = new Rete.Output("out3", "Remainder", numSocket);

		inp1.addControl(new TextControl(this.editor, "num1", false, "number"));
		inp2.addControl(new TextControl(this.editor, "num2", false, "number"));

		return node
			.addInput(inp1)
			.addInput(inp2)
			.addControl(new TextControl(this.editor, "preview", true))
			.addOutput(out1)
			.addOutput(out2)
			.addOutput(out3)
	}

	worker(node, inputs, outputs, { silent } = {}) {
		let n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;
		let n2 = inputs["num2"].length ? inputs["num2"][0] : node.data.num2;
		let resRounded = Math.round(n1 / n2);
		let resRemainder = n1 % n2;
		let resInt = Math.floor(n1 / n2);

		if (!silent)
			this.editor.nodes
				.find(n => n.id === node.id)
				.controls.get("preview")
				.setValue(resRounded.toString() + ' ' + resInt.toString() + ' ' + resRemainder.toString());


		outputs["num1"] = resRounded;
		outputs["num2"] = resInt;
		outputs["num3"] = resRemainder;
	}

	created(node) {
		console.log("created", node);
	}

	destroyed(node) {
		console.log("destroyed", node);
	}
}

class IfComponent extends Rete.Component{
	constructor() {
		super("If");
	}

	builder(node){
		node.data.cond = "0"
		node.data.textCond = '<'
		let condVal1 = new Rete.Input("condVal1", "Condition Value A", numSocket)
		let condVal2 = new Rete.Input("condVal2", "Condition Value B", numSocket)
		let thenDo = new Rete.Input("then", "Then", numSocket)
		let elseDo = new Rete.Input("else", "Else", numSocket)
		let result = new Rete.Output("result", "Result", numSocket);
		//let cond = new TextControl(this.editor, "cond", false, "text")
		let cond = new SelectControl(this.editor, "cond", 'select'+selectID, comparisonSelectItems, 'value')
		return node
			.addInput(condVal1)
			.addInput(condVal2)
			.addInput(thenDo)
			.addInput(elseDo)
			.addOutput(result)
			.addControl(cond)
	}

	worker(node, inputs, outputs, { silent } = {}){
		let cond = node.data.cond
		node.data.textCond = comparisonSelectItems[node.data.cond].short
		let condVal1 = inputs["condVal1"][0]
		let condVal2 = inputs["condVal2"][0]
		let thenNum = inputs["then"][0]
		let elseNum = inputs["else"][0]
		let res = 0
		let boolRes = true

		console.log(cond, boolRes, condVal1, condVal2, comparisonSelectItems[cond].name, node.data.textCond)
		switch (parseInt(cond)){ //TODO: без парсинта не ловит, хотя в объекте число
			case 0: boolRes&=(condVal1 < condVal2);   break
			case 1: boolRes&=(condVal1 <= condVal2);  break
			case 2: boolRes&=(condVal1 === condVal2); break
			case 3: boolRes&=(condVal1 !== condVal2); break
		}
		if(boolRes)
			res = thenNum
		else
			res = elseNum

		outputs["result"] = res

	}
}

export default {
	name: "FormulaEditor",
	layout: "editor",
	props:["show", "@formula-emit", "protocol"],
	data() {
		return {
			modules: {
				"index.rete": {
					data: {
						id: "demo@0.1.0",
						nodes: {
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
		initialData() {
			return { id: "demo@0.1.0", nodes: {} };
		},
		save(){
			this.$emit("formula-emit", this.editor.toJSON())
			//console.log("sending: ", this.editor.toJSON())
			this.closeNoSave()
		},
		closeNoSave(){
			this.modules = {
				"index.rete": {
					data: {
						id: "demo@0.1.0",
						nodes: {
						}
					}
				},
			}
			this.editor.clear()
			this.editor = null
			this.currentModule = {}
			this.$emit("update:show", false)
		}
	},
	watch:{
		show(nv, lv){
			console.log(nv)
			if(nv){
				setTimeout(async ()=>{
					console.log("Initialising")
					let container = document.querySelector("#rete");

					this.editor = new Rete.NodeEditor("demo@0.1.0", container);
					this.editor.use(ConnectionPlugin, { curvature: 0.4 });
					this.editor.use(AlightRenderPlugin);
					this.editor.use(ContextMenuPlugin);

					let engine = new Rete.Engine("demo@0.1.0");

					this.editor.use(ModulePlugin, { engine, modules: this.modules });

					[
						new NumComponent(),
						new InputComponent(),
						//new ModuleComponent(),
						new OutputComponent(),
						new AddComponent(),
						new MultiplyComponent(),
						new MinusComponent(),
						new DivideComponent(),
						new IfComponent(),
					].map(c => {
						this.editor.register(c);
						engine.register(c);
					});
					if(this.editor !== null) {
						this.editor.on("process connectioncreated connectionremoved", async () => {
							if (this.editor.silent) return;
							await engine.abort();
							await engine.process(this.editor.toJSON());
						});
					}
					this.editor.view.resize();
					this.currentModule.data = this.editor.toJSON();
					this.currentModule = this.modules['index.rete'];
					await this.editor.fromJSON(this.currentModule.data);
					this.editor.trigger("process");
					AreaPlugin.zoomAt(this.editor);

					selectItems = []
					this.protocol.fields.forEach(field=>{
						console.log(field)
						if(field.type!=='separator')
							selectItems.push(field) //TODO: сюда как-то вледело число
					})
				}, 100)

			}
		}
	},
/*	mounted() {
		let container = document.querySelector("#rete");

		/!*alight("#modules", {
			modules: this.modules,
			addModule: this.addModule,
			openModule: this.openModule
		});*!/

		this.editor = new Rete.NodeEditor("demo@0.1.0", container);
		this.editor.use(ConnectionPlugin, { curvature: 0.4 });
		this.editor.use(AlightRenderPlugin);
		this.editor.use(ContextMenuPlugin);

		let engine = new Rete.Engine("demo@0.1.0");

		this.editor.use(ModulePlugin, { engine, modules: this.modules });
		//engine.use(ProfilerPlugin, { this.editor, enabled: true });
		[
			new NumComponent(),
			new InputComponent(),
			new ModuleComponent(),
			new OutputComponent(),
			new AddComponent(),
			new MultiplyComponent(),
			new MinusComponent(),
			new DivideComponent(),
			new IfComponent(),
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
	}*/
};
</script>

<style lang="scss" scoped>
// Since node editor's parent must have a set height
.modules-example {
	height: calc(100vh - 36px);
	width: 100vw;
	background-color: #17011F;
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
