const Validator = function (options = {}) {

  const form = document.getElementById(options.id || 'myform'),
    error = new Set(),
    pattern = {
      email: /^\w+@\w{2,6}\.\w{2,7}/,
      phome: /^\+?[783][\d-\(\)]{10}/
    },
    validarorMethod = {
      notEmpty: (elem) => elem.value.trim !== "",
      pattern: (elem, pattern) => pattern.test(elem.value)
    };

  for (let key in options.pattern || {}) {
    pattern[key] = options.pattern[key];
  }
  const isValid = (elem) => {
    const methods = options.method[elem.name];

    if (methods != undefined) {
      return methods.every(x => validarorMethod[x[0]](elem, pattern[x[1]]));
    }
    return true;
  };

  const checkIt = (event) => {
    let target = event.target;

    if (isValid(target)) {
      showSuccess(target);
      error.delete(target);
    } else {
      showError(target);
      error.add(target);
    }
  };

  const elements = [...form.elements].filter(x => x.tagName != 'BUTTON');
  elements.forEach(elem => {
    elem.addEventListener('change', checkIt)
  });

  const generateErrDiv = (options = {}) => {
    const errorDiv = document.createElement(options.type || 'div');
    errorDiv.textContent = options.errorText || 'Ошибка валидации';
    errorDiv.classList.add('validator_error--text');
    return errorDiv;
  };

  const showError = (elem) => {
    elem.classList.add('validator_error');
    elem.classList.remove('validator_success');
    if (!elem.nextElementSibling.classList.contains('validator_error--text')) {
      elem.insertAdjacentElement('afterend', generateErrDiv());
    }
  };

  const showSuccess = (elem) => {
    elem.classList.add('validator_success');
    elem.classList.remove('validator_error');
    if (elem.nextElementSibling.classList.contains('validator_error--text')) {
      elem.nextElementSibling.remove();
    }
  };

  form.addEventListener('submit', ev => {
    elements.forEach(x => checkIt({
      target: x
    }));
    if (error.size > 0) {
      ev.preventDefault();
    }
  });
};