/** rgpio を Node.js から利用するモジュール ** */

#include <napi.h>
#include <rgpio.h>
#include <unistd.h>
#include <string>

using namespace Napi;

// rgpio デーモンに接続
Promise _rgpiodStart(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 2)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _rgpiodStart").Value());
  }
  if (!info[0].IsString() || !info[1].IsString())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _rgpiodStart").Value());
  }
  else
  {
    std::string ipaddr = info[0].As<String>().Utf8Value();
    std::string port = info[1].As<String>().Utf8Value();
    deferred.Resolve(Number::New(env, rgpiod_start(ipaddr.c_str(), port.c_str())));
  }
  return deferred.Promise();
}
// rgpioデーモンとの接続を閉じる
Promise _rgpiodStop(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 1)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _rgpiodStop").Value());
  }
  if (!info[0].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _rgpiodStop").Value());
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    rgpiod_stop(sbc);
    deferred.Resolve(env.Null());
  }
  return deferred.Promise();
}

// gpiochipデバイスを開く
Promise _gpiochipOpen(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 2)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _gpiochipOpen").Value());
  }
  if (!info[0].IsNumber() || !info[1].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _gpiochipOpen").Value());
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int gpioDev = info[1].As<Number>().Int32Value();
    deferred.Resolve(Number::New(env, gpiochip_open(sbc, gpioDev)));
  }
  return deferred.Promise();
}

// gpiochipデバイスを閉じる
Promise _gpiochipClose(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 2)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _gpiochipClose").Value());
  }
  if (!info[0].IsNumber() || !info[1].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _gpiochipClose").Value());
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int handle = info[1].As<Number>().Int32Value();
    deferred.Resolve(Number::New(env, gpiochip_close(sbc, handle)));
  }
  return deferred.Promise();
}

// GPIO のモードを出力にする（ことを要求？）
Promise _gpioClaimOutput(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 5)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _gpioClaimOutput").Value());
  }
  if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber() || !info[3].IsNumber() || !info[4].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _gpioClaimOutput").Value());
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int handle = info[1].As<Number>().Int32Value();
    int lFlags = info[2].As<Number>().Int32Value();
    int gpio = info[3].As<Number>().Int32Value();
    int value = info[4].As<Number>().Int32Value();

    deferred.Resolve(Number::New(env, gpio_claim_output(sbc, handle, lFlags, gpio, value)));
  }
  return deferred.Promise();
}

// GPIO のモードを入力にする（ことを要求？）
Promise _gpioClaimInput(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 4)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _gpioClaimInput").Value());
  }
  if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber() || !info[3].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _gpioClaimInput").Value());
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int handle = info[1].As<Number>().Int32Value();
    int lFlags = info[2].As<Number>().Int32Value();
    int gpio = info[3].As<Number>().Int32Value();

    deferred.Resolve(Number::New(env, gpio_claim_input(sbc, handle, lFlags, gpio)));
  }
  return deferred.Promise();
}

// GPIOの電圧を読む
Promise _gpioRead(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 3)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _gpioRead").Value());
  }
  if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _gpioRead").Value());
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int handle = info[1].As<Number>().Int32Value();
    int gpio = info[2].As<Number>().Int32Value();

    deferred.Resolve(Number::New(env, gpio_read(sbc, handle, gpio)));
  }
  return deferred.Promise();
}

// GPIO の電圧をセットする
Promise _gpioWrite(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 4)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _gpioWrite").Value());
  }
  if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber() || !info[3].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _gpioWrite").Value());
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int handle = info[1].As<Number>().Int32Value();
    int gpio = info[2].As<Number>().Int32Value();
    int value = info[3].As<Number>().Int32Value();

    deferred.Resolve(Number::New(env, gpio_write(sbc, handle, gpio, value)));
  }
  return deferred.Promise();
}

// シリアルポートを開く
Promise _serialOpen(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 4)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _serialOpen").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsString() || !info[2].IsNumber() || !info[3].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _serialOpen").Value());
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    std::string ser_tty = info[1].As<String>().Utf8Value();
    int baud = info[2].As<Number>().Uint32Value();
    int ser_flags = info[3].As<Number>().Uint32Value();
    deferred.Resolve(Number::New(env, serial_open(sbc, (char *)ser_tty.c_str(), baud, ser_flags)));
  }
  return deferred.Promise();
}

