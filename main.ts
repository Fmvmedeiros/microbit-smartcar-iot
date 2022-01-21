function Luz_Automatica () {
    if (Luz < Lmiar_Luz) {
        Troca_Luz(false)
    } else {
        Troca_Luz(true)
    }
}
bluetooth.onBluetoothConnected(function () {
    bluetooth.startUartService()
    Ligado = true
    basic.showIcon(IconNames.Happy)
})
bluetooth.onBluetoothDisconnected(function () {
    Ligado = false
    basic.showIcon(IconNames.Asleep)
})
function Ventoinha_Automatica () {
    if (Temperatura > Limiar_Temperatura) {
        Troca_Ventoinha(false)
    } else {
        Troca_Ventoinha(true)
    }
}
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.Hash), function () {
    cmd = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Hash))
    if (cmd == "luz") {
        Troca_Luz(Luz_esta_ligada)
    } else if (cmd == "vento") {
        Troca_Ventoinha(Ventoinha_esta_ligada)
    } else {
        basic.showIcon(IconNames.No)
    }
    game.addScore(1)
})
function Troca_Ventoinha (Ventoinha_Ligada: boolean) {
    if (Ventoinha_Ligada) {
        pins.digitalWritePin(DigitalPin.P2, 0)
        Ventoinha_esta_ligada = false
    } else {
        pins.digitalWritePin(DigitalPin.P2, 1)
        Ventoinha_esta_ligada = true
    }
}
function Troca_Luz (Luz_Ligada: boolean) {
    if (Luz_Ligada) {
        pins.digitalWritePin(DigitalPin.P0, 0)
        Luz_esta_ligada = false
    } else {
        pins.digitalWritePin(DigitalPin.P0, 1)
        Luz_esta_ligada = true
    }
}
let cmd = ""
let Temperatura = 0
let Luz = 0
let Lmiar_Luz = 0
let Limiar_Temperatura = 0
let Ventoinha_esta_ligada = false
let Luz_esta_ligada = false
let Ligado = false
Ligado = false
Luz_esta_ligada = false
Ventoinha_esta_ligada = false
Limiar_Temperatura = 23
Lmiar_Luz = 800
basic.showIcon(IconNames.Asleep)
soundExpression.hello.play()
basic.forever(function () {
    Temperatura = input.temperature()
    Luz = pins.analogReadPin(AnalogPin.P1)
    Luz_Automatica()
    Ventoinha_Automatica()
    if (Ligado) {
        bluetooth.uartWriteString("Luz:" + convertToText(Luz) + "::  ::" + "Temp:" + convertToText(Temperatura))
    }
    basic.pause(100)
})
