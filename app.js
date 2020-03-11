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
var UIController = (function () {

})();

// GLOBAL APP CONTROLLER(controller)
var controller = (function (budgetCtrl, UICtrl) {

})(budgetController, UIController);
