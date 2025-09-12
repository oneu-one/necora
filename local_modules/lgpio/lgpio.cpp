/** lgpio を Node.js から利用するモジュール ** */
/** 関数名・書式は lgpio Python に準拠 ******************* */

#include <napi.h>
#include <lgpio.h>
#include <unistd.h>
#include <string>

using namespace Napi;

// gpiochipデバイスを開く
Promise _gpiochipOpen(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Promise::Deferred::New(env);
  if (info.Length() != 1)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _gpiochipOpen").Value());
  }
  if (!info[0].IsNumber())
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument types: _gpiochipOpen").Value());
  }
  else
  {
    int gpioDev = info[0].As<Number>().Int32Value();
    deferred.Resolve(Number::New(env, lgGpiochipOpen(gpioDev)));
  }
  return deferred.Promise();
}

// gpiochipデバイスを閉じる
Promise _gpiochipClose(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Promise::Deferred::New(env);
  if (info.Length() != 1)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _gpiochipClose").Value());
  }
  if (!info[0].IsNumber())
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument types: _gpiochipClose").Value());
  }
  else
  {
    int handle = info[0].As<Number>().Int32Value();
    deferred.Resolve(Number::New(env, lgGpiochipClose(handle)));
  }
  return deferred.Promise();
}

// GPIO のモードを出力にする（ことを要求？）
Promise _gpioClaimOutput(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Promise::Deferred::New(env);
  if (info.Length() != 4)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _gpioClaimOutput").Value());
  }
  if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber() || !info[3].IsNumber())
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument types: _gpioClaimOutput").Value());
  }
  else
  {
    int handle = info[0].As<Number>().Int32Value();
    int lFlags = info[1].As<Number>().Int32Value();
    int gpio = info[2].As<Number>().Int32Value();
    int level = info[3].As<Number>().Int32Value();

    deferred.Resolve(Number::New(env, lgGpioClaimOutput(handle, lFlags, gpio, level)));
  }
  return deferred.Promise();
}

// GPIO のモードを入力にする（ことを要求？）
Promise _gpioClaimInput(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Promise::Deferred::New(env);
  if (info.Length() != 3)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _gpioClaimInput").Value());
  }
  if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber())
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument types: _gpioClaimInput").Value());
  }
  else
  {
    int handle = info[0].As<Number>().Int32Value();
    int lFlags = info[1].As<Number>().Int32Value();
    int gpio = info[2].As<Number>().Int32Value();

    deferred.Resolve(Number::New(env, lgGpioClaimInput(handle, lFlags, gpio)));
  }
  return deferred.Promise();
}

// GPIOの電圧を読む
Promise _gpioRead(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Promise::Deferred::New(env);
  if (info.Length() != 2)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _gpioRead").Value());
  }
  if (!info[0].IsNumber() || !info[1].IsNumber())
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument types: _gpioRead").Value());
  }
  else
  {
    int handle = info[0].As<Number>().Int32Value();
    int gpio = info[1].As<Number>().Int32Value();

    deferred.Resolve(Number::New(env, lgGpioRead(handle, gpio)));
  }
  return deferred.Promise();
}

// GPIO の電圧をセットする
Promise _gpioWrite(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Promise::Deferred::New(env);
  if (info.Length() != 3)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _gpioWrite").Value());
  }
  if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber())
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument types: _gpioWrite").Value());
  }
  else
  {
    int handle = info[0].As<Number>().Int32Value();
    int gpio = info[1].As<Number>().Int32Value();
    int level = info[2].As<Number>().Int32Value();

    deferred.Resolve(Number::New(env, lgGpioWrite(handle, gpio, level)));
  }
  return deferred.Promise();
}

// シリアルポートを開く
Promise _serialOpen(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Promise::Deferred::New(env);
  if (info.Length() != 3)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _serialOpen").Value());
  }
  else if (!info[0].IsString() || !info[1].IsNumber() || !info[2].IsNumber())
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument types: _serialOpen").Value());
  }
  else
  {
    std::string serDev = info[0].As<String>().Utf8Value();
    int serBaud = info[1].As<Number>().Uint32Value();
    int serFlags = info[2].As<Number>().Uint32Value();
    deferred.Resolve(Number::New(env, lgSerialOpen((char *)serDev.c_str(), serBaud, serFlags)));
  }
  return deferred.Promise();
}

