"require ui";
"require rpc";
"require baseclass";

const NAME = "dae"

const getInitList = rpc.declare({
	object: "luci." + NAME,
	method: "getInitList",
	params: ["name"],
});

const getInitStatus = rpc.declare({
	object: "luci." + NAME,
	method: "getInitStatus",
	params: ["name"],
});

const setInitAction = rpc.declare({
	object: "luci." + NAME,
	method: "setInitAction",
	params: ["name", "action"],
	expect: { result: false },
});

var RPC = {
	listeners: [],
	on: function (event, callback) {
		var pair = { event: event, callback: callback };
		this.listeners.push(pair);
		return function unsubscribe() {
			this.listeners = this.listeners.filter(function (listener) {
				return listener !== pair;
			});
		}.bind(this);
	},
	emit: function (event, data) {
		this.listeners.forEach(function (listener) {
			if (listener.event === event) {
				listener.callback(data);
			}
		});
	},
	getInitList: function (name) {
		getInitList(name).then(
			function (result) {
				this.emit("getInitList", result);
			}.bind(this)
		);
	},
	getInitStatus: function (name) {
		getInitStatus(name).then(
			function (result) {
				this.emit("getInitStatus", result);
			}.bind(this)
		);
	},
	setInitAction: function (name, action) {
		setInitAction(name, action).then(
			function (result) {
				this.emit("setInitAction", result);
			}.bind(this)
		);
	},
};

var status = baseclass.extend({
	render: function () {
		return Promise.all([
			L.resolveDefault(getInitStatus(NAME), {}),
		]).then(function (data) {
				var text;
				var reply = {
					status: (data[0] && data[0][NAME]) || {
						version: null,
						enabled: null,
						running: null,
					},
				};

				var statusTitle = E(
					"label",
					{ class: "cbi-value-title" },
					_("Service Status")
				);

				text = NAME + " ";
				if (reply.status.version) {
					text += reply.status.version;
				} else {
					text += _("not installed or not found");
				}

				var statusMessage = "";
				if (reply.status.running) {
					statusMessage = E("span", { style: "color: green;" }, _("Running"));
				} else {
					statusMessage = E("span", { style: "color: red;" }, _("Inactive"));
				}

				// var btn_update = E(
				// 	"button",
				// 	{
				// 		class: "btn cbi-button cbi-button-apply",
				// 		disabled: true,
				// 		click: function (ev) {
				// 			ui.showModal(null, [
				// 				E(
				// 					"p",
				// 					{ class: "spinning" },
				// 					_("Starting %s...").format(NAME)
				// 				),
				// 			]);
				// 			return RPC.setInitAction(NAME, "update");
				// 		},
				// 	},
				// 	_("Update")
				// );

				var statusText = E("div", { style: "display: flex; align-items: flex-start;" }, [
					E("div", { style: "display: inline-block;" }, [
						E("div", {}, text),
						E("div", {}, statusMessage)
					]),
					// E("div", { style: "margin-left: 10px;" }, btn_update)
				]);

				var statusField = E("div", { class: "cbi-value-field" }, statusText);
				var statusDiv = E("div", { class: "cbi-value" }, [
					statusTitle,
					statusField,
				]);

				var btn_gap = E("span", {}, "&#160;&#160;");
				var btn_gap_long = E(
					"span",
					{},
					"&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;"
				);
				var btn_start = E(
					"button",
					{
						class: "btn cbi-button cbi-button-apply",
						disabled: true,
						click: function (ev) {
							ui.showModal(null, [
								E(
									"p",
									{ class: "spinning" },
									_("Starting %s...").format(NAME)
								),
							]);
							return RPC.setInitAction(NAME, "start");
						},
					},
					_("Start")
				);

				var btn_action = E(
					"button",
					{
						class: "btn cbi-button cbi-button-apply",
						disabled: true,
						click: function (ev) {
							ui.showModal(null, [
								E(
									"p",
									{ class: "spinning" },
									_("Restarting %s...").format(NAME)
								),
							]);
							return RPC.setInitAction(NAME, "restart");
						},
						// ui.createHandlerFn(this, function() {
						// 	return RPC.setInitAction(NAME, "restart");
						// })
					},
					_("Restart")
				);

				var btn_stop = E(
					"button",
					{
						class: "btn cbi-button cbi-button-reset",
						disabled: true,
						click: function (ev) {
							ui.showModal(null, [
								E(
									"p",
									{ class: "spinning" },
									_("Stopping %s...").format(NAME)
								),
							]);
							return RPC.setInitAction(NAME, "stop");
						},
					},
					_("Stop")
				);

				var btn_enable = E(
					"button",
					{
						class: "btn cbi-button cbi-button-apply",
						disabled: true,
						click: function (ev) {
							ui.showModal(null, [
								E(
									"p",
									{ class: "spinning" },
									_("Enabling %s...").format(NAME)
								),
							]);
							return RPC.setInitAction(NAME, "enable");
						},
					},
					_("Enable")
				);

				var btn_disable = E(
					"button",
					{
						class: "btn cbi-button cbi-button-reset",
						disabled: true,
						click: function (ev) {
							ui.showModal(null, [
								E(
									"p",
									{ class: "spinning" },
									_("Disabling %s...").format(NAME)
								),
							]);
							return RPC.setInitAction(NAME, "disable");
						},
					},
					_("Disable")
				);

				btn_enable.disabled = reply.status.enabled;
				btn_disable.disabled = !reply.status.enabled;

				btn_start.disabled = reply.status.running
				btn_action.disabled = !reply.status.running
				btn_stop.disabled = !reply.status.running

				var buttonsTitle = E(
					"label",
					{ class: "cbi-value-title" },
					_("Service Control")
				);
				var buttonsText = E("div", {}, [
					btn_start,
					btn_gap,
					btn_action,
					btn_gap,
					btn_stop,
					btn_gap_long,
					btn_enable,
					btn_gap,
					btn_disable,
				]);
				var buttonsField = E("div", { class: "cbi-value-field" }, buttonsText);
				var buttonsDiv = reply.status.version
					? E("div", { class: "cbi-value" }, [buttonsTitle, buttonsField])
					: "";
				return E("div", {}, [statusDiv, buttonsDiv]);
			});
	},
});

RPC.on("setInitAction", function (reply) {
	setTimeout(function () {
		ui.hideModal();
		location.reload();
	},1000)
});

return L.Class.extend({
	getStatus: status
});
