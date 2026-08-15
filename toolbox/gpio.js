// GPIO カテゴリ
const category_gpio = [
  {
    kind: "category",
    name: "GPIO",
    cssConfig: {
      icon: "customIcon fab fa-raspberry-pi",
    },
    categorystyle: "gpio_category",
    contents: [
      {
        kind: "label",
        text: "rgpio",
      },
      {
        kind: "block",
        type: "rgpio_sbc",
      },
      {
        kind: "block",
        type: "sbc_stop",
      },
      {
        kind: "label",
        text: "GPIOChip",
      },
      {
        kind: "block",
        type: "gpiochip_open",
      },
      // {
      //   kind: "block",
      //   type: "gpiochip_close",
      // },
      {
        kind: "block",
        type: "gpio_claim_input",
        fields: {
          lflag: "PULL_NONE",
        },
        inputs: {
          gpio: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: "6",
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "gpio_claim_output",
        inputs: {
          gpio: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: "16",
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "gpio_read",
        inputs: {
          gpio: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: "6",
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "gpio_write",
        inputs: {
          gpio: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: "16",
              },
            },
          },
        },
        fields: {
          level: "1",
        },
      },
      {
        kind: "block",
        type: "tx_pwm",
        inputs: {
          gpio: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: "16",
              },
            },
          },
          freq: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: "50",
              },
            },
          },
          duty: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: "50",
              },
            },
          },
        },
      },
      {
        kind: "label",
        text: "I2C",
        "web-line": "4.0",
        "web-line-width": "200",
      },
      {
        kind: "block",
        type: "i2c_open",
        inputs: {
          addr: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: "0",
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "i2c_close",
      },
      {
        kind: "block",
        type: "i2c_read_byte_data",
        inputs: {
          reg: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: "0",
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "i2c_write_byte_data",
        inputs: {
          reg: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: "0",
              },
            },
          },
          byte_val: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: "0",
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "i2c_write_i2c_block_data",
        inputs: {
          reg: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: "0",
              },
            },
          },
          data: {
            shadow: {
              type: "text",
              fields: {
                TEXT: "abc",
              },
            },
          },
        },
      },
      {
        "kind": "label",
        "text": "Serial",
        "web-line": "4.0",
        "web-line-width": "200"
      },
      {
        "kind": "block",
        "type": "serial_open",
        "fields": {
          "baud": "9600"
        },
        "inputs": {
          "port": {
            "shadow": {
              "type": "text",
              "fields": {
                "TEXT": "/dev/ttyS0"
              }
            }
          }
        }
      },
      {
        "kind": "block",
        "type": "serial_close",
      },
      {
        "kind": "block",
        "type": "serial_data_available",
      },
      {
        "kind": "block",
        "type": "serial_read",
        "inputs": {
          "count": {
            "shadow": {
              "type": "math_number",
              "fields": {
                "NUM": "0"
              }
            }
          }
        }
      },
      {
        "kind": "block",
        "type": "serial_write",
        "inputs": {
          "data": {
            "shadow": {
              "type": "text",
              "fields": {
                "TEXT": "hello"
              }
            }
          }
        }
      },

      {
        kind: "label",
        text: "_",
        "web-line": "4.0",
        "web-line-width": "200",
      },
    ],
  },
];
export { category_gpio };
