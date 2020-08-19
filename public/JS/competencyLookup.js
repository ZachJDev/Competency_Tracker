const competenciesInput = document.querySelector('#competencies-input');

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


function debounce(func, wait, immediate) {
  let timeout;

  return function () {
    const context = this; const
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

const lookup = debounce(() => {
  fetch('/competencies/json?num=1').then((res) => res.json())
    .then((body) => {
      console.log(body);
    });
}, 250);

competenciesInput.addEventListener('click', lookup);
