function html(literals, ...customs) {
  let result = '';
  customs.forEach((custom, i) => {
    let lit = literals[i];
    if (Array.isArray(custom)) {
      custom = custom.join('');
    }
    result += lit;
    result += custom;
  });
  result += literals[literals.length - 1];
  return result;
}

function $classList_add(el, classToAdd) {
  let existingClasses = el.getAttribute('class');
  el.setAttribute('class', `${existingClasses} ${classToAdd}`);
}

function $classList_remove(el, classToRemove) {
  let existingClasses = el.getAttribute('class');
  const newClassList = existingClasses.split(' ')
                        .filter((el) => {
                          return el !== classToRemove;
                        })
                        .join(' ');
  el.setAttribute('class', newClassList);
}

export { html, $classList_add, $classList_remove };
