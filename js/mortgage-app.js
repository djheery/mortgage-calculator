const inputArr = Array.from(document.querySelectorAll('.input'))
inputArr.forEach(i => i.addEventListener('blur', calculateRepayments))
window.addEventListener('DOMContentLoaded', calculateRepayments)
const btn = document.querySelector('.show-breakdown')
btn.addEventListener('click', UI.showBreakdown)

function calculateRepayments(){
  const UISelectors = UI.getSelectors();
  const UIValues = UI.getValues();
  UI.resetCurrentPage();
  const pp = document.querySelector(UISelectors.propertyPrice).value;
  const dp = document.querySelector(UISelectors.depositAmount).value;
  const ai = (((document.querySelector(UISelectors.interestRate).value) / 100) / 12);
  const rp = document.querySelector(UISelectors.repaymentPeriod).value;
  UI.checkInputs(pp, dp, rp, ai);
  if (!pp || !dp || !ai || !rp) return
  if(document.querySelector(UISelectors.propertyPrice).parentElement.classList.contains('input-error')) return
  if(document.querySelector(UISelectors.depositAmount).parentElement.classList.contains('input-error')) return
  if(document.querySelector(UISelectors.interestRate).parentElement.classList.contains('input-error')) return
  if(document.querySelector(UISelectors.repaymentPeriod).parentElement.classList.contains('input-error')) return
  const monthly = rp * 12;
  const value = pp - dp;
  let result = MortgageCalculations.monthlyRepayments(value, ai, monthly);
  let percent = ((dp / pp) * 100).toFixed(1); 
  let monthlyInterestArr = [];
  let loanRemainingArr = [];
  UI.changePercentageText(parseFloat(percent / 100))
  UI.updatePercentageSVG(percent);
  UI.displayDepositPercentage(percent);
  UI.displayMonthlyRepayments(result);
  MortgageCalculations.calculateTotalInterest(value, monthly, monthlyInterestArr, loanRemainingArr, result);
  UI.displayTotalInterest(UIValues.totalInterest)
};

document.querySelector('.table-buttons').addEventListener('click', e => {
  UI.changeCurrentPage(e)
})



