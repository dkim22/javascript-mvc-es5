// 1. 이벤트 핸들러를 추가한다.
// 2. 입력한 데이터(ex. 자산)를 가져온다.
// 3. 새로운 자산을 우리의 데이터 스트럭쳐에 담는다.
// 4. 담은 데이터를 기반으로 자산을 화면에 더한다.
// 5. 자산을 계산하고 비지니스 로직에 연관된 작업을 한다.
// 6. 계산된 값을 기반으로 화면에 또 담는다.

// 어플리케이션이 커질 수록 모듈화 하는 작업은 중요하다.
// 깨끗하게 분리가 가능하고 잘 조직되어지게 구조를 잡아야한다.
// 데이터를 캡슐화시키고 필요한 것만 노출한다.

// 그러기 위해선 3개의 모듈로 나눈다.
// UI MODULE, DATA MODULE, CONTROLLER MODULE

// DATA(model) 모듈: 3, 5
// UI(view) 모듈: 2, 4, 6
// CONTROLLER(controller) 모듈: 1

// 이렇게 mvc 아키텍쳐를 구현한다.

// es5에서는 java script module 패턴 IIFE를 사용
// es6로 넘어가서는 class를 사용하면 된다.

// BUDGET CONTROLLER(model)
var budgetController = (function () {

})();

// UI CONTROLLER(view)
// view안에서 만든 함수는 다른 view, model에서 사용해야 하므로 프라이빗 함수로 만들면 안됨
var UIController = (function () {
  
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // type: inc | exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },
    getDOMstrings: function() {
      return DOMstrings;
    }
  }
})();

// GLOBAL APP CONTROLLER(controller)
// 여기서는 각각 이벤트에서 무슨일이 일어날지를 등록하고 다른 컨트롤러에게 던진다.
var controller = (function (budgetCtrl, UICtrl) {

  var DOM = UICtrl.getDOMstrings();

  // keypress, click 이벤트와 같이 여러가지 이벤트에서 같은 작업을 반복하지 않으려고(dry) 만든 변수 
  var ctrlAddItem = function() {
    
    // 1. 필드의 인풋 데이터를 가져온다.
    var input = UICtrl.getInput();
    console.log(input);

    // 2. budget controller(model)에 아이템을 넣는다.

    // 3. UI controller(view)에 아이템을 넣는다.

    // 4. 바뀌어야 하는 가계부 금액 계산을 하고(model)

    // 5. 계산된 값을 UI에 그린다.(view)
  
  }

  document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', function(event) {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });

})(budgetController, UIController);
