bluetooth.onBluetoothConnected(function () {
    bluetooth.startUartService()
    Ligado = true
    basic.showIcon(IconNames.Happy)
})
bluetooth.onBluetoothDisconnected(function () {
    Ligado = false
    basic.showIcon(IconNames.Sad)
})
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.Hash), function () {
    cmd = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Hash))
    if (cmd == "luz") {
        pins.digitalWritePin(DigitalPin.P0, 1)
    } else if (cmd == "vento") {
        pins.digitalWritePin(DigitalPin.P2, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P0, 0)
        pins.digitalWritePin(DigitalPin.P2, 0)
    }
    game.addScore(1)
})
let cmd = ""
let Ligado = false
Ligado = false
basic.showIcon(IconNames.Asleep)
soundExpression.hello.play()
basic.forever(function () {
    if (Ligado) {
        bluetooth.uartWriteString(convertToText(pins.analogReadPin(AnalogPin.P1)))
        basic.pause(100)
    }
})