// シリアルポートを閉じる
Promise _serialClose(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Promise::Deferred::New(env);
  if (info.Length() != 1)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _serialClose").Value());
  }
  else if (!info[0].IsNumber())
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument types: _serialClose").Value());
  }
  else
  {
    int handle = info[0].As<Number>().Uint32Value();
    deferred.Resolve(Number::New(env, lgSerialClose(handle)));
  }
  return deferred.Promise();
}

// シリアルデバイスからデータを読む
Promise _serialRead(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Promise::Deferred::New(env);
  if (info.Length() != 2)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _serialRead").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber())
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument types: _serialRead").Value());
  }
  else
  {
    int handle = info[0].As<Number>().Uint32Value();
    int count = info[1].As<Number>().Uint32Value();

    char buf[count];
    int rxCount = lgSerialRead(handle, buf, count);
    auto outBuf = Buffer<char>::Copy(env, buf, rxCount);
    deferred.Resolve(outBuf);
  }
  return deferred.Promise();
}

// シリアルデバイスにバイト列を書き込む(data: string)
Promise _serialWrite(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Promise::Deferred::New(env);
  if (info.Length() != 3)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _serialWrite").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsBuffer() || !info[2].IsNumber())
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument types: _serialWrite").Value());
  }
  else
  {
    int handle = info[0].As<Number>().Uint32Value();
    auto txBuf = info[1].As<Buffer<char>>();
    int count = info[2].As<Number>().Uint32Value();

    deferred.Resolve(Number::New(env, lgSerialWrite(handle, txBuf.Data(), count)));
  }
  return deferred.Promise();
}

// シリアルデバイスから読み出し可能なバイト数を返す
Promise _serialDataAvailable(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Promise::Deferred::New(env);
  if (info.Length() != 1)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _serialDataAvailable").Value());
  }
  else if (!info[0].IsNumber())
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument types: _serialDataAvailable").Value());
  }
  else
  {
    int handle = info[0].As<Number>().Uint32Value();
    deferred.Resolve(Number::New(env, lgSerialDataAvailable(handle)));
  }
  return deferred.Promise();
}

// I2Cバスアドレスのデバイスのハンドルを返す
Promise _i2cOpen(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Promise::Deferred::New(env);
  if (info.Length() != 3)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _i2cOpen").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber())
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument types: _i2cOpen").Value());
  }
  else
  {
    int i2cDev = info[0].As<Number>().Uint32Value();
    int i2cAddr = info[1].As<Number>().Uint32Value();
    int i2cFlags = info[2].As<Number>().Uint32Value();
    deferred.Resolve(Number::New(env, lgI2cOpen(i2cDev, i2cAddr, i2cFlags)));
  }
  return deferred.Promise();
}
// オープン済みI2Cハンドルを閉じる
Promise _i2cClose(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Promise::Deferred::New(env);
  if (info.Length() != 1)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _i2cClose").Value());
  }
  else if (!info[0].IsNumber())
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument types: _i2cClose").Value());
  }
  else
  {
    int handle = info[0].As<Number>().Uint32Value();
    deferred.Resolve(Number::New(env, lgI2cClose(handle)));
  }
  return deferred.Promise();
}

// // デバイスに１バイトを送る
// Promise _i2cWriteByte(const CallbackInfo &info)
// {
//   Env env = info.Env();
//   auto deferred = Promise::Deferred::New(env);
//   if (info.Length() != 3)
//   {
//     deferred.Reject(
//         TypeError::New(env, "Invalid argument count: _i2cWriteByte").Value());
//   }
//   else if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber())
//   {
//     deferred.Reject(
//         TypeError::New(env, "Invalid argument types: _i2cWriteByte").Value());
//   }
//   else
//   {
//     int sbc = info[0].As<Number>().Int32Value();
//     int handle = info[1].As<Number>().Uint32Value();
//     int bVal = info[2].As<Number>().Uint32Value();
//     deferred.Resolve(Number::New(env, i2c_write_byte(handle, bVal)));
//   }
//   return deferred.Promise();
// }
// デバイスから１バイトを受け取る
Promise _i2cReadByte(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Promise::Deferred::New(env);
  if (info.Length() != 1)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _i2cReadByte").Value());
  }
  else if (!info[0].IsNumber())
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument types: _i2cReadByte").Value());
  }
  else
  {
    int handle = info[0].As<Number>().Uint32Value();
    deferred.Resolve(Number::New(env, lgI2cReadByte(handle)));
  }
  return deferred.Promise();
}

