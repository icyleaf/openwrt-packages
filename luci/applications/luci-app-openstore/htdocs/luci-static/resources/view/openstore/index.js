'use strict';
'require view';
'require form';
'require uci';
'require fs';
'require ui';

function parseJsonSafe(raw) {
	try {
		return JSON.parse(raw || '{}');
	} catch (e) {
		return {};
	}
}

function joinPath(dirPath, filename) {
	const base = (dirPath || '/usr/bin').replace(/\/+$/, '');
	return base + '/' + filename;
}

async function inspectOwnership(path) {
	try {
		const raw = await fs.exec_direct('/usr/share/openstore/store_helper', ['inspect', path]);
		return parseJsonSafe(raw);
	} catch (e) {
		return {
			path: path,
			exists: false,
			source: 'error',
			owner: ''
		};
	}
}

async function collectConflictState(app) {
	const binaries = (app.binaries || '').split(',').map(function(v) { return v.trim(); }).filter(Boolean);
	const binDir = app.bin_dir || '/usr/bin';
	const checks = [];

	binaries.forEach(function(bin) {
		checks.push(inspectOwnership(joinPath(binDir, bin)));
	});

	const results = await Promise.all(checks);
	const hasOpkgConflict = results.some(function(item) {
		return item && item.source === 'opkg';
	});

	return {
		hasOpkgConflict: hasOpkgConflict,
		ownership: results
	};
}

function appCard(app, arch, conflictState, onInstall) {
	const current = app.current || '-';
	const latest = app.latest || '-';
	const updatable = !!(app.current && app.latest && app.has_update);
	const statusColor = updatable ? '#b54708' : '#067647';
	const statusText = updatable ? _('Update available') : _('Up to date or not installed');
	const installLabel = updatable ? _('Update Now') : _('Install / Reinstall');
	const hasOpkgConflict = !!(conflictState && conflictState.hasOpkgConflict);
	const disabled = !app.asset_url || hasOpkgConflict;
	const ownership = (conflictState && Array.isArray(conflictState.ownership)) ? conflictState.ownership : [];

	return E('div', {
		'class': 'cbi-section',
		'style': 'margin-bottom: 12px;'
	}, [
		E('h3', {}, [ app.name || app.id ]),
		E('div', { 'class': 'cbi-value-description' }, [
			_('ID: %s').format(app.id || '-'), E('br'),
			_('Repository: %s').format(app.repo || '-'), E('br'),
			_('Architecture: %s').format(arch), E('br'),
			_('Binary path: %s').format(app.bin_dir || '/usr/bin'), E('br'),
			_('Config path: %s').format(app.config_dir || '-'), E('br'),
			_('Current: %s').format(current), E('br'),
			_('Latest: %s').format(latest), E('br'),
			E('span', { 'style': 'color:' + statusColor + ';font-weight:600;' }, statusText), E('br'),
			(!app.asset_url) ? E('span', { 'style': 'color:#b91c1c;' }, _('No matching release asset for current architecture.')) : '',
			hasOpkgConflict ? E('span', { 'style': 'color:#b91c1c;font-weight:600;' }, _('Install blocked: target path is managed by opkg.')) : ''
		]),
		ownership.length ? E('div', { 'class': 'cbi-value-description', 'style': 'margin-top:6px;' }, ownership.map(function(item) {
			const owner = item.owner ? String(item.owner) : '-';
			const source = item.source || 'unknown';
			let suggestion = null;
			let suggestionColor = '#6b7280';
			if (source === 'opkg') {
				suggestion = _('Suggested: run "opkg remove %s" first, or change bin_dir to a different path (e.g. /opt/bin)').format(owner);
				suggestionColor = '#b54708';
			} else if (source === 'openstore') {
				suggestion = _('Managed by OpenStore — safe to update in place.');
				suggestionColor = '#067647';
			} else if (source === 'unknown') {
				suggestion = _('Untracked file — will be backed up as *.openstore.bak.* before install.');
				suggestionColor = '#6b7280';
			} else if (source === 'missing') {
				suggestion = _('File not yet installed.');
				suggestionColor = '#6b7280';
			}
			return E('div', { 'style': 'margin-bottom:2px;' }, [
				E('span', {}, _('Ownership %s: %s (%s)').format(item.path || '-', source, owner)),
				suggestion ? E('div', { 'style': 'color:' + suggestionColor + ';font-size:0.875em;margin-left:8px;' }, suggestion) : ''
			]);
		})) : '',
		E('div', { 'style': 'margin-top: 8px;' }, [
			E('button', {
				'class': 'btn cbi-button cbi-button-apply',
				'disabled': disabled ? 'disabled' : null,
				'click': ui.createHandlerFn(this, onInstall, app)
			}, installLabel),
			E('a', {
				'class': 'btn cbi-button cbi-button-action',
				'style': 'margin-left: 6px;',
				'href': 'https://github.com/' + (app.repo || '') + '/releases',
				'target': '_blank',
				'rel': 'noreferrer noopener'
			}, _('Open Releases'))
		])
	]);
}

