const category_sensor = [
  {
    kind: "category",
    name: "ライブラリ",
    cssConfig: {
      icon: "customIcon fas fa-microchip",
    },
    categorystyle: "sensor_category",
    contents: [
      {
        kind: "label",
        text: "赤外線アレイセンサー（サーマルカメラ）AMG8833",
        "web-line": "4.0",
        "web-line-width": "200",
      },
      {
        kind: "block",
        type: "grideye_init",
        fields: {
          addr: "0x69",
        },
      },
      {
        kind: "block",
        type: "grideye_close",
      },
      {
        kind: "block",
        type: "grideye_thermistor",
      },
      {
        kind: "block",
        type: "grideye_read",
      },
      {
        kind: "block",
        type: "grideye_canvas_show",
      },
      {
        kind: "block",
        type: "draw_grideyedata",
        fields: {
          color_high: "#ff0000",
          color_low: "#3333ff",
        },
        inputs: {
          temp_high: {
            shadow: {
              type: "temp",
              fields: {
                temp: "28",
              },
            },
          },
          temp_low: {
            shadow: {
              type: "temp",
              fields: {
                temp: "15",
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "teachable_machine",
      },
      {
        kind: "block",
        type: "grideye_predict_class",
      },
      {
        kind: "block",
        type: "grideye_add_example",
        inputs: {
          class_id: {
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
        type: "tensorset_stringify",
      },
      {
        kind: "block",
        type: "tensorset_parse",
      },
      {
        kind: "label",
        text: "温湿度気圧センサー BME280",
        "web-line": "4.0",
        "web-line-width": "200",
      },
      {
        kind: "block",
        type: "bme280_init",
      },
      {
        kind: "block",
        type: "bme280_data",
      },
      {
        kind: "block",
        type: "bme280_close",
      },
      {
        kind: "label",
        text: "ジェスチャーセンサー PAJ7620",
        "web-line": "4.0",
        "web-line-width": "200",
      },
      {
        kind: "block",
        type: "gesture_init",
      },
      {
        kind: "block",
        type: "gesture_read",
      },
      // {
      //     "kind": "block",
      //     "type": "gesture_stop"
      // }
      {
        kind: "label",
        text: "有機ELディスプレイ(SSD1306)",
        "web-line": "4.0",
        "web-line-width": "200",
      },
      {
        kind: "block",
        type: "oled_init",
      },
      {
        kind: "block",
        type: "oled_cleardisplay",
      },
      {
        kind: "block",
        type: "oled_drawpixel",
        inputs: {
          x: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: "1",
              },
            },
          },
          y: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: "1",
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "oled_drawline",
        inputs: {
          x0: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: "1",
              },
            },
          },
          y0: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: "1",
              },
            },
          },
          x1: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: "128",
              },
            },
          },
          y1: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: "32",
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "oled_update",
      },
      {
        kind: "block",
        type: "oled_drawJPfont",
        inputs: {
          x: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: "0",
              },
            },
          },
          y: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: "0",
              },
            },
          },
          text: {
            shadow: {
              type: "text",
              fields: {
                TEXT: "吾輩は猫である",
              },
            },
          },
        },
      },
      {
        kind: "label",
        text: "サーボモータ (PCA9685)",
        "web-line": "4.0",
        "web-line-width": "200",
      },
      {
        kind: "block",
        type: "pca9685_start",
      },
      {
        kind: "block",
        type: "pca9685_stop",
      },
      {
        kind: "block",
        type: "pca9685_setangle",
        inputs: {
          channel: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: "0",
              },
            },
          },
          angle: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: "90",
              },
            },
          },
        },
      },
      {
        kind: "label",
        text: "６軸慣性センサ (MCU6050)",
        "web-line": "4.0",
        "web-line-width": "200",
      },
      {
        kind: "block",
        type: "inertial_init",
        fields: {
          addr: "0x68",
        },
      },
      {
        kind: "block",
        type: "inertial_stop",
      },
      {
        kind: "block",
        type: "inertial_get_accel",
      },
      {
        kind: "block",
        type: "inertial_get_gyro",
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
export { category_sensor };
