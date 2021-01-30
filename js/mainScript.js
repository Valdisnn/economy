window.addEventListener('DOMContentLoaded', () => { // браузер полностью загрузил HTML

  // строгий режим для браузера
  'use strict';
  // переменные для функции формулировки правильного написания дня
  const DAY_STRING = ['день', 'дня', 'дней'];
  // данные со значениями для определения цены по запросам
  const DATA = {
    whichSite: ['landing', 'multiPage', 'onlineStore'], // тип сайта
    price: [5000, 8500, 25000], // начальная цена
    desktopTemplates: [50, 40, 30], // процент разработки варфрейма
    adapt: 20, // адаптация для мобильных устройств
    mobileTemplates: 15, // процент разработки варфрейма для мобильных устройств
    editable: 10, // админка
    metrikaYandex: [500, 1000, 2000], // подключение яндекс метрики
    analyticsGoogle: [850, 1500, 3000], // подключение гугл аналитики
    sendOrder: 500, // подключение отправки форм
    deadlineDay: [ // объект с сроками выполнения заказа
      [2, 7],
      [3, 10],
      [7, 14]
    ],
    deadlinePercent: [20, 17, 15] // процент за дедлайн
  };

  // получение элементов из DOM 
  const startButton = document.querySelector('.start-button'),
    firstScreen = document.querySelector('.first-screen'),
    mainForm = document.querySelector('.main-form'),
    formCalculate = document.querySelector('.form-calculate'),
    endButton = document.querySelector('.end-button'),
    totalElem = document.querySelector('.total'),
    fastRange = document.querySelector('.fast-range'),
    totalPriceSum = document.querySelector('.total_price__sum'),
    adpat = document.getElementById('adapt'),
    mobileTemplates = document.getElementById('mobileTemplates'),
    typeSite = document.querySelector('.type-site'),
    maxDeadline = document.querySelector('.max-deadline'),
    rangeDeadline = document.querySelector('.range-deadline'),
    deadlineValue = document.querySelector('.deadline-value'),
    desktopTemplates = document.getElementById('desktopTemplates'),
    editable = document.getElementById('editable'),
    adpatValue = document.querySelector('.adapt_value'),
    mobileTemplatesValue = document.querySelector('.mobileTemplates_value'),
    desktopTemplatesValue = document.querySelector('.desktopTemplates_value'),
    editableValue = document.querySelector('.editable_value'),
    calcDescription = document.querySelector('.calc-description'),
    metrikaYandex = document.getElementById('metrikaYandex'),
    analyticsGoogle = document.getElementById('analyticsGoogle'),
    sendOrder = document.getElementById('sendOrder'),
    cardHead = document.querySelector('.card-head'),
    totalPrice = document.querySelector('.total_price'),
    firstFieldset = document.querySelector('.first-fieldset');

  // функция склонения слова день
  const declOfNum = (n, titles) => {
    return n + ' ' + titles[n % 10 === 1 && n % 100 !== 11 ?
      0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
  };

  const showElem = (elem) => {
    elem.style.display = 'block';
  };

  const hideElem = (elem) => {
    elem.style.display = 'none';
  };

  // отображение выбранного дополнительного функционала
  const dopOptionsString = () => {

    let str = '';

    if (metrikaYandex.checked || analyticsGoogle.checked || sendOrder.checked) {
      str += 'Подключим';

      if (metrikaYandex.checked) {
        str += ' Яндекс Метрику';

        if (analyticsGoogle.checked && sendOrder.checked) {
          str += ', Гугл Аналитику и отправку заявок на почту.';
          return str;
        }

        if (analyticsGoogle.checked || sendOrder.checked) {
          str += ' и';
        }

      }

      if (analyticsGoogle.checked) {
        str += ' Гугл Аналитику';
        if (sendOrder.checked) {
          str += ' и';
        }
      }

      if (sendOrder.checked) {
        str += ' отправку заявок на почту';
      }

      str += '.';
    }

    return str;

  };

  // обрабокта текста , в зависимости от выбора опций
  const renderTextContent = (total, site, maxDay, minDay) => {
    totalPriceSum.textContent = total;
    typeSite.textContent = site;
    maxDeadline.textContent = declOfNum(maxDay, DAY_STRING);
    rangeDeadline.min = minDay;
    rangeDeadline.max = maxDay;
    deadlineValue.textContent = declOfNum(rangeDeadline.value, DAY_STRING);

    adpatValue.textContent = adapt.checked ? 'Да' : 'Нет';
    mobileTemplatesValue.textContent = mobileTemplates.checked ? 'Да' : 'Нет';
    desktopTemplatesValue.textContent = desktopTemplates.checked ? 'Да' : 'Нет';
    editableValue.textContent = editable.checked ? 'Да' : 'Нет';

    calcDescription.textContent = `
    Сделаем ${site} ${adapt.checked ? ', адаптированный под мобильные устройства и планшеты' : ''}.
    ${editable.checked ? `Установим панель админстратора,
    чтобы вы могли самостоятельно менять содержание на сайте без разработчика.` : ''}
    ${dopOptionsString()}
    `;
  };

  // калькулятор
  const priceCalculation = (elem = {}) => {

    let result = 0,
      index = 0,
      options = [],
      site = '',
      maxDeadlineDay = DATA.deadlineDay[index][1],
      minDeadlineDay = DATA.deadlineDay[index][0],
      overPercent = 0;

    if (elem.name === 'whichSite') {
      for (const item of formCalculate.elements) {
        if (item.type === 'checkbox') {
          item.checked = false;
        }
      }

      hideElem(fastRange);

    }

    for (const item of formCalculate.elements) {
      if (item.name === 'whichSite' && item.checked) {
        index = DATA.whichSite.indexOf(item.value);
        site = item.dataset.site;
        maxDeadlineDay = DATA.deadlineDay[index][1];
        minDeadlineDay = DATA.deadlineDay[index][0];
      } else if (item.classList.contains('calc-handler') && item.checked) {
        options.push(item.value);
      } else if (item.classList.contains('want-faster') && item.checked) {
        const overDay = maxDeadlineDay - rangeDeadline.value;
        overPercent = overDay * (DATA.deadlinePercent[index] / 100);
      }
    }

    result += DATA.price[index];

    options.forEach((key) => {
      if (typeof (DATA[key]) === 'number') {
        if (key === 'sendOrder') {
          result += DATA[key];
        } else {
          result += DATA.price[index] * DATA[key] / 100;
        }
      } else {
        if (key === 'desktopTemplates') {
          result += DATA.price[index] * DATA[key][index] / 100;
        } else {
          result += DATA[key][index];
        }
      }
    });


    result += result * overPercent;

    renderTextContent(result, site, maxDeadlineDay, minDeadlineDay);

  };

  // взаимодейсвтие с ползунком
  const handlerCallBackForm = (event) => {

    const target = event.target;

    if (adapt.checked) {
      mobileTemplates.disabled = false;
    } else {
      mobileTemplates.disabled = true;
      mobileTemplates.checked = false;
    }

    if (target.classList.contains('want-faster')) {

      target.checked ? showElem(fastRange) : hideElem(fastRange);
      priceCalculation(target);
    }

    if (target.classList.contains('calc-handler')) {
      priceCalculation(target);
    }

  };

  // возврат цены по странцие
  const moveBackTotalElem = () => {
    if (document.documentElement.getBoundingClientRect().bottom > document.documentElement.clientHeight + 200) {
      totalPrice.classList.remove('totalPriceBottom');
      firstFieldset.after(totalPrice);
      window.removeEventListener('scroll', moveBackTotalElem);
      window.addEventListener('scroll', moveTotalElem);
    }

  };

  // движение цены по странцие
  const moveTotalElem = () => {
    if (document.documentElement.getBoundingClientRect().bottom < document.documentElement.clientHeight + 200) {
      totalPrice.classList.add('totalPriceBottom');
      endButton.before(totalPrice);
      window.removeEventListener('scroll', moveTotalElem);
      window.addEventListener('scroll', moveBackTotalElem);
    }
  };

  // функция скрытия прелоадера
  const preloaderHide = () => {

    setTimeout(() => {
      document.getElementById('loader').style = `
        display = 'none';
        visibility: hidden;
        opacity: 0;
        -webkit-transform: scale(1.2);
        -ms-transform: scale(1.2);
        transform: scale(1.2);
        `;
      document.getElementById('preloader').style = `
        display = 'none';
        visibility: hidden;
        opacity: 0;
        -webkit-transform: scale(1.2);
        -ms-transform: scale(1.2);
        transform: scale(1.2);
        `;
    }, 2000);
  };

  // валидация форм
  const formValidation = (event) => {
    const target = event.target;
    //валидайия для сообщения
    if (target.name === 'task') {
      target.value = target.value.replace(/[^а-яёА-ЯЁ,.?!-=+ ]/g, '');
    }
    // валидация для контактов
    if (target.name === 'communication') {
      target.value = target.value.replace(/[^a-zA-Z0-9+.@-_]/g, '');
    }
    // валидация для имени
    if (target.name === 'nameCustomer') {
      target.value = target.value.replace(/[^а-яёА-ЯЁ]/g, '');
    }
  };

  // обрабокта отправки формы
  const renderResponse = (response) => {

    if (response.ok) {
      // total.style.display = 'none';
      hideElem(totalElem);

      cardHead.textContent = 'Ваша заявка была успешно отправлена, ожидайте =)';
      cardHead.style = 'color: orange;';
    }
  };

  // обработчики событий
  startButton.addEventListener('click', () => {
    showElem(mainForm);
    hideElem(firstScreen);
    window.addEventListener('scroll', moveTotalElem);
  });

  endButton.addEventListener('click', () => {

    for (const elem of formCalculate.elements) {
      if (elem.tagName === 'FIELDSET') {
        hideElem(elem);
      }
    }

    cardHead.textContent = 'Заявка на разработку сайта';

    hideElem(totalPrice);
    showElem(totalElem);

  });

  formCalculate.addEventListener('input', handlerCallBackForm);

  // отправка формы 
  formCalculate.addEventListener('submit', (event) => {

    event.preventDefault();
    const data = new FormData(event.target);

    fetch('server.php', {
      method: 'POST',
      headers: {
        'Content-type': 'miltipart/form-data'
      },

      body: data,
    }).then(renderResponse).catch((error) => console.log(error));
  });

  // слушатель для функции валидации при вводе
  formCalculate.addEventListener('input', formValidation);

  priceCalculation();
  preloaderHide();

});