// シリアルポートを閉じる
Promise _serialClose(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 2)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _serialClose").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _serialClose").Value());
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int handle = info[1].As<Number>().Uint32Value();
    deferred.Resolve(Number::New(env, serial_close(sbc, handle)));
  }
  return deferred.Promise();
}

// シリアルデバイスからデータを読む
Promise _serialRead(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 3)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _serialRead").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _serialRead").Value());
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int handle = info[1].As<Number>().Uint32Value();
    int count = info[2].As<Number>().Uint32Value();

    char buf[count];
    int rxCount = serial_read(sbc, handle, buf, count);
    auto outBuf = Buffer<char>::Copy(env, buf, rxCount);
    deferred.Resolve(outBuf);
  }
  return deferred.Promise();
}

// シリアルデバイスにバイト列を書き込む(data: string)
Promise _serialWrite(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 4)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _serialWrite").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsBuffer() || !info[3].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _serialWrite").Value());
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int handle = info[1].As<Number>().Uint32Value();
    auto buf = info[2].As<Buffer<char>>();
    int count = info[3].As<Number>().Uint32Value();

    deferred.Resolve(Number::New(env, serial_write(sbc, handle, buf.Data(), count)));
  }
  return deferred.Promise();
}

// シリアルデバイスから読み出し可能なバイト数を返す
Promise _serialDataAvailable(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 2)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _serialDataAvailable").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _serialDataAvailable").Value());
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int handle = info[1].As<Number>().Uint32Value();
    deferred.Resolve(Number::New(env, serial_data_available(sbc, handle)));
  }
  return deferred.Promise();
}

// I2Cバスアドレスのデバイスのハンドルを返す
Promise _i2cOpen(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 4)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _i2cOpen").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber() || !info[3].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _i2cOpen").Value());
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int i2c_bus = info[1].As<Number>().Uint32Value();
    int i2c_addr = info[2].As<Number>().Uint32Value();
    int i2c_flags = info[3].As<Number>().Uint32Value();
    deferred.Resolve(Number::New(env, i2c_open(sbc, i2c_bus, i2c_addr, i2c_flags)));
  }
  return deferred.Promise();
}
// オープン済みI2Cハンドルを閉じる
Promise _i2cClose(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 2)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _i2cClose").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _i2cClose").Value());
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int handle = info[1].As<Number>().Uint32Value();
    deferred.Resolve(Number::New(env, i2c_close(sbc, handle)));
  }
  return deferred.Promise();
}

// デバイスに１バイトを送る
Promise _i2cWriteByte(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 3)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _i2cWriteByte").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _i2cWriteByte").Value());
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int handle = info[1].As<Number>().Uint32Value();
    int bVal = info[2].As<Number>().Uint32Value();
    deferred.Resolve(Number::New(env, i2c_write_byte(sbc, handle, bVal)));
  }
  return deferred.Promise();
}
// デバイスから１バイトを受け取る
Promise _i2cReadByte(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 2)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _i2cReadByte").Value());
  }
  else if (!info[0].IsNumber() || !info[0].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _i2cReadByte").Value());
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int handle = info[1].As<Number>().Uint32Value();
    deferred.Resolve(Number::New(env, i2c_read_byte(sbc, handle)));
  }
  return deferred.Promise();
}

// I2Cハンドルに関連付けられているデバイスの指定されたレジスタに1バイトを書き込む
Promise _i2cWriteByteData(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 4)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _i2cWriteByteData").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber() || !info[3].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _i2cWriteByteData").Value());
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int handle = info[1].As<Number>().Uint32Value();
    int i2c_reg = info[2].As<Number>().Uint32Value();
    int bVal = info[3].As<Number>().Uint32Value();
    deferred.Resolve(Number::New(env, i2c_write_byte_data(sbc, handle, i2c_reg, bVal)));
  }
  return deferred.Promise();
}
// I2Cハンドルに関連付けられているデバイスの指定されたレジスタから1バイトを読み込む
Promise _i2cReadByteData(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 3)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _i2cReadByteData").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _i2cReadByteData").Value());
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int handle = info[1].As<Number>().Uint32Value();
    int i2c_reg = info[2].As<Number>().Uint32Value();
    deferred.Resolve(Number::New(env, i2c_read_byte_data(sbc, handle, i2c_reg)));
  }
  return deferred.Promise();
}

