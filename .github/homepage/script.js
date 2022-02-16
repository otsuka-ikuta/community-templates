let xhr = new XMLHttpRequest();

function get_meta() {
  let body = document.getElementById('body');
  let root = document.createElement('ul');
  root.className = 'folder';
  root.id = 'id_0';
  body.appendChild(root);

  xhr.open('GET', '/meta.json');
  xhr.responseType = 'json'
  xhr.send();
}

xhr.onload = function () {
  if (xhr.status != 200) {
    console.log(`Error ${xhr.status}: ${xhr.statusText}`);
  } else {
    console.log('Complete download');
    parse_meta(xhr.response.next, 'id_0')
  }
}

xhr.onprogress = function (event) {
  if (event.lengthComputable) {
    console.log(`Download meta: ${event.loaded} bite. Total: ${event.total} bite`);
  } else {
    console.log(`Download meta: ${event.loaded} bite`);
  }

};

function parse_meta(meta, id) {
  // console.log(`parse ${id}`);
  let parent = document.getElementById(id);
  let isTemplateOnly = true;
  let tmpl_container = document.createElement('div');
  tmpl_container.className = 'container';
  meta.forEach(
    function (item, i, meta) {
      let li = document.createElement('li');
      switch (item.type) {
        case 'folder':          
          let ul = document.createElement('ul');
          li.className = 'folder';
          li.innerHTML = item.name;
          ul.id = id + '_' + i;
          li.append(ul);
          parent.append(li);
          parse_meta(item.next, ul.id);
          isTemplateOnly = false
          break;
        case 'template':
          let template = document.createElement('div');
          template.className = 'template'
          template.id = id + '_' + i;
          template.insertAdjacentHTML('beforeend', `<a href = "https://github.com/zabbix/community-templates/tree/main/${item.path.join('/')}"><p id = ${id + '_' + i + '_name'} class = "template_name">${item.template}</p></a>`)
          template.insertAdjacentHTML('beforeend', `<p id = ${id + '_' + i + '_desc'} class = "template_desc">${item.description}</p>`)         
          let versions = document.createElement('div');
          let tags = document.createElement('div');
          versions.className = 'version';
          tags.className = 'tag';
          let vers = item.versions;
          vers.forEach(function(ver, v, vers) {
            versions.insertAdjacentHTML('beforeend', `<p>${ver.version.toFixed(1)}</p>`)
          });
          let tgs = item.tags;
          tgs.forEach(function(tg, t, tgs) {
            tags.insertAdjacentHTML('beforeend', `<p>${tg}</p>`)
          });
          template.append(versions);
          template.append(tags)
          tmpl_container.append(template);          
          break;
        default:
          console.log(`Unknown meta type: ${item.type}`)
      }
    });
  if (tmpl_container.childElementCount) {
    let li = document.createElement('li');
    li.append(tmpl_container);
    parent.append(li);
  }
  if (isTemplateOnly) {
    parent.className = 'folder_template';
  }
}