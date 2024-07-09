const input = document.querySelector("#input")
const botao = document.querySelector("#btnEnviar")
const temperaturaValue = document.querySelector("#temperatura .value")
const aparenteValue = document.querySelector("#temperatura .aparent-value")
const sumarioTemp = document.querySelector("#temperatura .sumario-temp-value")
const sumarioTempMax = document.querySelector("#temperatura .sumario-temp-value-max")
const chuvaValue = document.querySelector("#chuva .value")
const sumarioValue = document.querySelector("#chuva .sumario-value")
const climaValue = document.querySelector("#clima .value")
const cloudValue = document.querySelector("#clima .cloud-value")
const diaValue = document.querySelector("#dia .value")
const humidadeValue = document.querySelector("#humidade .value")
const ventoDirecaoValue = document.querySelector("#vento .direcao-value")
const ventoVelocidadeValue = document.querySelector("#vento .velocidade-value")
const pressaoValue = document.querySelector("#pressao .value")
const senseTemp = document.querySelector("#temp-sensacao .value")
const senseTempSombra = document.querySelector("#temp-sensacao-sombra .value")
const uvIndex = document.querySelector("#uv-index .value")
const alturaNuvem = document.querySelector("#ceiling .value")
const precipitacao = document.querySelector("#chuva .precipitation-value")
const dayIcon = document.querySelector("#dayIcon")
const dateTime = document.querySelector(".date-time")
const api_key = "os5UexDzEhGD7d0hGaAq78I1hRXxLvwH"

botao.addEventListener('click',async () => {
    const value = input.value
    const resultado = await currentConditions(value)

    const time = formatarData(resultado.LocalObservationDateTime)
    
    const tempValue = resultado.Temperature.Metric.Value
    const tempUnit = resultado.Temperature.Metric.Unit
    const tempAparentValue = resultado.ApparentTemperature.Metric.Value
    const tempAparentUnit = resultado.ApparentTemperature.Metric.Unit
    const tempSumarioValue = resultado.TemperatureSummary.Past24HourRange.Minimum.Metric.Value
    const tempSumarioUnit = resultado.TemperatureSummary.Past24HourRange.Minimum.Metric.Unit
    const tempSumarioValueMax = resultado.TemperatureSummary.Past24HourRange.Maximum.Metric.Value
    const tempSumarioUnitMax = resultado.TemperatureSummary.Past24HourRange.Maximum.Metric.Unit
    const sombraValue = resultado.RealFeelTemperature.Metric.Value
    const sombraUnit = resultado.RealFeelTemperature.Metric.Unit
    const sensacaoTermicaValue = resultado.RealFeelTemperatureShade.Metric.Value 
    const sensacaoTermicaUnit = resultado.RealFeelTemperatureShade.Metric.Unit 

    const chuva = resultado.HasPrecipitation
    const sumarioChuvaValue = resultado.PrecipitationSummary.Past24Hours.Metric.Value
    const sumarioChuvaUnit = resultado.PrecipitationSummary.Past24Hours.Metric.Unit
    const precipitationType = resultado.PrecipitationType

    const clima = resultado.WeatherText
    const nuvens = resultado.CloudCover
    const alturaValue = resultado.Ceiling.Metric.Value
    const alturaUnit = resultado.Ceiling.Metric.Unit
    const uv = resultado.UVIndex
    const uvText = resultado.UVIndexText

    const dia = resultado.IsDayTime

    const humidade = resultado.RelativeHumidity

    const ventoDirecao = resultado.Wind.Direction.Degrees
    const ventoDirecaoLocalizacao = resultado.Wind.Direction.Localized
    const ventoVelocidade = resultado.Wind.Speed.Metric.Value
    const ventoVelocidadeUnit = resultado.Wind.Speed.Metric.Unit

    const pressao = resultado.Pressure.Metric.Value
    const pressaoUnit = resultado.Pressure.Metric.Unit

    dateTime.textContent = ''

    updateValue(temperaturaValue, `${tempValue} ${tempUnit}`)
    updateValue(aparenteValue, `${tempAparentValue} ${tempAparentUnit}`)
    updateValue(sumarioTemp, `${tempSumarioValue} ${tempSumarioUnit}`)
    updateValue(sumarioTempMax, `${tempSumarioValueMax} ${tempSumarioUnitMax}`)
    updateValue(senseTemp, `${sensacaoTermicaValue} ${sensacaoTermicaUnit}`)
    updateValue(senseTempSombra, `${sombraValue} ${sombraUnit}`)

    updateValue(chuvaValue, chuva === true ? "Sim" : "Não")
    updateValue(sumarioValue, `${sumarioChuvaValue} ${sumarioChuvaUnit}`)
    updateValue(precipitacao, precipitationType !== null ? `${precipitationType}` : `Sem precipitação`)
    
    updateValue(climaValue, `${clima}`)
    updateValue(cloudValue, nuvens !== null ? `${nuvens} %` : "0%" )
    updateValue(alturaNuvem, `${alturaValue} ${alturaUnit}`)
    
    updateValue(diaValue, dia === true ? "Sim" : "Não")
    dateTime.append(time)
    
    updateValue(humidadeValue, `${humidade} %`)

    updateValue(ventoDirecaoValue, `${ventoDirecao} ${ventoDirecaoLocalizacao}`)
    updateValue(ventoVelocidadeValue, `${ventoVelocidade} ${ventoVelocidadeUnit}`)

    updateValue(pressaoValue, ` ${pressao} ${pressaoUnit}`)

    updateValue(uvIndex, `${uv} - ${uvText}`)

    if(dia){
        dayIcon.src = 'images/sun.png'
    } else {
        dayIcon.src = 'images/crescent-moon.png'
    } 
})

async function requesitarDados(value) {
    const url = `http://dataservice.accuweather.com/locations/v1/search?q=${value}&apikey=${api_key}`

    const response = await fetch(url)
    if(!response.ok){
        alert("Erro em encontrar a localização: " + response.statusText)
    }
    const data = await response.json()
    const [objeto] = data
    return objeto
}

async function currentConditions(value) {
    const key = await requesitarDados(value)
    if(!key){
        alert("Erro em conseguir a chave!")
    }
    const url = `http://dataservice.accuweather.com/currentconditions/v1/${key.Key}?apikey=${api_key}&language=pt-br&details=true`
    
    const response = await fetch(url)
    if(!response.ok){
        alert("Erro em encontrar as condições atuais: " + response.statusText)
    }
    const data = await response.json()
    const [objeto] = data
    return objeto
}



function formatarData(dateTime) {
    const time = new Date(dateTime)
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    }

    return new Intl.DateTimeFormat('pt-BR', options).format(time)
}

function updateValue(element, value) {
    element.textContent = value
    element.classList.add('change')
    setTimeout(() => {
        element.classList.remove('change')
    }, 500)
}

