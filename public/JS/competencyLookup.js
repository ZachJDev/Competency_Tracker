function formatComp(comp) {
  return comp.title;
}

$(document).ready(() => {
  $('.js-example-basic-multiple').select2({
    // width: '100%',
    // dropdownAutoWidth: true,
    dropdownCssClass: ':all:',
    templateSelection: formatComp,
  });
});
