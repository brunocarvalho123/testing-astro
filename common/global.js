var Global = {};

Global.getMdProperties = (rawMd) => {
  let properties = {};

  let mdHeader = rawMd.split('\n---')[0];
  mdHeader = mdHeader.split('---\n')[1];

  mdHeader.split('\n').forEach(prop => {
    properties[prop.split(':')[0]] = prop.match(/.*:.*'(.*)'/i)[1];
  });

  return properties;
}

Global.toMdProperties = (obj) => {
  let mdProps = '---\n';

  Object.entries(obj).forEach(entry => {
    mdProps += `${entry[0]}: '${entry[1]}'\n`;
  });

  mdProps += '---';
  return mdProps;
}

module.exports = Global;