// I2Cハンドルに関連付けられているデバイスの指定されたレジスタからcountバイトを読み込む。countは1～32。
Promise _i2cReadI2cBlockData(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 4)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _i2cReadI2cBlockData").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber() || !info[3].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _i2cReadI2cBlockData").Value());
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int handle = info[1].As<Number>().Uint32Value();
    int i2c_reg = info[2].As<Number>().Uint32Value();
    int count = info[3].As<Number>().Uint32Value();
    char buf[count];
    int rxCount = i2c_read_i2c_block_data(sbc, handle, i2c_reg, buf, count);
    auto outBuf = Buffer<char>::Copy(env, buf, rxCount);
    deferred.Resolve(outBuf);
  }
  return deferred.Promise();
}

// I2Cハンドルに関連付けられているデバイスの指定されたレジスタに最大３２バイトのデータを書き込む。
Promise _i2cWriteI2cBlockData(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 5)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _i2cWriteI2cBlockData").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber() || !info[3].IsBuffer() || !info[4].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _i2cWriteI2cBlockData").Value());
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int handle = info[1].As<Number>().Uint32Value();
    int i2c_reg = info[2].As<Number>().Uint32Value();
    auto buf = info[3].As<Buffer<char>>();
    int count = info[4].As<Number>().Uint32Value();

    deferred.Resolve(Number::New(env, i2c_write_i2c_block_data(sbc, handle, i2c_reg, buf.Data(), count)));
  }
  return deferred.Promise();
}

// I2Cハンドルに関連付けられているデバイスの指定されたレジスタから単一の16ビットワードを読み取る
Promise _i2cReadWordData(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 3)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _i2cReadWordData").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _i2cReadWordData").Value());
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int handle = info[1].As<Number>().Uint32Value();
    int i2c_reg = info[2].As<Number>().Uint32Value();
    deferred.Resolve(Number::New(env, i2c_read_word_data(sbc, handle, i2c_reg)));
  }
  return deferred.Promise();
}
// I2Cハンドルに関連付けられているデバイスの指定されたレジスタに単一の16ビットワードを書き込む
Promise _i2cWriteWordData(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 4)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _i2cWriteWordData").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber() || !info[3].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _i2cWriteWordData").Value());
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int handle = info[1].As<Number>().Uint32Value();
    int i2c_reg = info[2].As<Number>().Uint32Value();
    int wVal = info[3].As<Number>().Uint32Value();

    deferred.Resolve(Number::New(env, i2c_write_word_data(sbc, handle, i2c_reg, wVal)));
  }
  return deferred.Promise();
}

// i2c デバイスからデータを受け取る
Promise _i2cReadDevice(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 3)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _i2cReadDevice").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _i2cReadDevice").Value());
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int handle = info[1].As<Number>().Uint32Value();
    int count = info[2].As<Number>().Uint32Value();

    char buf[count];
    int rxCount = i2c_read_device(sbc, handle, buf, count);
    auto outBuf = Buffer<char>::Copy(env, buf, rxCount);
    deferred.Resolve(outBuf);
  }
  return deferred.Promise();
}

// i2c デバイスにバイト列を送る(data: buffer)
Promise _i2cWriteDevice(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 4)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _i2cWriteDevice").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsBuffer() || !info[3].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _i2cWriteDevice").Value());
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int handle = info[1].As<Number>().Uint32Value();
    auto buf = info[2].As<Buffer<char>>();
    int count = info[3].As<Number>().Uint32Value();

    deferred.Resolve(Number::New(env, i2c_write_device(sbc, handle, buf.Data(), count)));
  }
  return deferred.Promise();
}

