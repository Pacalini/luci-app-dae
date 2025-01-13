'use strict';
'require view';
'require form';
'require uci';
'require rpc';
'require fs';
"require dae.status as status";
"require dae.log as log";

const NAME="dae"
const CONF="/etc/dae/config.dae"

const setInitAction = rpc.declare({
	object: "luci." + NAME,
	method: "setInitAction",
	params: ["name", "action"],
	expect: { result: false },
});

function writeConfig(section_id, value) {
	return fs.write(CONF, (value || '').trim().replace(/\r\n/g, '\n') + '\n')
		.then(function(res) {
			setInitAction(NAME, "reload_config");
			location.reload();
		});
}

return view.extend({
	render: function() {
		var title, stat, m, s, o;

		title = new form.Map('dae', 'dae',
			_('eBPF-based Linux high-performance transparent proxy solution.'));

		stat = new status.getStatus();

		m = new form.Map('dae');

		s = m.section(form.NamedSection, 'settings', 'settings');

		s.tab('config', _('Config'));

		o = s.taboption('config', form.TextValue, '_config');
		o.rows = 32;
		o.load = function(section_id) {
			return fs.trimmed('/etc/dae/config.dae');
		};
		o.write = writeConfig;
		o.remove = writeConfig;

		s.tab('control', _('Control'));

		s.tab('log', _('Log'));

		o = s.taboption('log', form.Value, 'logfile_maxsize', _('Log File Max Size (MB)'));
		o.datatype = 'uinteger';
		o.placeholder= '4';

		o = s.taboption('log', form.DummyValue, '_dae_logview');
		o.render = L.bind(log.getRuntimeLog, this);

		return Promise.all([title.render(), stat.render(), m.render()]);
	},
});
