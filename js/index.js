document.addEventListener("DOMContentLoaded", function () {
  const prmts = {
    heroButtons: document.querySelectorAll('[data-path]'),
    heroDropdown: document.querySelectorAll('[data-dropdown]'),
    listSelect: document.querySelector('.hero__list'),

    select: document.querySelector('.gallery__select-content'),

    catalogButtons: document.querySelectorAll('[data-trigger]'),
    catalogContent: document.querySelectorAll('[data-target]'),

    modalButtons: document.querySelectorAll('[data-modal-button]'),
    buttonClose: document.querySelectorAll('.gallery__modal-window-btn'),
    modalAll: document.querySelectorAll('[data-modal]'),
    body: document.body,

    mobileButton: document.querySelector('.hero__header-burger'),
    mobileMenu: document.querySelector('.hero__mob-menu'),

    searchBtn: document.querySelector('.hero__mob-search-btn'),
    searchCansel: document.querySelector('.hero__mob-search-close'),
    searchBox: document.querySelector('.hero__mob-search-box'),
    searchInput: document.querySelector('.hero__mob-search-text'),

    logo: document.querySelector('.hero__header-logo'),

    smoothLinks: document.querySelectorAll('a[href^="#"]'),
  };

  for (let smoothLink of prmts.smoothLinks) {
    smoothLink.addEventListener('click', function(e) {
      if (prmts.mobileMenu.classList.contains('is-active')) {
        prmts.mobileMenu.classList.remove('is-active');
        prmts.mobileButton.classList.remove('is-close');
      }
      e.preventDefault();
        const id = smoothLink.getAttribute('href');

        document.querySelector(id).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    })
  }

  prmts.searchBtn.addEventListener('click', function() {
    prmts.searchBox.classList.add('is-active');
    prmts.searchBtn.classList.add('is-active');
    prmts.searchInput.classList.add('is-active');
    prmts.searchCansel.classList.add('is-active');
    prmts.logo.classList.add('remove');
    prmts.mobileButton.classList.add('remove');
  })

  prmts.searchCansel.addEventListener('click', function() {
    prmts.searchBox.classList.remove('is-active');
    prmts.searchBtn.classList.remove('is-active');
    prmts.searchInput.classList.remove('is-active');
    prmts.searchCansel.classList.remove('is-active');
    prmts.logo.classList.remove('remove');
    prmts.mobileButton.classList.remove('remove');
  })

  if (prmts.searchBox.classList.contains('is-active')) {
    prmts.logo.classList.add('remove');
  }

  jQuery(function($) {
    $(prmts.searchBtn).click(function() {
      $(prmts.searchInput).focus();
    });
  })

  prmts.mobileButton.addEventListener('click', function() {
    this.classList.toggle('is-close');
    prmts.mobileMenu.classList.toggle('is-active');
  })

  prmts.modalButtons.forEach(function(item) {
    item.addEventListener('click', function() {
      const modal = document.querySelector('#' + this.dataset.modalButton);
      modal.classList.add('is-active');
      prmts.body.classList.add('no-scroll');
      modal.querySelector('.gallery__modal-window').addEventListener('click', function(event) {
        event.stopPropagation();
      })
    })
  })
  prmts.buttonClose.forEach(function(item) {
    item.addEventListener('click', function() {
      const modal = this.closest('[data-modal]');
      modal.classList.remove('is-active');
      prmts.body.classList.remove('no-scroll');
    })
  })
  prmts.modalAll.forEach(function(item) {
    item.addEventListener('click', function() {
      item.classList.remove('is-active');
      prmts.body.classList.remove('no-scroll');
    })
  })

  ymaps.ready(init);
  function init() {
    const mapElem = document.querySelector("#map");
    const myMap = new ymaps.Map(
      "map",
      {
        center: [55.76046806898367, 37.61508949999989],
        zoom: 14,
        controls: ["geolocationControl", "zoomControl"]
      },
      {
        suppressMapOpenBlock: true, // убирает кнопки "как добраться" "вызвать таки" и тд
        geolocationControlPosition: { top: "400px", right: "10px" }, //позиция кнопки определеня местоположеиня
        geolocationControlFloat: "none",
        zoomControlSize: "small",
        zoomControlFloat: "none", //шкала масштаба
        zoomControlPosition: { top: "325px", right: "10px" }
      }
    );

    if (window.matchMedia("(max-width: 1280px)").matches) { //удаляем кнопки геолакации и масштаба
      if (Object.keys(myMap.controls._controlKeys).length) {
        myMap.controls.remove('zoomControl');
        myMap.controls.remove('geolocationControl');
      }
    }

    myMap.behaviors.disable("scrollZoom"); //убираем зум мышкой

    myMap.events.add("sizechange", function (e) {
      if (window.matchMedia("(max-width: 1280px)").matches) {
        if (Object.keys(myMap.controls._controlKeys).length) {
          myMap.controls.remove('zoomControl');
          myMap.controls.remove('geolocationControl');
        }
      } else {
        if (!Object.keys(myMap.controls._controlKeys).length) {
          myMap.controls.add('zoomControl');
          myMap.controls.add('geolocationControl');
        }
      }
    });

    const myPlacemark = new ymaps.Placemark(
      [55.759581518536734,37.61533313347363],
      {},
      {
        iconLayout: 'default#image',
        iconImageHref: 'https://cdn-icons-png.flaticon.com/512/3082/3082383.png',
        iconImageSize: [30, 30],
        iconImageOffset: [-20, -40]
      }
    );
    myMap.geoObjects.add(myPlacemark);
  }

  new Accordion('.catalog__accordion', {
    openOnInit: [0]
  });

  var tel = document.querySelector("input[name='tel']");
  var inputMaskTel = new Inputmask("+7(999) 999-99-99");
  inputMaskTel.mask(tel);

  const validation = new JustValidate('#form', {
    errorLabelStyle: {
      color: '#FF5C00',
      fontSize: '12px',
    }
  });
  validation
  .addField('#name', [
    {
      rule: 'required',
      errorMessage: 'Вы не ввели имя'
    },
    {
      rule: 'minLength',
      value: 3,
      errorMessage: 'Вы ввели меньше чем положено'
    },
    {
      rule: 'maxLength',
      value: 15,
      errorMessage: 'Вы ввели больше чем положено'
    },
  ])
  .addField('#tel', [
    {
      rule: 'required',
      errorMessage: 'Вы не ввели телефон',
    },
    {
      rule: 'function',
      validator: function() {
        const phone = tel.inputmask.unmaskedvalue();
        return phone.length === 10;
      },
      errorMessage: 'Номер телефона не корректный'
    }
  ]);

  const swiper1 = new Swiper('.hero__swiper', {

    simulateTouch: false,  // запрет на двигание мышкой

    autoplay: {
      delay: 5000,
      // автопрокрутка продолжается после касаяния
      disableOnInteraction: false,
    },
  });

  new tippy('.js-tooltip-btn', {
    theme: 'tooltip-custom',
    maxWidth: 256,
  });

  prmts.catalogButtons.forEach(function(item) {
    console.log(item);
    item.addEventListener('click', function() {
      prmts.catalogContent.forEach(function(i) {
        i.classList.remove('is-active');
      })
      const catalogInfo = document.querySelector('#' + this.dataset.trigger);
      catalogInfo.classList.add('is-active')
    })
  })

  // select
  prmts.heroButtons.forEach(function(item) {
    item.addEventListener('click', function() {
      if (item.classList.contains('is-active')) {
        item.classList.remove('is-active')
      } else {
        item.classList.add('is-active');
      }

      const dropdownContent = document.querySelector('#' + this.dataset.path);
      if(dropdownContent.classList.contains('is-active')) {
        dropdownContent.classList.remove('is-active');
      } else {
      prmts.heroDropdown.forEach(function(item) {
        item.classList.remove('is-active');
      })
      dropdownContent.classList.add('is-active');
      }
    })
  });
  window.addEventListener('click', function() {
    prmts.heroButtons.forEach(function(item) {
      item.classList.remove('is-active');
    })
    prmts.heroDropdown.forEach(function(item) {
      if (item.classList.contains('is-active')) {
        item.classList.remove('is-active');
      }

    })
  });

  prmts.listSelect.addEventListener('click', function(event) {
    event.stopPropagation();
  });

  const choices = new Choices(prmts.select, {
    allowHTML: true,
    searchEnabled: false,
    placeHolder: true,
    itemSelectText: '',
  });

  const swiper2 = new Swiper('.gallery__swiper-container', {
    grid: {
      rows: 1,
      fill: "row"
    },
    pagination: {
      el: ".gallery__pagination",
      type: "fraction"
    },
    navigation: {
      nextEl: ".next-btn",
      prevEl: ".prev-btn"
    },
    breakpoints: {
      1200: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 50,
      },
      768: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 38,
      },
      450: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 34,
      }
    },
    a11y: false,
    keyboard: {
      enabled: true,
      onlyInViewport: true
    },
  });

  const swiper3 = new Swiper('.events__swiper', {
    grid: {
      rows: 1,
    },
    navigation: {
      nextEl: ".events__btn-next",
      prevEl: ".events__btn-prev"
    },
    pagination: {
      el: '.events__swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      1281: {
        slidesPerView: 3,
        slidesPerGroup: 1,
        spaceBetween: 50,
      },
      921: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 27,
      },
      550: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 34,
      }
    },
    slidesPerView: 1,
    slidesPerGroup: 1,
    a11y: false,
    keyboard: {
      enabled: true,
      onlyInViewport: true
    },
  });

  const swiper4 = new Swiper('.projects__swiper', {
    grid: {
      rows: 1,
    },
    navigation: {
      nextEl: ".project__btn-next",
      prevEl: ".project__btn-prev"
    },
    breakpoints: {
      1280: {
        slidesPerView: 3,
        slidesPerGroup: 1,
        spaceBetween: 50,
      },
      920: {
        slidesPerView: 2,
        slidesPerGroup: 1,
        spaceBetween: 50,
      },
      576: {
        slidesPerView: 2,
        slidesPerGroup: 1,
        spaceBetween: 34,
      },
    },
    loop: true,
    a11y: false,
    keyboard: {
      enabled: true,
      onlyInViewport: true
    },

  });

  $(document).ready(function() {
    function heightBlock(column) {
      let myBlock = 0;

      column.each(function() {
        thisHeight = $(this).height();
        if(thisHeight > myBlock){
          myBlock = thisHeight;
        }
      });
      column.height(myBlock);
    }

    heightBlock($(".events__card-wrap"))
  })
});








