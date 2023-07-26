const selectedHeadADom = document.querySelector('.next-shell-header .next-menu-selectable-single .next-selected a');

let STR_1 = selectedHeadADom.innerText + ' - ';

let STR_2 = '';

const list = [];

const asidUlDom = document.querySelector('.next-shell-aside .next-menu-selectable-single');

Array.from(asidUlDom.children).forEach(liDom => {

  if (liDom?.title) {
    STR_2 = liDom?.title

    return
  }

  list.push({
    '页面名称': STR_1 + STR_2 + ' - ' + liDom.children[0].children[0].children[0].innerText,
    'url': liDom.children[0].children[0].children[0].href

  })


});

console.log(list)
