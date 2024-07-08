const input = document.querySelector("#input")
const botao = document.querySelector("#btnEnviar")
const temperaturaValue = document.querySelector("#temperatura .value")
const chuvaValue = document.querySelector("#chuva .value")
const climaValue = document.querySelector("#clima .value")
const diaValue = document.querySelector("#dia .value")
const dayIcon = document.querySelector("#dayIcon")
const api_key = "os5UexDzEhGD7d0hGaAq78I1hRXxLvwH"

botao.addEventListener('click',async () => {
    const value = input.value
    const resultado = await currentConditions(value)
    console.log(resultado)

    temperaturaValue.textContent = ''
    chuvaValue.textContent = ''
    climaValue.textContent = ''
    diaValue.textContent = ''

    temperaturaValue.append(resultado.Temperature.Metric.Value," ", resultado.Temperature.Metric.Unit)
    chuvaValue.append(resultado.HasPrecipitation === true ? "Sim" : "Não")
    climaValue.append(resultado.WeatherText)
    diaValue.append(resultado.IsDayTime === true ? "Sim" : "Não")


    if(resultado.IsDayTime){
        dayIcon.src = 'images/sun.png'
    } else {
        dayIcon.src = 'images/crescent-moon.png'
    } 
})

async function requesitarDados(value) {
    const url = `http://dataservice.accuweather.com/locations/v1/search?q=${value}&apikey=${api_key}`

    const response = await fetch(url)
    const data = await response.json()
    const [objeto] = data
    return objeto
}

async function currentConditions(value) {
    const key = await requesitarDados(value)
    const url = `http://dataservice.accuweather.com/currentconditions/v1/${key.Key}?apikey=${api_key}&language=pt-br`
    
    const response = await fetch(url)
    const data = await response.json()
    const [objeto] = data
    return objeto
}

