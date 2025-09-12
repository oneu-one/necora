{
    "targets": [
        {
            "target_name": "lgpio",
            "sources": ["lgpio.cpp"],
            "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS"],
            "include_dirs": ["<!@(node -p \"require( 'node-addon-api' ).include\")"],
            "dependencies": ["<!(node -p \"require('node-addon-api').gyp\")"],
            "libraries": ["-llgpio"],
        }
    ]
}
