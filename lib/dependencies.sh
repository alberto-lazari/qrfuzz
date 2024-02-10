#!/usr/bin/env false

check () {
    local lib="$(realpath "$(dirname "$BASH_SOURCE")")"
    . "$lib/log.sh"

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
        lsmod | grep -q v4l2loopback ||
            return 1
        ;;
    ffmpeg)
        which ffmpeg &> /dev/null ||
            return 1
        ;;
    *)
        error lib/dependencies.sh: dependency $1 not configured ;;
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
            exit 1
        fi
        ;;
    *)
        error lib/dependencies.sh: dependency $1 not configured ;;
    esac

    shift
    done
}