// I2Cハンドルに関連付けられているデバイスの指定されたレジスタから1バイトを読み込む
Promise _i2cReadByteData(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Promise::Deferred::New(env);
  if (info.Length() != 2)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _i2cReadByteData").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber())
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument types: _i2cReadByteData").Value());
  }
  else
  {
    int handle = info[0].As<Number>().Uint32Value();
    int i2cReg = info[1].As<Number>().Uint32Value();
    deferred.Resolve(Number::New(env, lgI2cReadByteData(handle, i2cReg)));
  }
  return deferred.Promise();
}
// I2Cハンドルに関連付けられているデバイスの指定されたレジスタに1バイトを書き込む
Promise _i2cWriteByteData(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Promise::Deferred::New(env);
  if (info.Length() != 3)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _i2cWriteByteData").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber())
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument types: _i2cWriteByteData").Value());
  }
  else
  {
    int handle = info[0].As<Number>().Uint32Value();
    int i2cReg = info[1].As<Number>().Uint32Value();
    int byteVal = info[2].As<Number>().Uint32Value();
    deferred.Resolve(Number::New(env, lgI2cWriteByteData(handle, i2cReg, byteVal)));
  }
  return deferred.Promise();
}

// I2Cハンドルに関連付けられているデバイスの指定されたレジスタからcountバイトを読み込む。countは1～32。
Promise _i2cReadI2cBlockData(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Promise::Deferred::New(env);
  if (info.Length() != 3)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _i2cReadI2cBlockData").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber())
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument types: _i2cReadI2cBlockData").Value());
  }
  else
  {
    int handle = info[0].As<Number>().Uint32Value();
    int i2cReg = info[1].As<Number>().Uint32Value();
    int count = info[2].As<Number>().Uint32Value();
    char rxBuf[count];
    int rxCount = lgI2cReadI2CBlockData(handle, i2cReg, rxBuf, count);
    auto outBuf = Buffer<char>::Copy(env, rxBuf, rxCount);
    deferred.Resolve(outBuf);
  }
  return deferred.Promise();
}

// I2Cハンドルに関連付けられているデバイスの指定されたレジスタに最大３２バイトのデータを書き込む。
Promise _i2cWriteI2cBlockData(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Promise::Deferred::New(env);
  if (info.Length() != 4)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _i2cWriteI2cBlockData").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsBuffer() || !info[3].IsNumber())
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument types: _i2cWriteI2cBlockData").Value());
  }
  else
  {
    int handle = info[0].As<Number>().Uint32Value();
    int i2cReg = info[1].As<Number>().Uint32Value();
    auto txBuf = info[2].As<Buffer<char>>();
    int count = info[3].As<Number>().Uint32Value();

    deferred.Resolve(Number::New(env, lgI2cWriteI2CBlockData(handle, i2cReg, txBuf.Data(), count)));
  }
  return deferred.Promise();
}

// I2Cハンドルに関連付けられているデバイスの指定されたレジスタから単一の16ビットワードを読み取る
Promise _i2cReadWordData(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Promise::Deferred::New(env);
  if (info.Length() != 2)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _i2cReadWordData").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber())
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument types: _i2cReadWordData").Value());
  }
  else
  {
    int handle = info[0].As<Number>().Uint32Value();
    int i2cReg = info[1].As<Number>().Uint32Value();
    deferred.Resolve(Number::New(env, lgI2cReadWordData(handle, i2cReg)));
  }
  return deferred.Promise();
}
// // I2Cハンドルに関連付けられているデバイスの指定されたレジスタに単一の16ビットワードを書き込む
// Promise _i2cWriteWordData(const CallbackInfo &info)
// {
//   Env env = info.Env();
//   auto deferred = Promise::Deferred::New(env);
//   if (info.Length() != 4)
//   {
//     deferred.Reject(
//         TypeError::New(env, "Invalid argument count: _i2cWriteWordData").Value());
//   }
//   else if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber() || !info[3].IsNumber())
//   {
//     deferred.Reject(
//         TypeError::New(env, "Invalid argument types: _i2cWriteWordData").Value());
//   }
//   else
//   {
//     int sbc = info[0].As<Number>().Int32Value();
//     int handle = info[1].As<Number>().Uint32Value();
//     int i2c_reg = info[2].As<Number>().Uint32Value();
//     int wVal = info[3].As<Number>().Uint32Value();