return view.extend({
	load: function() {
		return Promise.all([
			uci.load('openstore'),
			fs.exec_direct('/usr/share/openstore/store_helper', ['catalog'])
		]);
	},

	render: async function(data) {
		const rawCatalog = data[1];
		const catalog = parseJsonSafe(rawCatalog);
		const apps = Array.isArray(catalog.apps) ? catalog.apps : [];
		const arch = catalog.arch || 'unknown';
		const conflictMap = {};
		const self = this;
		let map, section, option;

		await Promise.all(apps.map(async function(app) {
			conflictMap[app.id] = await collectConflictState(app);
		}));

		async function handleInstall(app) {
			const state = conflictMap[app.id] || { hasOpkgConflict: false };
			if (state.hasOpkgConflict) {
				ui.addNotification(null, E('p', _('Install blocked: one or more target paths are managed by opkg.')), 'error');
				return;
			}

			ui.showModal(_('Installing %s').format(app.name || app.id), [
				E('p', { 'class': 'spinning' }, _('Downloading official release and installing binaries...'))
			]);

			try {
				await fs.exec('/usr/share/openstore/store_helper', ['install', app.id]);
				ui.addNotification(null, E('p', _('Installed/updated %s successfully.').format(app.name || app.id)), 'success');
				location.reload();
			} catch (e) {
				ui.addNotification(null, E('p', _('Install failed for %s: %s').format(app.name || app.id, e.message || e)), 'error');
			} finally {
				ui.hideModal();
			}
		}

		map = new form.Map('openstore', _('OpenStore'), _('Manage a custom catalog of GitHub release-backed applications for the current OpenWrt architecture.'));

		section = map.section(form.TypedSection, 'app', _('Catalog Entries'));
		section.anonymous = true;
		section.addremove = true;
		section.sortable = true;
		section.template = 'cbi/tblsection';
		section.sectiontitle = function(sid) {
			return uci.get('openstore', sid, 'title') || uci.get('openstore', sid, 'id') || sid;
		};

		option = section.option(form.Value, 'id', _('App ID'));
		option.rmempty = false;
		option.placeholder = 'vector';
		option.datatype = 'and(uciname,maxlength(32))';
		option.description = _('Unique identifier used by OpenStore internally. Use lowercase letters, digits, underscore or dash.');

		option = section.option(form.Value, 'title', _('Display Name'));
		option.rmempty = false;
		option.placeholder = 'Vector';

		option = section.option(form.Value, 'repo', _('GitHub Repo'));
		option.rmempty = false;
		option.placeholder = 'owner/repo';
		option.description = _('Repository in owner/repo format.');

		option = section.option(form.Value, 'asset_keyword_amd64', _('amd64 Asset Keyword'));
		option.rmempty = false;
		option.placeholder = 'linux_amd64';
		option.description = _('Substring or regex fragment used to match the amd64 release asset.');

		option = section.option(form.Value, 'asset_keyword_arm64', _('arm64 Asset Keyword'));
		option.rmempty = false;
		option.placeholder = 'linux_arm64';
		option.description = _('Substring or regex fragment used to match the arm64 release asset.');

		option = section.option(form.Value, 'binaries', _('Binary Names'));
		option.rmempty = false;
		option.placeholder = 'traefik';
		option.description = _('Comma-separated executable names to extract and copy into the configured binary directory.');

		option = section.option(form.Value, 'bin_dir', _('Binary Directory'));
		option.rmempty = false;
		option.placeholder = '/usr/bin';
		option.description = _('Target directory where extracted binaries will be installed.');

		option = section.option(form.Value, 'config_dir', _('Config Directory'));
		option.rmempty = true;
		option.placeholder = '/etc/myapp';
		option.description = _('Optional target directory for configuration files extracted from the release asset.');

		option = section.option(form.Value, 'config_files', _('Config Files'));
		option.rmempty = true;
		option.placeholder = 'config.yml,example.toml';
		option.description = _('Optional comma-separated file names or relative paths to copy from the extracted archive into the config directory.');

		option = section.option(form.Value, 'version_cmd', _('Version Command'));
		option.rmempty = true;
		option.placeholder = 'traefik version | sed -n "s/^Version:[[:space:]]*//p" | head -n 1';
		option.description = _('Shell command used to detect the currently installed version. Leave empty if version detection is not needed.');

		option = section.option(form.Flag, 'enabled', _('Enabled'));
		option.default = '1';
		option.rmempty = false;

		const formNode = await map.render();
		const nodes = [
			formNode,
			E('div', { 'class': 'cbi-map' }, [
				E('h2', {}, _('Available Apps')),
				E('div', { 'class': 'cbi-value-description' }, [
					_('Detected architecture: %s').format(arch), E('br'),
					_('After editing catalog entries, click Save & Apply, then Refresh to reload release metadata.')
				]),
				E('div', { 'style': 'margin: 10px 0;' }, [
					E('button', {
						'class': 'btn cbi-button cbi-button-action',
						'click': function() { location.reload(); }
					}, _('Refresh'))
				])
			])
		];

		if (!apps.length) {
			nodes.push(E('div', {
				'class': 'cbi-section'
			}, [
				E('div', { 'class': 'cbi-value-description' }, _('No apps found from catalog. Add at least one entry above, then Save & Apply.'))
			]));
			return E('div', {}, nodes);
		}

		apps.forEach(function(app) {
			nodes.push(appCard.call(self, app, arch, conflictMap[app.id], handleInstall));
		});

		return E('div', {}, nodes);
	}
});
