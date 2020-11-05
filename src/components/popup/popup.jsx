import React, {PureComponent} from "react";

const INCOME_TAX = 0.13;
const MAX_TAX_BACK = 260000;

class Popup extends PureComponent {
  // Отделяет тысячи пробелом
  static getPureDecimalStringView(rawStroke) {
    let result = ``;
    rawStroke += ``;
    let beginIndex = rawStroke.length - 3;
    let endIndex = rawStroke.length;
    // Разбивает цифры в группы по три и разделяет их пробелом
    for (let i = beginIndex; i > 0; i -= 3) {
      result = rawStroke.slice(i, endIndex) + ` ` + result;
      endIndex -= 3;
    }
    // Добавляет ведущие 1 или 2 цыфры если есть и пробел после них
    if (endIndex > 0) {
      result = rawStroke.slice(0, endIndex) + ` ` + result;
    }
    return result;
  }

  // Возвращает окончания для числительных в именительном падеже
  static getRusEnding(index) {
    index++;
    if (index === 40) {
      return `ой`;
    }
    const idCase = index % 20;
    switch (idCase) {
      case 3:
        return `ий`;
      case 2:
      case 6:
      case 7:
      case 8:
        return `ой`;
      case 0:
      case 1:
      case 4:
      case 5:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
      case 16:
      case 17:
      case 18:
      case 19:
        return `ый`;
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      isPopupClose: true,
      taxBackList: [],
    };
    this.monthSalary = ``;
    this.salaryInputRef = React.createRef();
    this._handlerStartButtonClick = this._handlerStartButtonClick.bind(this);
    this._handlerCloseButtonClick = this._handlerCloseButtonClick.bind(this);
    this._handlerSalaryInput = this._handlerSalaryInput.bind(this);
    this._handlerCalculateButtonClick = this._handlerCalculateButtonClick.bind(this);
    this._handlerFormSubmit = this._handlerFormSubmit.bind(this);
    this._handlerSubmitBtnClick = this._handlerSubmitBtnClick.bind(this);
    this._handlerInvalidEvent = this._handlerInvalidEvent.bind(this);
  }

  render() {
    const popupSectionClass = this.state.isPopupClose ? `popup` : `popup  popup--gray`;
    const showEarlyPaymentList = !!this.state.taxBackList.length;
    return (
      <section className={popupSectionClass}>
        {this.state.isPopupClose ? (
          <button type="button" className="popup__btn-start" onClick={this._handlerStartButtonClick}>Налоговый вычет</button>
          ) : (
          <div className="popup__wrapper">
            <button type="button" className="popup__close" onClick={this._handlerCloseButtonClick}>
              <span className="visually-hidden">Закрыть</span>
            </button>
            <div className="popup__content">
              <h2 className="popup__heading">Налоговый вычет</h2>
              <p className="popup__description">
                Используйте налоговый вычет чтобы погасить ипотеку досрочно. Размер налогового
                вычета составляет не&nbsp;более 13% от своего официального годового дохода.
              </p>
              <form className="popup__form" autoComplete={"off"} onSubmit={this._handlerFormSubmit}>
                <label htmlFor="salary" className="popup__caption">Ваша зарплата в месяц</label>
                <input id="salary" type="text" className="popup__input" placeholder="Введите данные"
                       ref={this.salaryInputRef} onInput={this._handlerSalaryInput} onInvalid={this._handlerInvalidEvent}/>
                <span className="popup__error">Поле обязательно для заполнения</span>
                <button type="button" className="popup__calc" onClick={this._handlerCalculateButtonClick}>Рассчитать</button>
                {showEarlyPaymentList && <h3 className="popup__caption">Итого можете внести в&nbsp;качестве досрочных:</h3>}
                {showEarlyPaymentList && <ul className="popup__list">
                  {this.state.taxBackList.map((it, i) => {
                    return (
                      <li className="popup__item" key={`p-${i}-${it}`}>
                        <input id={`payment-${i + 1}`} type="checkbox" className="visually-hidden" name={`payment-${i + 1}`} value={it}/>
                        <label htmlFor={`payment-${i + 1}`} className="popup__checkbox"/>
                        <span>{Popup.getPureDecimalStringView(it)} рублей</span>
                        <span className="popup__endings">{i === 1 ? `во` : `в`} {i + 1}-{Popup.getRusEnding(i)} год</span>
                      </li>
                    );
                  })}
                </ul>}
                <h3 className="popup__caption  popup__caption--increased-margin">Что уменьшаем?</h3>
                <input id="pay" type="radio" name="method-decrease" className="visually-hidden" value="payment"
                       defaultChecked={true}/>
                <label htmlFor="pay" className="popup__methodology">Платеж</label>
                <input id="term" type="radio" name="method-decrease" className="visually-hidden" value="term"/>
                <label htmlFor="term" className="popup__methodology">Срок</label>
                <button type="submit" className="popup__submit" onClick={this._handlerSubmitBtnClick}>Добавить</button>
              </form>
            </div>
          </div>
          )}
      </section>
    );
  }

  _handlerStartButtonClick() {
    this.setState({isPopupClose: false});
  }

  _handlerCloseButtonClick() {
    this.monthSalary = ``;
    this.setState({isPopupClose: true, taxBackList: []});
  }

  _handlerSalaryInput() {
    let result = `₽`;
    let startPos = this.salaryInputRef.current.selectionStart;
    const strokeLength = this.salaryInputRef.current.value.length;
    this.monthSalary = this.salaryInputRef.current.value.replace(/\D/g, ``);
    result = Popup.getPureDecimalStringView(this.monthSalary) + result;
    // Записывает модифицированный результат в input
    this.salaryInputRef.current.value = result;
    if (!this.monthSalary) {
      this.salaryInputRef.current.value = ``;
      return;
    }
    // Корректирует позицию курсора если это необходимо
    if (strokeLength > result.length) {
      startPos--;
    }
    if (strokeLength < result.length) {
      startPos++;
    }
    if (startPos > result.length - 2) {
      startPos = result.length - 2;
    }
    if (startPos < 0) {
      startPos = 0;
    }
    if (startPos > 0 && result.slice(startPos -1, startPos) === ` `) {
      startPos--;
    }
    this.salaryInputRef.current.selectionStart = startPos;
    this.salaryInputRef.current.selectionEnd = startPos;
  }

  // Вычесляет список возможных досрочных выплат как возврат по налогам
  _handlerCalculateButtonClick() {
    this.salaryInputRef.current.required = true;
    if (this.monthSalary === ``) {
      return;
    }

    const { price } = this.props;
    const taxBackList = [];
    const yearTaxBack = Math.round(this.monthSalary * INCOME_TAX * 12);
    let totalTaxBack = Math.round(Math.min(price * INCOME_TAX, MAX_TAX_BACK));
    const lastYearTaxBack = totalTaxBack % yearTaxBack;
    const totalFullTaxBack = (totalTaxBack - lastYearTaxBack) / yearTaxBack;
    for (let i = totalFullTaxBack; i > 0; i--) {
      taxBackList.push(yearTaxBack);
    }
    taxBackList.push(lastYearTaxBack);
    this.setState({taxBackList: taxBackList});
  }

  _handlerFormSubmit(evt) {
    evt.preventDefault();
  }

  _handlerSubmitBtnClick() {
    this.salaryInputRef.current.required = true;
  }

  _handlerInvalidEvent(evt) {
    evt.preventDefault();
  }
}

export default Popup;
