bluetooth.onBluetoothConnected(function () {
    bluetooth.startUartService()
    BT_Ligado = true
    OnLed()
})
bluetooth.onBluetoothDisconnected(function () {
    BT_Ligado = false
    basic.showIcon(IconNames.Asleep)
})
input.onButtonPressed(Button.A, function () {
    basic.showString("Temp:" + Temperatura + "TempMax:" + Limiar_Temperatura)
    if (BT_Ligado) {
        OnLed()
    } else {
        basic.showIcon(IconNames.Asleep)
    }
})
function Ventoinha_Automatica () {
    if (Auto_Ligado) {
        if (Temperatura > Limiar_Temperatura) {
            Troca_Ventoinha(false)
        } else {
            Troca_Ventoinha(true)
        }
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
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.Hash), function () {
    cmd = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Hash))
    if (cmd == "luz") {
        Troca_Luz(Luz_esta_ligada)
    } else if (cmd == "vento") {
        Troca_Ventoinha(Ventoinha_esta_ligada)
    } else if (cmd == "autoon") {
        Auto_Ligado = true
    } else if (cmd == "autooff") {
        Auto_Ligado = false
    } else if (cmd.includes("setluz")) {
        Lmiar_Luz = parseFloat(cmd.substr(7, 4))
    } else if (cmd.includes("settemp")) {
        Limiar_Temperatura = parseFloat(cmd.substr(8, 2))
    } else {
        basic.showString(cmd)
    }
    Signal()
    OnLed()
})
input.onButtonPressed(Button.B, function () {
    basic.showString("Luz:" + Luz + "LuzMax" + Lmiar_Luz)
    if (BT_Ligado) {
        OnLed()
    } else {
        basic.showIcon(IconNames.Asleep)
    }
})
function Luz_Automatica () {
    if (Auto_Ligado) {
        if (Luz < Lmiar_Luz) {
            Troca_Luz(false)
        } else {
            Troca_Luz(true)
        }
    }
}
function Troca_Ventoinha (Ventoinha_Ligada: boolean) {
    if (Ventoinha_Ligada) {
        pins.digitalWritePin(DigitalPin.P2, 0)
        Ventoinha_esta_ligada = false
    } else {
        pins.digitalWritePin(DigitalPin.P2, 1)
        Ventoinha_esta_ligada = true
    }
}
function Signal () {
    basic.showIcon(IconNames.SmallSquare, 30)
basic.showIcon(IconNames.Square, 30)
}
function OnLed () {
    basic.showLeds(`
        . . . . .
        . . . . .
        . . # . .
        . . . . .
        . . . . .
        ` ,5)
}
let Luz = 0
let cmd = ""
let Temperatura = 0
let Lmiar_Luz = 0
let Limiar_Temperatura = 0
let Auto_Ligado = false
let Ventoinha_esta_ligada = false
let Luz_esta_ligada = false
let BT_Ligado = false
BT_Ligado = false
Luz_esta_ligada = false
Ventoinha_esta_ligada = false
Auto_Ligado = true
Limiar_Temperatura = 23
Lmiar_Luz = 800
basic.showIcon(IconNames.Asleep)
soundExpression.hello.play()
basic.forever(function () {
    Temperatura = input.temperature()
    Luz = pins.analogReadPin(AnalogPin.P1)
    Luz_Automatica()
    Ventoinha_Automatica()
    if (BT_Ligado) {
        bluetooth.uartWriteString("Luz:" + convertToText(Luz) + "::  ::" + "Temp:" + convertToText(Temperatura))
        bluetooth.uartWriteString("luzlim" + convertToText(Lmiar_Luz))
        bluetooth.uartWriteString("templim" + convertToText(Limiar_Temperatura))
        basic.pause(100)
    }
})
