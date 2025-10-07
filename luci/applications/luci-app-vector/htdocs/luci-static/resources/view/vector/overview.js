'use strict';
'require view';
'require form';
'require uci';
'require rpc';
'require fs';
'require poll';
'require ui';

const SUPPORTED_ARCH = ['x86_64', 'aarch64'];
const CONFIG_NAME = 'vector';
const DOWNLOAD_URL = 'https://github.com/vectordotdev/vector/releases/download';
const DOWNLOAD_SUFFIX = '-unknown-linux-musl.tar.gz';

function uciGet(section, option, defaultValue) {
  return uci.get(CONFIG_NAME, section, option) || defaultValue;
}

function uciSet(section, option, value) {
  uci.set(CONFIG_NAME, section, option, value);
  uci.save(CONFIG_NAME);
}

async function isRunning() {
  const status = await callServiceList('vector');
  return status !== null || status !== undefined;
}

const callServiceList = rpc.declare({
  object: 'service',
  method: 'list',
  params: ['name'],
  expect: { '': {} }
});

const callInitAction = rpc.declare({
  object: 'luci',
  method: 'setInitAction',
  params: ['name', 'action'],
  expect: { result: false }
});

// async function getLatestVersion() {
//   const response = await fetch('https://api.github.com/repos/vectordotdev/vector/releases?per_page=5', {
//     method: 'GET',
//     headers: {
//       'Accept': 'application/vnd.github+json',
//       'User-Agent': 'luci-app-vector'
//     }
//   });

//   if (!response.ok) {
//     console.error('Failed to fetch latest version:', response.status);
//     return null;
//     // throw new Error(`Get vector latest version error! status: ${response.status}`);
//   }

//   const releases = await response.json();
//   if (releases && releases.length > 0) {
//     const latest = releases.find(release => !release.name.startsWith("vdev") && !release.prerelease && !release.draft);
//     if (latest) {
//       const version = latest.tag_name.startsWith('v') ? latest.tag_name.slice(1) : latest.tag_name;
//       return version;
//     }
//   }

//   console.log('No valid releases found.');
//   return null;
// }

async function getCurrentVersion() {
  const version = await fs.exec_direct('/usr/share/vector/vector_version.sh');
  return version.trim();
}

async function getArch() {
  const archStd = await fs.exec_direct('/bin/uname', ['-m']);
  return archStd.trim();
}

async function binFileExists() {
  const binPath = uciGet('main', 'bin_path');
  let binExisted = false;
  try {
    binExisted = await fs.stat(binPath || '/usr/bin/vector');
  } catch (e) {
    binExisted = false;
  }

  return binExisted;
}

// detect vector bin file exists
async function globalStatus() {
  const enabled = uciGet('main', 'enabled', '0');
  const binExisted = await binFileExists();
  let serviceRunning = false;
  if (enabled === '1' && binExisted) {
    serviceRunning = await isRunning();
  }

  return { enabled, binExisted, serviceRunning };
}

function renderStatus(status) {
  const spanTemp = '<em><span style="color:%s"><strong>%s %s</strong></span></em>';
  if (!status.binExisted) {
    return String.format(spanTemp, 'red', _('Vector'), _('NOT INSTALLED'));
  }

  if (status.serviceRunning) {
    return String.format(spanTemp, 'green', _('Vector'), _('RUNNING'));
  } else {
    return String.format(spanTemp, 'red', _('Vector'), _('NOT RUNNING'));
  }

  return "a";
}

async function renderBinaryStatus(status, currentVersion) {
  if (status.binExisted) {
    return String.format('<span style="color:green"><strong>%s: %s</strong></span>', _('Binary file exists'), currentVersion);
  } else {
    const arch = await getArch();
    return String.format('<span style="color:red"><strong>%s</strong></span>. %s: %s',
      _('Binary file NOT found'),
      _('Detected Architecture'), arch);
  }
}

