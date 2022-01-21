bluetooth.onBluetoothConnected(function () {
    bluetooth.startUartService()
    Ligado = true
    basic.showIcon(IconNames.Happy)
})
bluetooth.onBluetoothDisconnected(function () {
    Ligado = false
    basic.showIcon(IconNames.Asleep)
})
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.Hash), function () {
    cmd = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Hash))
    if (cmd == "luz") {
        if (Luz_esta_ligada) {
            pins.digitalWritePin(DigitalPin.P0, 0)
            Luz_esta_ligada = false
        } else {
            pins.digitalWritePin(DigitalPin.P0, 1)
            Luz_esta_ligada = true
        }
    } else if (cmd == "vento") {
        if (Ventoinha_esta_ligada) {
            pins.digitalWritePin(DigitalPin.P2, 0)
            Ventoinha_esta_ligada = false
        } else {
            pins.digitalWritePin(DigitalPin.P2, 1)
            Ventoinha_esta_ligada = true
        }
    } else {
        basic.showIcon(IconNames.No)
    }
    game.addScore(1)
})
let cmd = ""
let Ventoinha_esta_ligada = false
let Luz_esta_ligada = false
let Ligado = false
Ligado = false
Luz_esta_ligada = false
Ventoinha_esta_ligada = false
basic.showIcon(IconNames.Asleep)
soundExpression.hello.play()
basic.forever(function () {
    if (Ligado) {
        bluetooth.uartWriteString("Luz:" + convertToText(pins.analogReadPin(AnalogPin.P1)) + "::  ::" + "Temp:" + convertToText(input.temperature()))
        basic.pause(100)
    }
})
