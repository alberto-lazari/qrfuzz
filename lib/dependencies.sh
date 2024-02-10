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
    *)
        error Dependency $1 not configured ;;
    esac

    shift
    done
}

require () {
    local lib="$(realpath "$(dirname "$BASH_SOURCE")")"
    . "$lib/log.sh"

    while (( $# > 0 )); do
    case "$1" in
    android_sdk)
        check android_sdk || {
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
        }
        ;;
    avd)
        check avd || {
            warning \`qrfuzz\` virtual device was not found
            local answer
            read -p 'Do you want to run the Android SDK setup? (Y/n) ' answer >&2
            if [[ "$answer" != [Nn] ]]; then
                setup/android-sdk
            else
                return 1
            fi
        }
        ;;
    esac

    shift
    done
}