// スリープ
Promise _lguSleep(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Napi::Promise::Deferred::New(env);
  if (info.Length() != 1)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _lguSleep").Value());
  }
  else if (!info[0].IsNumber())
  {
    deferred.Reject(
        Napi::TypeError::New(env, "Invalid argument types: _lguSleep").Value());
  }
  else
  {
    double sleep_secs = info[0].As<Number>().DoubleValue();
    lgu_sleep(sleep_secs);
    deferred.Resolve(env.Null());
  }
  return deferred.Promise();
}

/******** 同期処理関数 ********/
// rgpio デーモンに接続
Value _rgpiodStartSync(const CallbackInfo &info)
{
  Env env = info.Env();
  if (info.Length() != 2)
  {
    TypeError::New(env, "Invalid argument count: _rgpiodStartSync")
        .ThrowAsJavaScriptException();
    return env.Null();
  }
  else if (!info[0].IsString() || !info[1].IsString())
  {
    TypeError::New(env, "Invalid argument types: _rgpiodStartSync").ThrowAsJavaScriptException();
    return env.Null();
  }
  else
  {
    std::string ipaddr = info[0].As<String>().Utf8Value();
    std::string port = info[1].As<String>().Utf8Value();
    return Number::New(env, rgpiod_start(ipaddr.c_str(), port.c_str()));
  }
}
// rgpioデーモンとの接続を閉じる
Value _rgpiodStopSync(const CallbackInfo &info)
{
  Env env = info.Env();
  if (info.Length() != 1)
  {
    TypeError::New(env, "Invalid argument count: _rgpiodStopSync")
        .ThrowAsJavaScriptException();
    return env.Null();
  }
  else if (!info[0].IsNumber())
  {
    TypeError::New(env, "Invalid argument types: _rgpiodStop")
        .ThrowAsJavaScriptException();
    return env.Null();
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    rgpiod_stop(sbc);
    return env.Null();
  }
}
// I2Cバスアドレスのデバイスのハンドルを返す
Value _i2cOpenSync(const CallbackInfo &info)
{
  Env env = info.Env();
  if (info.Length() != 4)
  {
    TypeError::New(env, "Invalid argument count: _i2cOpen")
        .ThrowAsJavaScriptException();
    return env.Null();
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber() || !info[3].IsNumber())
  {
    TypeError::New(env, "Invalid argument types: _i2cOpen")
        .ThrowAsJavaScriptException();
    return env.Null();
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int i2c_bus = info[1].As<Number>().Uint32Value();
    int i2c_addr = info[2].As<Number>().Uint32Value();
    int i2c_flags = info[3].As<Number>().Uint32Value();
    return Number::New(env, i2c_open(sbc, i2c_bus, i2c_addr, i2c_flags));
  }
}
// オープン済みI2Cハンドルを閉じる
Value _i2cCloseSync(const CallbackInfo &info)
{
  Env env = info.Env();
  if (info.Length() != 2)
  {
    TypeError::New(env, "Invalid argument count: _i2cClose")
        .ThrowAsJavaScriptException();
    return env.Null();
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber())
  {
    TypeError::New(env, "Invalid argument types: _i2cClose")
        .ThrowAsJavaScriptException();
    return env.Null();
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int handle = info[1].As<Number>().Uint32Value();
    return Number::New(env, i2c_close(sbc, handle));
  }
}
// デバイスから１バイトを受け取る
Value _i2cReadByteSync(const CallbackInfo &info)
{
  Env env = info.Env();
  if (info.Length() != 2)
  {
    TypeError::New(env, "Invalid argument count: _i2cReadByteSync")
        .ThrowAsJavaScriptException();
    return env.Null();
  }
  else if (!info[0].IsNumber() || !info[0].IsNumber())
  {
    TypeError::New(env, "Invalid argument types: _i2cReadByteSync")
        .ThrowAsJavaScriptException();
    return env.Null();
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int handle = info[1].As<Number>().Uint32Value();
    return Number::New(env, i2c_read_byte(sbc, handle));
  }
}
// i2c デバイスにバイト列を送る(data: buffer)
Value _i2cWriteDeviceSync(const CallbackInfo &info)
{
  Env env = info.Env();
  if (info.Length() != 4)
  {
    TypeError::New(env, "Invalid argument count: _i2cWriteDevice")
        .ThrowAsJavaScriptException();
    return env.Null();
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsBuffer() || !info[3].IsNumber())
  {
    TypeError::New(env, "Invalid argument types: _i2cWriteDevice")
        .ThrowAsJavaScriptException();
    return env.Null();
  }
  else
  {
    int sbc = info[0].As<Number>().Int32Value();
    int handle = info[1].As<Number>().Uint32Value();
    auto buf = info[2].As<Buffer<char>>();
    int count = info[3].As<Number>().Uint32Value();

    return Number::New(env, i2c_write_device(sbc, handle, buf.Data(), count));
  }
}

