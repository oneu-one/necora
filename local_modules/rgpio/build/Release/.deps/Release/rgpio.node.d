cmd_Release/rgpio.node := ln -f "Release/obj.target/rgpio.node" "Release/rgpio.node" 2>/dev/null || (rm -rf "Release/rgpio.node" && cp -af "Release/obj.target/rgpio.node" "Release/rgpio.node")