function basic_view(m, s, o, data) {
  const { 0: status, 1: arch } = data;

  s.tab('basic', _('Settings'));
  o = s.taboption('basic', form.Flag, 'enabled', _('Enable'));
  o.default = o.disabled;
  o.rmempty = false;

  o = s.taboption('basic', form.Button, 'update', _('Update Vector'));
  o.renderWidget = function (section_id, option_index, cfgvalue) {
    return E([
      E('button', {
        'id': 'update_button',
        'class': 'cbi-button cbi-button-apply',
        'click': ui.createHandlerFn(this, function(event) {
          if (!SUPPORTED_ARCH.includes(arch)) {
            ui.addNotification(null, E('p', _('Unsupported architecture: %s').format(arch)), 'error')
            return;
          }

          const binPath = uciGet('main', 'bin_path', '/usr/bin/vector');
          const btn = event.target;
          const btnText = btn.innerText;
          btn.disabled = true;
          btn.innerText = _('Downloading ...');
          fs.exec('/usr/share/vector/vector_update.sh').then(() => {
            console.log("Downloaded vector tarball");
            ui.addNotification(null, E('p', _('Vector downloaded and installed to %s').format(binPath)), 'success');
            btn.innerText = _('Download success, click to update again');
            btn.disabled = false;
          }).catch((err) => {
            console.error("Error during Vector installation:", err);
            ui.addNotification(null, E('p', _('Error downloading or installing Vector: %s').format(err.message)), 'error');
            btn.innerText = btnText;
            btn.disabled = false;
          });
        })
      }, _('Update')),
      E('button', {
        'id': 'restart_button',
        'class': 'cbi-button cbi-button-apply',
        'style': 'margin-left: 5px;',
        click: function (ev) {
          ui.showModal(null, [
            E(
              "p",
              { class: "spinning" },
              _("Restarting %s service").format(CONFIG_NAME)
            ),
          ]);
          callInitAction(CONFIG_NAME, "restart").then((result) => {
            console.log("Vector service restarted:", result);
            ui.addNotification(
              null,
              E("p", _("Vector service restarted.")),
              "success"
            );
          }).catch((err) => {
            ui.addNotification(
              null,
              E("p", _("Failed to restart %s: %s").format(CONFIG_NAME, err.message)),
              "error"
            );
          }).finally(() => {
            ui.hideModal();
          });
        },
      }, _('Restart')),
      E('p', {
        'id': 'binary_status_div',
        'class': 'cbi-value-description'
      }, _('Install or Update Vector to the latest version.'))
    ]);
  };

  o = s.taboption('basic', form.Value, 'bin_path', _('Vector Binary Path'), _('The binary file path for Vector, typically /usr/bin/vector'));
  o = s.taboption('basic', form.Value, 'config_file', _('Vector Config Path'), _('The configuration file path for Vector, typically /etc/vector/vector.toml'));
}

function service_view(m, s, o) {
  s.tab('service', _('Service'));
  o = s.taboption('service', form.Flag, 'watch_config', _('Watch config'), _('Enable to have Vector watch the config file for changes and reload automatically.'));
  o.default = o.disabled;
  o.rmempty = false;

  o = s.taboption('service', form.Flag, 'log_stdout', _('Log to stdout'), _('Log Vector output to stdout.'));
  o.default = o.disabled;
  o.rmempty = false;

  o = s.taboption('service', form.Flag, 'log_stderr', _('Log to stderr'), _('Log Vector error output to stderr.'));
  o.default = o.disabled;
  o.rmempty = false;

  o = s.taboption('service', form.Flag, 'verbose', _('Verbose output'), _('Enable verbose output for debugging purposes.'));
  o.default = o.disabled;
  o.rmempty = false;
}

return view.extend({
  load() {
    return Promise.all([
      globalStatus(),
      getArch(),
      // getLatestVersion(),
    ]);
  },
  async render(data) {
    const { 0: status, 1: arch } = data;
    let m, s, o;

    m = new form.Map('vector', _('Vector'), _('A lightweight, ultra-fast tool for building observability pipelines.'));
    s = m.section(form.TypedSection);
    s.anonymous = true;
    s.render = function () {
      poll.add(async function() {
        const res = await globalStatus();
        // console.log("Polled status:", res);
        const service_view = document.getElementById("service_status");
        const binary_view = document.getElementById("binary_status_div");

        const statusContent = await renderStatus(res);
        if (service_view && statusContent) {
          service_view.innerHTML = statusContent;
        }

        let currentVersion;
        if (status.binExisted) {
          currentVersion = await getCurrentVersion();
        }
        const binaryContent = await renderBinaryStatus(res, currentVersion);
        if (binary_view && binaryContent) {
          binary_view.innerHTML = binaryContent;
        }
      });

      return E('div', { class: 'cbi-section', id: 'status_bar' }, [
        E('p', { id: 'service_status' }, _('Collecting data ...'))
      ]);
    }

    s = m.section(form.NamedSection, 'main', 'config');

    basic_view(m, s, o, data);
    service_view(m, s, o);

    return m.render();
  },
  // addFooter() {
  //   return E('div', { class: 'cbi-footer' }, [
  //     E('p', {}, [
  //       _('Vector is developed by '),
  //       E('a', { href: 'https://vector.dev', target: '_blank' }, 'Vector.dev'),
  //       _('. This software is provided "as is" and without any warranty. ')
  //     ]),
  //     E('p', {}, [
  //       _('This project is not affiliated with or endorsed by the official Vector project or its maintainers.')
  //     ])
  //   ]);
  // },
});