Object
Init(Env env, Object exports)
{
  exports.Set(String::New(env, "_rgpiod_start"), Function::New(env, _rgpiodStart));
  exports.Set(String::New(env, "_rgpiod_stop"), Function::New(env, _rgpiodStop));
  exports.Set(String::New(env, "_gpiochip_open"), Function::New(env, _gpiochipOpen));
  exports.Set(String::New(env, "_gpiochip_close"), Function::New(env, _gpiochipClose));
  exports.Set(String::New(env, "_gpio_claim_input"), Function::New(env, _gpioClaimInput));
  exports.Set(String::New(env, "_gpio_claim_output"), Function::New(env, _gpioClaimOutput));
  exports.Set(String::New(env, "_gpio_read"), Function::New(env, _gpioRead));
  exports.Set(String::New(env, "_gpio_write"), Function::New(env, _gpioWrite));
  exports.Set(String::New(env, "_serial_open"), Function::New(env, _serialOpen));
  exports.Set(String::New(env, "_serial_close"), Function::New(env, _serialClose));
  exports.Set(String::New(env, "_serial_read"), Function::New(env, _serialRead));
  exports.Set(String::New(env, "_serial_write"), Function::New(env, _serialWrite));
  exports.Set(String::New(env, "_serial_data_available"), Function::New(env, _serialDataAvailable));
  exports.Set(String::New(env, "_i2c_open"), Function::New(env, _i2cOpen));
  exports.Set(String::New(env, "_i2c_close"), Function::New(env, _i2cClose));
  exports.Set(String::New(env, "_i2c_write_byte"), Function::New(env, _i2cWriteByte));
  exports.Set(String::New(env, "_i2c_read_byte"), Function::New(env, _i2cReadByte));
  exports.Set(String::New(env, "_i2c_write_byte_data"), Function::New(env, _i2cWriteByteData));
  exports.Set(String::New(env, "_i2c_read_byte_data"), Function::New(env, _i2cReadByteData));
  exports.Set(String::New(env, "_i2c_read_i2c_block_data"), Function::New(env, _i2cReadI2cBlockData));
  exports.Set(String::New(env, "_i2c_write_i2c_block_data"), Function::New(env, _i2cWriteI2cBlockData));
  exports.Set(String::New(env, "_i2c_read_word_data"), Function::New(env, _i2cReadWordData));
  exports.Set(String::New(env, "_i2c_write_word_data"), Function::New(env, _i2cWriteWordData));
  exports.Set(String::New(env, "_i2c_write_device"), Function::New(env, _i2cWriteDevice));
  exports.Set(String::New(env, "_i2c_read_device"), Function::New(env, _i2cReadDevice));
  exports.Set(String::New(env, "_lgu_sleep"), Function::New(env, _lguSleep));
  exports.Set(String::New(env, "_rgpiod_start_sync"), Function::New(env, _rgpiodStartSync));
  exports.Set(String::New(env, "_rgpiod_stop_sync"), Function::New(env, _rgpiodStopSync));
  exports.Set(String::New(env, "_i2c_open_sync"), Function::New(env, _i2cOpenSync));
  exports.Set(String::New(env, "_i2c_close_sync"), Function::New(env, _i2cCloseSync));
  exports.Set(String::New(env, "_i2c_read_byte_sync"), Function::New(env, _i2cReadByteSync));
  exports.Set(String::New(env, "_i2c_write_device_sync"), Function::New(env, _i2cWriteDeviceSync));

  return exports;
}

NODE_API_MODULE(rgpio, Init)