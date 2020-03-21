// 첫번째 파트
// 1. 이벤트 핸들러를 추가한다.
// 2. 입력한 데이터(ex. 자산)를 가져온다.
// 3. 새로운 자산을 우리의 데이터 스트럭쳐에 담는다.
// 4. 담은 데이터를 기반으로 자산을 화면에 더한다.
// 5. 자산을 계산하고 비지니스 로직에 연관된 작업을 한다.
// 6. 계산된 값을 기반으로 화면에 또 담는다.

// 두번째 파트
// 1. 이벤트 핸들러를 추가한다.
// 2. 클릭하면 model에 있는 데이터 스트럭쳐에서 데이터를 지운다.
// 3. 삭제 되면 UI에서도 지운다.
// 4. 새롭게 가계부를 계산한다.
// 5. UI도 새롭게 업데이트 한다.

// 세번째 파트
// 1. 아이템 각각의 퍼센테이지를 계산한다.
// 2. 퍼센테이지의 UI를 업데이트 한다.
// 3. 현재 날짜를 뷰에 그린다.
// 4. 넘버 포멧팅을 한다.
// 5. 인풋 필드의 UX를 향상시킨다.

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

  // 데이터를 저장하기에는 오브젝트가 좋아서 오브젝트를 생성한다.
  // 가계부에 저장할 많은 아이템(오브젝트)를 생성하기 위해서는 어떻게 해야하나? 펑션 컨스트럭터로 생성한다.
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  }

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  }

  // var allExpenses = [];
  // var allIncomes = [];
  // var totalExpenses = 0;

  // 위의 방식 보다 밑에 방식이 훨씬 깔끔하다.
  // 만약 10개의 수입이 들어오면 데이터 오브젝트에 저장한다.
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: function (type, des, val) {
      var newItem, ID;

      // [1 2 3 4 5] 다음 아이디는 6
      // [1 2 4 6 8] 다음 아이디는 9
      // ID = last ID + 1

      // 새로운 아이디를 만든다.
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // inc 또는 exp를 기반으로 새로운 아이템을 생성한다.
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      data.allItems[type].push(newItem);
      return newItem;
    },
    deleteItem: function (type, id) {
      var ids, index;

      // id = 6;
      // data.allItems[type][id];
      // ids = [1 2 4 6 8];
      // index = 3;
      ids = data.allItems[type].map(function (current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    calculateBudget: function () {

      // 모든 수입과 지출을 각각 계산한다. 반복하지 않기 위해 프라이빗 함수로 만든다.
      calculateTotal('inc');
      calculateTotal('exp');

      // 가계부를 계산한다. 모든 수입 - 모든 지출.
      data.budget = data.totals.inc - data.totals.exp;

      // 가계부의 퍼센테이지도 계산한다. 모든 지출 / 모든 수입 * 100에 반올림
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    calculatePercentages: function () {
      // 모든 지출 오브젝트 개인적으로 필요 한 것이다. 이것은 메소드가 되어야 한다.
      /* 
        a=20
        b=20
        c=40
        income=100
        a=20/100=20%
        b=10/100=10%
        c=40/100=40%
      */

      data.allItems.exp.forEach(function (cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },
    getPercentages: function () {
      var allPerc = data.allItems.exp.map(function (cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },
    getBudget: function () {
      return {
        budget: data.budget,
        percentage: data.percentage,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp
      }
    },
    tesing: function () {
      console.log(data);
    }
  }

})();

// UI CONTROLLER(view)
// view안에서 만든 함수는 다른 view, model에서 사용해야 하므로 프라이빗 함수로 만들면 안됨
var UIController = (function () {

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    percentageLabel: '.budget__expenses--percentage',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  var formatNumber = function (num, type) {
    /*
      + or - 를 숫자 앞에 붙인다.
      정확히 소수점 2개를 붙인다.
      1000단위로 콤마를 넣는다.

      2310.4567 -> + 2,310.46
      2000 -> + 2,000.00
    */
    var numSplit, int, dec, type;

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];
    if (int.length > 3) {
      // input 2310, output 2,310
      // input 23100, output 23,100
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
    }

    dec = numSplit[1];

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
  }

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // type: inc | exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    addListItem: function (obj, type) {
      var html, newHtml, element;

      // DOM에 추가할 템플릿을 만든다.
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // 템플릿에 실제 데이터를 넣는다.
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value));

      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    deleteListItem: function (selectorID) {
      var el = document.getElementById(selectorID);

      el.parentNode.removeChild(el);
    },
    clearFields: function () {
      var fields, fieldsArr;

      fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue)
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function (current, index, array) {
        current.value = ""
      });
      fieldsArr[0].focus();
    },
    displayBudget: function (obj) {
      var type;
      obj.budget > 0 ? type = 'inc' : type = 'exp';

      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }
    },
    displayPercentages: function (percentages) {
      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      }

      nodeListForEach(fields, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });
    },
    displayMonth: function () {
      var now, months, month, year;

      now = new Date();
      // var christmas = new Date(2020, 11, 25);
      
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      month = now.getMonth();

      year = now.getFullYear();
      document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
    },
    getDOMstrings: function () {
      return DOMstrings;
    }
  }

})();

