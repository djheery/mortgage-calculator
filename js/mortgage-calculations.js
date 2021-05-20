const MortgageCalculations =(function(){
  return {
    monthlyRepayments: function(p, r, n) {
      m = ((p * r) * ((1 + r) ** n)) / (((1 + r) ** n) - 1)
      return m
    },
    calculateTotalInterest: function(value, rp, monthlyInterestArr, loanRemainingArr, result) {
      const UISelectors = UI.getSelectors()
      const ai = (((document.querySelector(UISelectors.interestRate).value) / 100) / 12);
      let repaymentPeriod = rp;
      let loanRemaining = value;
      if(repaymentPeriod > 0) {
        let monthlyInterest = parseFloat((loanRemaining * ai).toFixed(2));
          loanRemaining = loanRemaining - (result - monthlyInterest);
          monthlyInterestArr.push(monthlyInterest);
        if(loanRemaining < 0) {
          loanRemaining = 0;
        }
        loanRemainingArr.push(loanRemaining.toFixed(2));
        repaymentPeriod = repaymentPeriod - 1;
        MortgageCalculations.calculateTotalInterest(loanRemaining, repaymentPeriod, monthlyInterestArr, loanRemainingArr, result)    
      } else {
        const accumulatedInterest = MortgageCalculations.calculateAccumulatedInterest(monthlyInterestArr)
        const totalInterestPayable = monthlyInterestArr.reduce((a, b) => a + b);
        UI.displayTable(monthlyInterestArr, loanRemainingArr, accumulatedInterest, result)
        UI.displayChart(loanRemainingArr)

        const UIValues = UI.getValues()
        UIValues.totalInterest = totalInterestPayable;
        UIValues.monthlyInterest = monthlyInterestArr;
        UIValues.totalInterestPaid = accumulatedInterest;
        UIValues.loanRemainingArray = loanRemainingArr;
        UIValues.loanPayment = result;
      }
    },
    calculateAccumulatedInterest: (interestArr) => {
        let count = 0;
        let accumulatedInterestCount = count - 1;
        let accumulatedInterest = [];
        let accumulatedValue;
        for(count = 0; count < interestArr.length; count ++) {
          if(count === 0) {
            accumulatedValue = parseFloat(interestArr[count]).toFixed(2);
          } else {
            accumulatedValue = parseFloat(interestArr[count] + parseFloat(accumulatedInterest[accumulatedInterestCount])).toFixed(2);
          }
          accumulatedInterestCount ++
          accumulatedInterest.push(accumulatedValue);
        }
        console.log(accumulatedInterest);
        return(accumulatedInterest)
    }
  }
})();

