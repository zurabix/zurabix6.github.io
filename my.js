/**
 * Калькулятор стоимости услуги.
 * Пересчёт при изменении количества, типа услуги, опции и свойства.
 * Инициализация — на DOMContentLoaded.
 */

/**
 * Возвращает структуру цен.
 * @returns {Object}
 */
function getPrices() {
  'use strict';
  return {
    types: {
      "1": 10,
      "2": 25,
      "3": 40
    },
    options: {
      "2": {
        office: 0,
        glossy: 5
      }
    },
    optionsLabels: {
      office: "Офисная бумага (+0 руб.)",
      glossy: "Глянцевая бумага (+5 руб.)"
    },
    properties: {
      "3": 15
    },
    propertyLabel: "Ламинация (+15 руб.)"
  };
}

/**
 * Возвращает выбранный тип услуги.
 * @returns {string}
 */
function getSelectedType() {
  'use strict';
  var radios = document.getElementsByName('serviceType');
  var i;
  for (i = 0; i < radios.length; i += 1) {
    if (radios[i].checked) {
      return radios[i].value;
    }
  }
  return '1';
}

/**
 * Возвращает выбранную опцию.
 * @returns {string}
 */
function getSelectedOption() {
  'use strict';
  return document.getElementById('optionSelect').value;
}

/**
 * Возвращает true, если чекбокс свойства отмечен.
 * @returns {boolean}
 */
function isPropertyChecked() {
  'use strict';
  return document.getElementById('propertyCheck').checked;
}

/**
 * Заполняет селект опциями для выбранного типа услуги.
 * @param {string} type
 * @param {Object} prices
 */
function fillOptions(type, prices) {
  'use strict';
  var select = document.getElementById('optionSelect');
  var block = document.getElementById('options-block');
  var labels = prices.optionsLabels;
  var key;
  var opt;

  select.innerHTML = '';

  if (prices.options[type] === undefined) {
    block.style.display = 'none';
    return;
  }

  block.style.display = 'block';
  for (key in prices.options[type]) {
    if (prices.options[type].hasOwnProperty(key)) {
      opt = document.createElement('option');
      opt.value = key;
      opt.innerHTML = labels[key];
      select.appendChild(opt);
    }
  }
}

/**
 * Показывает или скрывает блок свойства и задаёт подпись.
 * @param {string} type
 * @param {Object} prices
 */
function setupProperty(type, prices) {
  'use strict';
  var block = document.getElementById('property-block');
  var label = document.getElementById('propertyLabel');
  var check = document.getElementById('propertyCheck');

  if (prices.properties[type] === undefined) {
    block.style.display = 'none';
    check.checked = false;
    return;
  }

  block.style.display = 'block';
  label.innerHTML = prices.propertyLabel;
}

/**
 * Пересчитывает и выводит стоимость.
 */
function updatePrice() {
  'use strict';
  var prices = getPrices();
  var type = getSelectedType();
  var price = prices.types[type] || 0;
  var opt;
  var qtyInput;
  var totalEl;
  var errorEl;
  var raw;
  var qty;
  var total;

  if (prices.options[type] !== undefined) {
    opt = getSelectedOption();
    if (prices.options[type][opt] !== undefined) {
      price += prices.options[type][opt];
    }
  }

  if (prices.properties[type] !== undefined && isPropertyChecked()) {
    price += prices.properties[type];
  }

  qtyInput = document.getElementById('quantity');
  totalEl = document.getElementById('total');
  errorEl = document.getElementById('error');
  raw = qtyInput.value;

  if (raw.match(/^\d+$/) === null) {
    errorEl.innerHTML = 'Ошибка: количество должно быть целым неотрицательным числом.';
    totalEl.innerHTML = 'Стоимость: —';
    return;
  }

  qty = parseInt(raw, 10);
  total = price * qty;

  errorEl.innerHTML = '';
  totalEl.innerHTML = 'Стоимость: ' + total + ' руб.';
}

/**
 * Обновляет видимость опций и свойства при смене типа услуги.
 */
function updateVisibility() {
  'use strict';
  var prices = getPrices();
  var type = getSelectedType();
  fillOptions(type, prices);
  setupProperty(type, prices);
}

window.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var form = document.getElementById('calc-form');
  var radios = document.getElementsByName('serviceType');
  var i;

  // 1. Отменяем отправку формы (Enter в поле количества и т.п.).
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      updatePrice();
    });
  }

  // 2. Радиокнопки типа услуги.
  for (i = 0; i < radios.length; i += 1) {
    radios[i].addEventListener('change', function () {
      updateVisibility();
      updatePrice();
    });
  }

  // 3. Селект опций.
  document.getElementById('optionSelect').addEventListener('change', updatePrice);

  // 4. Чекбокс свойства.
  document.getElementById('propertyCheck').addEventListener('change', updatePrice);

  // 5. Поле количества.
  document.getElementById('quantity').addEventListener('input', updatePrice);

  // 6. Первичная инициализация.
  updateVisibility();
  updatePrice();
});