//     deferred.Resolve(Number::New(env, i2c_write_word_data(handle, i2c_reg, wVal)));
//   }
//   return deferred.Promise();
// }

// // i2c デバイスからデータを受け取る
// Promise _i2cReadDevice(const CallbackInfo &info)
// {
//   Env env = info.Env();
//   auto deferred = Promise::Deferred::New(env);
//   if (info.Length() != 3)
//   {
//     deferred.Reject(
//         TypeError::New(env, "Invalid argument count: _i2cReadDevice").Value());
//   }
//   else if (!info[0].IsNumber() || !info[1].IsNumber() || !info[2].IsNumber())
//   {
//     deferred.Reject(
//         TypeError::New(env, "Invalid argument types: _i2cReadDevice").Value());
//   }
//   else
//   {
//     int sbc = info[0].As<Number>().Int32Value();
//     int handle = info[1].As<Number>().Uint32Value();
//     int count = info[2].As<Number>().Uint32Value();

//     char buf[count];
//     int rxCount = i2c_read_device(handle, buf, count);
//     auto outBuf = Buffer<char>::Copy(env, buf, rxCount);
//     deferred.Resolve(outBuf);
//   }
//   return deferred.Promise();
// }

// i2c デバイスにバイト列を送る(data: buffer)
Promise _i2cWriteDevice(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Promise::Deferred::New(env);
  if (info.Length() != 3)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _i2cWriteDevice").Value());
  }
  else if (!info[0].IsNumber() || !info[1].IsBuffer() || !info[2].IsNumber())
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument types: _i2cWriteDevice").Value());
  }
  else
  {
    int handle = info[0].As<Number>().Uint32Value();
    auto buf = info[1].As<Buffer<char>>();
    int count = info[2].As<Number>().Uint32Value();

    deferred.Resolve(Number::New(env, lgI2cWriteDevice(handle, buf.Data(), count)));
  }
  return deferred.Promise();
}

// スリープ
Promise _lguSleep(const CallbackInfo &info)
{
  Env env = info.Env();
  auto deferred = Promise::Deferred::New(env);
  if (info.Length() != 1)
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument count: _lguSleep").Value());
  }
  else if (!info[0].IsNumber())
  {
    deferred.Reject(
        TypeError::New(env, "Invalid argument types: _lguSleep").Value());
  }
  else
  {
    double sleepSecs = info[0].As<Number>().DoubleValue();
    lguSleep(sleepSecs);
    deferred.Resolve(env.Null());
  }
  return deferred.Promise();
}


Object
Init(Env env, Object exports)
{
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
  // exports.Set(String::New(env, "_i2c_write_byte"), Function::New(env, _i2cWriteByte));
  exports.Set(String::New(env, "_i2c_read_byte"), Function::New(env, _i2cReadByte));
  exports.Set(String::New(env, "_i2c_write_byte_data"), Function::New(env, _i2cWriteByteData));
  exports.Set(String::New(env, "_i2c_read_byte_data"), Function::New(env, _i2cReadByteData));
  exports.Set(String::New(env, "_i2c_read_i2c_block_data"), Function::New(env, _i2cReadI2cBlockData));
  exports.Set(String::New(env, "_i2c_write_i2c_block_data"), Function::New(env, _i2cWriteI2cBlockData));
  exports.Set(String::New(env, "_i2c_read_word_data"), Function::New(env, _i2cReadWordData));
  // exports.Set(String::New(env, "_i2c_write_word_data"), Function::New(env, _i2cWriteWordData));
  exports.Set(String::New(env, "_i2c_write_device"), Function::New(env, _i2cWriteDevice));
  // exports.Set(String::New(env, "_i2c_read_device"), Function::New(env, _i2cReadDevice));
  exports.Set(String::New(env, "_lgu_sleep"), Function::New(env, _lguSleep));

  return exports;
}

NODE_API_MODULE(lgpio, Init)