'use strict';
'require fs';
'require ui';
'require uci';
'require view';

const CONFIG_PATH = uci.get('vector', 'main', 'config_file') || '/etc/vector/config.yaml';

let configEditor = null;

async function loadCodeMirrorResources() {
  const styles = [
    '/luci-static/resources/codemirror-5/lib/codemirror.css',
    '/luci-static/resources/codemirror-5/theme/base16-dark.css',
  ];
  const scripts = [
    '/luci-static/resources/codemirror-5/lib/codemirror.js',
    '/luci-static/resources/codemirror-5/addon/display/autorefresh.js',
    '/luci-static/resources/codemirror-5/addon/display/fullscreen.js',
    '/luci-static/resources/codemirror-5/addon/selection/active-line.js',
    '/luci-static/resources/codemirror-5/mode/yaml/yaml.js',
    '/luci-static/resources/codemirror-5/mode/toml/toml.js',
  ];
  const loadStyles = async () => {
    for (const href of styles) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  };
  const loadScripts = async () => {
    for (const src of scripts) {
      const script = document.createElement('script');
      script.src = src;
      document.head.appendChild(script);
      await new Promise(resolve => script.onload = resolve);
    }
  };
  await loadStyles();
  await loadScripts();
}

function lazyLoadCodeMirror(interval = 1000) {
  setTimeout(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      configEditor = CodeMirror.fromTextArea(textarea, {
        autoRefresh: true,
        lineNumbers: true,
        lineWrapping: true,
        matchBrackets: true,
        styleActiveLine: true,
        fullScreen: true,
        theme: "base16-dark",
        extraKeys: {
          "F11": function(cm) {
            cm.setOption("fullScreen", !cm.getOption("fullScreen"));
          },
          "Esc": function(cm) {
            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
          }
        }
      });
    }
  }, interval);
}

function saveConfig() {
  const textarea = document.querySelector('textarea');
  if (!textarea) {
    ui.addNotification(null, E('p', _('Configuration textarea not found.')), 'error');
    return;
  }
  const previouseContent = textarea.value;
  const newContent = configEditor ? configEditor.getValue() : previouseContent;
  if (newContent === previouseContent) {
    ui.addNotification(null, E('p', _('No changes detected in configuration.')), 'info');
    return;
  }

  console.log("Saving config:", newContent);

  return fs.write(CONFIG_PATH, newContent).then(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    textarea.value = newContent;
    ui.addNotification(null, E('p', _('Configuration saved: %s').format(CONFIG_PATH)), 'success');
  }).catch((err) => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    ui.addNotification(null, E('p', _('Error saving configuration: %s').format(err.message)), 'error');
    console.error("Error writing config:", err);
  });
}

return view.extend({
  load: async () => {
    await loadCodeMirrorResources();
    lazyLoadCodeMirror();
  },
  render: async () => {
    const content = await fs.read(CONFIG_PATH);
    const rows = content.split("\n").length + 1;
    return E([], [
      E('div', {}, [
        E('textarea', {
          id: 'syslog',
          wrap: 'off',
          rows: rows,
        }, [ content ]),
      ])
    ]);
  },
  handleSave: saveConfig,
  handleSaveApply: null,
  handleReset: null
});
