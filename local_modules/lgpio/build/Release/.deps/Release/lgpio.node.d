cmd_Release/lgpio.node := ln -f "Release/obj.target/lgpio.node" "Release/lgpio.node" 2>/dev/null || (rm -rf "Release/lgpio.node" && cp -af "Release/obj.target/lgpio.node" "Release/lgpio.node")
