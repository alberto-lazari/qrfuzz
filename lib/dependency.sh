#!/usr/bin/env false

check () {
    local lib="$(realpath "$(dirname "$BASH_SOURCE")")"
    . "$lib/log.sh"

    cd "$lib/.."

    while (( $# > 0 )); do
    case "$1" in
    android_sdk)
        [[ -n "$ANDROID_HOME" ]] ||
            export ANDROID_HOME="$HOME/Android/Sdk"
        which avdmanager &> /dev/null ||
            export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$PATH" which emulator &> /dev/null ||
            export PATH="$ANDROID_HOME/emulator:$PATH"
        which adb &> /dev/null ||
            export PATH="$ANDROID_HOME/platform-tools:$PATH"

        which avdmanager &> /dev/null &&
            which emulator &> /dev/null &&
            which adb &> /dev/null ||
            return 1
        ;;
    avd)
        [[ -n "$ANDROID_HOME" ]] ||
            export ANDROID_HOME="$HOME/Android/Sdk"
        which avdmanager &> /dev/null ||
            export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"

        avdmanager list avd 2> /dev/null | grep -q qrfuzz ||
            return 1
        ;;
    v4l2loopback)
        lsmod 2> /dev/null | grep -q v4l2loopback ||
            return 1
        ;;
    ffmpeg)
        which ffmpeg &> /dev/null ||
            return 1
        ;;
    nvm_env)
        [[ -n "$NVM_DIR" ]] || export NVM_DIR="$HOME/.nvm"
        [[ -s "$NVM_DIR/nvm.sh" ]] && . "$NVM_DIR/nvm.sh" ||
            return 1
        ;;
    nvm)
        check nvm_env
        which nvm &> /dev/null ||
            return 1
        ;;
    nodejs)
        check nvm_env
        which npm &> /dev/null ||
            return 1
        ;;
    appium)
        check nodejs &&
            # Will fail when either the driver or appium itself are missing
            appium driver list --installed 2>&1 |
            grep -q uiautomator2 ||
            return 1
        ;;
    fuzzer)
        check appium &&
            ! npm list 2> /dev/null | grep -q 'UNMET DEPENDENCY' ||
            return 1
        ;;
    *)
        error lib/dependency.sh: dependency $1 not configured ;;
    esac

    shift
    done
}

require () {
    local lib="$(realpath "$(dirname "$BASH_SOURCE")")"
    . "$lib/log.sh"

    while (( $# > 0 )); do
        local dependency="$1"
        check $dependency ||
            setup $dependency
        shift
    done
}

setup () {
    local lib="$(realpath "$(dirname "$BASH_SOURCE")")"
    . "$lib/log.sh"

    # Run setup from the project root
    cd "$lib/.."

    while (( $# > 0 )); do
    case "$1" in
    android_sdk)
        cat >&2 <<- EOF
		Android SDK not found
		It is expected to be in \$ANDROID_HOME: $(sed "s|$HOME"'|~|' <<< "$ANDROID_HOME")
		EOF
        local answer
        read -p 'Do you want to install it? (Y/n) ' answer >&2
        if [[ "$answer" != [Nn] ]]; then
            setup/android-sdk
        else
            return 1
        fi
        ;;
    avd)
        warning \`qrfuzz\` virtual device was not found
        local answer
        read -p 'Do you want to run the Android SDK setup? (Y/n) ' answer >&2
        if [[ "$answer" != [Nn] ]]; then
            setup/android-sdk
        else
            return 1
        fi
        ;;
    v4l2loopback)
        setup/v4l2loopback
        ;;
    ffmpeg)
        warning 'ffmpeg is needed for the stream, but it was not found'
        local answer
        read -p 'Do you want to install it? (Y/n) ' answer >&2
        if [[ "$answer" != [Nn] ]]; then
            setup/ffmpeg
        else
            return 1
        fi
        ;;
    nvm | nvm_env)
        warning 'NVM was not found, but it is necessary to manage Node.js'
        local answer
        read -p 'Do you want to install it? (Y/n) ' answer >&2
        if [[ "$answer" != [Nn] ]]; then
            setup/nvm
            check nvm_env
        else
            return 1
        fi
        ;;
    nodejs)
        log Installing dependency: Node.js
        setup/nodejs
        check nvm_env
        ;;
    appium)
        log Installing dependency: Appium
        setup/appium
        check nvm_env
        ;;
    fuzzer)
        warning Fuzzer not found
        local answer
        read -p 'Do you want to install it? (Y/n) ' answer >&2
        if [[ "$answer" != [Nn] ]]; then
            setup/fuzzer
            check nvm_env
        else
            return 1
        fi
        ;;
    *)
        error lib/dependency.sh: dependency $1 not configured ;;
    esac

    shift
    done
}
