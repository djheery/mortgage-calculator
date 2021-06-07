const UI = (function() {
  const UISelectors = {
    propertyPrice: '#pp',
    depositAmount: '#dp',
    repaymentPeriod: '#rp',
    interestRate: '#ai',
    totalInterestP: '.total-interest-payable'
  };

  const state = {
    currentPage: 1,
    rows: 12,
    btnAmount: 4,
    currentYear: 0
  }
  const values = {
    totalInterest: 0,
    monthlyInterest: [],
    totalInterestPaid: [],
    loanRemainingArray: [],
    loanPayment: 0,
  }

  return {
    getSelectors: function() {
      return UISelectors;
    },
    getValues: () => {
      return values;
    },
    resetCurrentPage: () => {
      state.currentPage = 1;
    },
    checkErrors: (pp, dpa, rp, ir) => {
      if(parseFloat(pp) < parseFloat(dpa)) {
        document.querySelector(UISelectors.propertyPrice).classList.add('.error')
        document.querySelector(UISelectors.depositAmount).classList.add('.error')
        return 
      }
      console.log(pp, dpa, rp, ir)
      if(parseFloat(rp) > 40) {
        document.querySelector(UISelectors.propertyPrice).classList
        return
      }
      if(parseFloat(ir) > 0.015) {
        document.querySelector(UISelectors.interestRate).classList.add('.error') 
        console.log(document.querySelector(UISelectors.interestRate))
        return
      }
      document.querySelector(UISelectors.propertyPrice).classList.remove('.error')
      document.querySelector(UISelectors.repaymentPeriod).classList.remove('.error')
      document.querySelector(UISelectors.interestRate).classList.remove('.error')
      document.querySelector(UISelectors.depositAmount).classList.remove('.error')
    },
    showBreakdown: (e) => {
      if(e.target.parentElement.nextElementSibling.classList.contains('hidden')) {
        document.querySelector('.yearly-breakdown-table').classList.remove('hidden')
        document.querySelector('.show-breakdown').innerHTML = 'Hide Yearly Breakdown'
      } else {
        document.querySelector('.yearly-breakdown-table').classList.add('hidden')
        document.querySelector('.show-breakdown').innerHTML = 'Show Yearly Breakdown'
      }
    },
    displayMonthlyRepayments: function(result) {
      if(result < 0) result = 0;
      document.getElementById('result').innerHTML = `£${result.toFixed()}`;
    },
    displayTotalInterest: (ti) => {
      document.querySelector(UISelectors.totalInterestP).innerHTML = 
      `£${UI.insertCommas(ti.toFixed(2))}`
    },
    displayDepositPercentage: function(percent) {
      if (percent > 100) percent = 100; 
      document.getElementById('circle-percentage').innerHTML= `${percent}%`;
    },
    updatePercentageSVG: function(percent) {
      let successValue = (percent/200)*310;
      document.getElementById('success-value').setAttribute('stroke-dasharray', `${successValue}, 155`);
    },
    activeButtons: (x) => {
      setTimeout(() => {
        const tableButtons = document.querySelectorAll('.t-button')
        const buttonsArr = Array.from(tableButtons);
        for(let i = 0; i < buttonsArr.length -1; i++) {
          console.log(buttonsArr[i])
          if(state.currentPage == buttonsArr[i].dataset.page) {
              buttonsArr[i].classList.add('current-btn')
            } else {
              buttonsArr[i].classList.remove('current-btn')
            }
          }
        
      }, 20)
    },
    changeCurrentPage: (e) => {     
      if(e.target.classList.contains('t-button') === false) return;
      state.currentPage = parseFloat(e.target.dataset.page);
      
      UI.activeButtons(e.target.dataset.page)
      UI.displayTable(values.monthlyInterest, values.loanRemainingArray, values.totalInterestPaid, values.loanPayment)
      e.preventDefault()
    },
    tablePagination: function(currentPage, monthlyInterest, loanRemaining, interestPaid ) {
      const pageDisplay = {
        rowsPerPage: 12,
        totalPages: Math.ceil(loanRemaining.length / 12)
      }

      const trimStart = (currentPage - 1) * 12;
      const trimEnd = trimStart + pageDisplay.rowsPerPage;
      const trimmedLoanRemaining = loanRemaining.slice(trimStart, trimEnd);
      const trimmedMonthlyInterest = monthlyInterest.slice(trimStart, trimEnd);
      const trimmedInterestPaid = interestPaid.slice(trimStart, trimEnd);

      return {
        trimmedLoanRemaining, trimmedMonthlyInterest, trimmedInterestPaid, pages: pageDisplay.totalPages
      }
      
    },
    displayTable: (monthlyInterest, loanRemaining, interestPaid, paidThisMonth) => {
      let i;
      let output;
      let dte = new Date();
      let m = dte.getMonth();
      let d = dte.getDate()
      d = `0${d}`
      let y = dte.getUTCFullYear();
      let currentPage = state.currentPage
      let data = UI.tablePagination(currentPage, monthlyInterest, loanRemaining, interestPaid)

      document.querySelector('.repayment-results').innerHTML = `
      `;

      for(i = 0; i < data.trimmedInterestPaid.length; i ++) {
        m >= 12 ? m = 1 : m = m + 1;
        m == 1 ? y = y + 1 : y = y
        // currentPage > 1 && m === 1 ? y = y + currentPage : y = y + (currentPage - 1)
        
        output += `
        <tr>
        <td>${m}/${y}</td>
        <td>£${UI.insertCommas(paidThisMonth.toFixed(2))}</td>
        <td>£${UI.insertCommas(data.trimmedInterestPaid[i])}</td>
        <td>£${UI.insertCommas(data.trimmedMonthlyInterest[i])}</td>
        <td>£${UI.insertCommas(data.trimmedLoanRemaining[i])}</td>
        </tr>
        `
      }   
      
      document.querySelector('.repayment-results').innerHTML += output;
      document.querySelector('.repayment-results').childNodes[0].nodeValue = null;
      UI.createTableButtons(data.pages)
    }, 
    createTableButtons(totalPages) {
      const btnContainer = document.querySelector('.table-buttons')
      btnContainer.innerHTML = ''
      let output;
      let maxLeft = (state.currentPage - Math.floor(state.btnAmount / 4));
      let maxRight = (state.currentPage + Math.floor(state.btnAmount / 4));
      if(maxLeft < 1) {
        maxLeft = 1;
        maxRight = state.btnAmount;
      }
      if(maxRight > totalPages) {
        maxLeft = totalPages - (state.btnAmount - 1);
        maxRight = totalPages;
      }
      for(let page = maxLeft; page <= maxRight; page++) {
        if(page > totalPages) break
        
        output += `
        <a href="#" id="${page}" data-page='${page}' class="t-button">Year ${page}</a>
        `
      }
      btnContainer.innerHTML = output
      if(state.currentPage !== 1) {
        btnContainer.innerHTML = `<a href="#" id="first" data-page='1' class="t-button">First</a>` + btnContainer.innerHTML 
        btnContainer.childNodes[1].nodeValue = null;
      } else {
        btnContainer.childNodes[0].nodeValue = null;
      }
      if(state.currentPage != totalPages) {
        btnContainer.innerHTML += `<a href="#" id="last" class="t-button" data-page='${totalPages}'>Last</a>`
      }
      
    },
    displayChart: (loanRemainingArr) => {
      let loanNeeded = []
      loanRemainingArr.map((currentElement, i) => {
        if(i === 59 || i === 119 || i === 179 || i === 239 || i === 299 || i === 359 || i === 419 || i === 479) {
          loanNeeded.push(currentElement)
        }
      })
      for (let i = 0; i < myChart.data.datasets[0].data.length; i++) {
        if(loanNeeded[i] < 0) {
          myChart.data.datasets[0].data[i] = 0  
        } else {
          myChart.data.datasets[0].data[i] = loanNeeded[i]
        }    
      }
      myChart.update();   
    },
    insertCommas: (x) => {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
})();



