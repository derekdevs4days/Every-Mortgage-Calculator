let state ={
    price: getNumber(document.querySelectorAll('[name="price"]')[0].value),
    loan_years: getNumber(document.querySelectorAll('[name="loan_years"]')[0].value),
    down_payment: getNumber(document.querySelectorAll('[name="down_payment"]')[0].value),
    interest_rate: getNumber(document.querySelectorAll('[name="interest_rate"]')[0].value),
    property_taxes: getNumber(document.querySelectorAll('[name="property_taxes"]')[0].value),
    home_insurance: getNumber(document.querySelectorAll('[name="home_insurance"]')[0].value),
    hoa: getNumber(document.querySelectorAll('[name="hoa"]')[0].value),
}

/* Global Variable */
let totalLoan, 
totalMonths,
monthlyPrincipalInterest,
monthlyPropertyTaxes,
monthlyHomeInsurance,
monthlyHOA,
monthlyTotal,

labels = ['Principal & Interest', 'Property Tax','Home Insurance','HOA'],
    backgroundColor = [
        'rgba(133, 211, 55, 1)',
        'rgba(255, 57, 57, 1)',            
        'rgba(46, 181, 234,1)',
        'rgba(255, 235, 59, 1)',
        'rgba(255, 235, 59, 1)',
        
    ];

borderColor = [
    'rgba(133, 211, 55, 1)',
    'rgba(255, 57, 57, 1)',
    'rgba(46, 181, 234,1)',
    'rgba(255, 235, 59, 1)',
    'rgba(46, 181, 234,1)',
    'rgba(255, 235, 59, 1)',
  
   
];


/* Turn String Input Into Numbers */
function getNumber(string){
    return Number(string.replace(/[^0-9\.-]+/g, ''))
}


/* Charts.js */
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: labels,
        datasets: [{
            label: '# of Votes',
            data: [
                monthlyPrincipalInterest,
                monthlyPropertyTaxes,
                monthlyHomeInsurance,
                monthlyHOA
            ],
            backgroundColor: backgroundColor, 
    
            borderColor: borderColor,
            borderWidth: 1
        }]
    },
    
});

myChart.options.animation = false;

/* Event Listeners For Text Inputs & Function To Get Value*/
let inputText = document.getElementsByClassName('form-group__textInput')
for(let i = 0; i < inputText.length; i++){
    inputText[i].addEventListener('input', updateTextInput)
}

function updateTextInput(event){
    let name = event.target.name
    let value = event.target.value
    
    if(name==='price'){
        value = getNumber(value)
    }
    state = {
        ...state,
        [name]: value
    }

    
}
/* Event Listeners For Range Inputs & Function To Get Value*/
let inputSlides = document.getElementsByClassName('form-group__range-slide')
for(let i = 0; i < inputSlides.length; i++){
    inputSlides[i].addEventListener('input', updateInputState)
}
function updateInputState(event){
    let name = event.target.name
    let value = event.target.value
    
    if(name==='price'){
        value = getNumber(value)
    }
    if(event.target.type =='range' && (event.target.name =='hoa'||event.target.name =='home_insurance' )){
        let total = (document.getElementsByClassName(`total_${name}`))[0].innerHTML = `$ ${value}`
    }else{
        let total = (document.getElementsByClassName(`total_${name}`))[0].innerHTML = `${value} %`
    }
    state = {
        ...state,
        [name]: value
        
    }
    
    calculateData()
}

/* Make Results Table Appear When Submit Is Triggered */
document.getElementsByTagName('form')[0].addEventListener('submit', (event) => {
    event.preventDefault();

    document.getElementsByClassName('main-page__right')[0].classList.add('main-page__right--animate')
    calculateData()
})

/* Math Stuff & Adding Value To DOM*/
function calculateData(){
    totalLoan = state.price - (state.price * (state.down_payment/100))

    totalMonths = state.loan_years * 12

    monthlyInterest = (state.interest_rate / 100) / 12

    monthlyPrincipalInterest = (totalLoan * ((monthlyInterest * (1+monthlyInterest)** totalMonths) / ((1 + monthlyInterest) ** totalMonths - 1) )).toFixed(2)

    monthlyPropertyTaxes = ((state.price * (state.property_taxes / 100)) / 12)

    monthlyHomeInsurance = state.home_insurance/12

    monthlyHOA = state.hoa/12

    monthlyTotal = 
    parseFloat(monthlyPrincipalInterest) 
    + parseFloat(monthlyPropertyTaxes)
    + parseFloat(monthlyHomeInsurance)
    +parseFloat(monthlyHOA)
    
    document.getElementsByClassName('info__numbers--principal')[0].innerHTML = `$ ${parseFloat(monthlyPrincipalInterest).toFixed(2)}`

    document.getElementsByClassName('info__numbers--property_taxes')[0].innerHTML = `$ ${parseFloat(monthlyPropertyTaxes).toFixed(2)}`

    document.getElementsByClassName('info__numbers--home_insurance')[0].innerHTML = `$ ${parseFloat(monthlyHomeInsurance).toFixed(2)}`

    document.getElementsByClassName('info__numbers--hoa')[0].innerHTML = `$ ${parseFloat(monthlyHOA).toFixed(2)}`

    document.getElementsByClassName('info__numbers--total')[0].innerHTML = `$ ${parseFloat(monthlyTotal).toFixed(2)}`

    updateChart(myChart, labels, backgroundColor)
    
}

/* Update Chart */
function updateChart(chart, label, color){
    chart.data.datasets.pop()
    chart.data.datasets.push({
        lable: label,
        backgroundColor: color,
        data: [ monthlyPrincipalInterest, monthlyPropertyTaxes, monthlyHomeInsurance, monthlyHOA]
    });
    chart.options.transitions.active.animation.duration = 0;
    chart.update()
}