// GLOBAL APP CONTROLLER(controller)
// 여기서는 각각 이벤트에서 무슨일이 일어날지를 등록하고 다른 컨트롤러에게 던진다.
var controller = (function (budgetCtrl, UICtrl) {

  var setupEventListeners = function () {
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    // 이벤트 위임
    // 1. 우리가 관심있는 수 많은 엘리먼트에 이벤트를 하나하나 다는 것이 힘들 때
    // 2. 페이지 로드가 되기전에는 돔에 없다가 이벤트에 의해 생긴 엘리먼트에 이벤트가 필요할 경우
    // 지금 같은 경우가(2) 돔이 로드 된 이후에 우리가 만든 가계부 자산의 아이템 하나하나에 삭제이벤트를 달기 위해서 컨테이너에 이벤트를 단다.
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  };

  var updateBudget = function () {

    // 1. 바뀌어야 하는 가계부 금액 계산을 하고(model)
    budgetCtrl.calculateBudget();

    // 2. 가계부 금액을 리턴한다.
    var budget = budgetCtrl.getBudget();

    // 3. 계신된 값을 UI에 그린다.
    UICtrl.displayBudget(budget);
  };

  var updatePercentages = function () {

    // 1. 퍼센테이지를 계산한다. (모델)
    budgetCtrl.calculatePercentages();

    // 2. 모델에서 퍼센테이지를 읽는다.
    var percentages = budgetCtrl.getPercentages();

    // 3. 새로운 퍼센테이지를 가지고 UI를 업데이트 한다.
    UICtrl.displayPercentages(percentages);
  };

  // keypress, click 이벤트와 같이 여러가지 이벤트에서 같은 작업을 반복하지 않으려고(dry) 만든 변수 
  var ctrlAddItem = function () {
    var input, newItem;

    // 1. 필드의 인풋 데이터를 가져온다.
    input = UICtrl.getInput();

    // 인풋데이터의 유효성 검증을 해준다
    if (input.description.trim() !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. budget controller(model)에 아이템을 넣는다.
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. UI controller(view)에 아이템을 넣는다.
      UICtrl.addListItem(newItem, input.type);

      // 4. 필드의 인풋 데이터를 초기화 하고 포커스를 다시 처음으로 준다.
      UICtrl.clearFields();

      // 밑에 두 부분은 updateBudget이라는 함수를 만든다. 반복하지 않기 위하여
      // 5. 바뀌어야 하는 가계부 금액 계산을 하고(model)
      // 6. 계산된 값을 UI에 그린다.(view)
      updateBudget();

      // 7. 각 지출 아이템의 소비 퍼센테이지를 계산한다.
      updatePercentages();
    }
  };

  var ctrlDeleteItem = function (event) {

    var itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      // inc-1
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. 모델에 있는 데이터 스트럭쳐에서 아이템을 지운다.
      budgetCtrl.deleteItem(type, ID);
      // 2. 뷰에 있는 아이템을 제거 한다.
      UICtrl.deleteListItem(itemID);
      // 3. 뷰에 있는 가계부 가격을 업데이트 한다.
      updateBudget();
      // 4. 각 지출 아이템의 소비 퍼센테이지를 계산한다.
      updatePercentages();
    }

  };

  return {
    // 처음에 하고 싶은 것을 하는 것인데 실행하기 위해 필요한 최소한의 설정을 한다.
    init: function () {
      console.log('Application has started.');
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        percentage: -1,
        totalInc: 0,
        totalExp: 0
      });
      setupEventListeners();
    }
  }

})(budgetController, UIController);

controller.init();
