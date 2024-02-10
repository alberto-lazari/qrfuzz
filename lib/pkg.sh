#!/usr/bin/env false

# usage: pkg_install <package> [-a <apt_specific>] [-p <pacman_specific>] [-d <dnf_specific>]
pkg_install () {
    local lib="$(realpath "$(dirname "$BASH_SOURCE")")"
    . "$lib/log.sh"

    [[ -z "$1" || "$1" = -* ]] || {
        local default_pkg="$1"
        shift
    }

    OPTIND=1
    local opt
    while getopts :a:p:d: opt; do
        case $opt in
            a) local apt_pkg="$OPTARG" ;;
            p) local pacman_pkg="$OPTARG" ;;
            d) local dnf_pkg="$OPTARG" ;;
            :) error pkg_install: -$OPTARG requires an argument ;;
            '?')
                error pkg_install: illegal option -$OPTARG ;;
        esac
    done

    [[ -n "$apt_pkg" ]] &&
        [[ -n "$pacman_pkg" ]] &&
        [[ -n "$dnf_pkg" ]] ||
        [[ -n "$default_pkg" ]] ||
        # Some system-specific package was not specified
        error pkg_install: bad usage

    [[ -n "$apt_pkg" ]] || local apt_pkg="$default_pkg"
    [[ -n "$pacman_pkg" ]] || local pacman_pkg="$default_pkg"
    [[ -n "$dnf_pkg" ]] || local dnf_pkg="$default_pkg"

    log Installing dependencies using your system\'s package manager
    # Debian-based
    if which apt &> /dev/null; then
        log "Running: sudo apt update && sudo apt install $apt_pkg"
        sudo apt update
        sudo apt install $apt_pkg
        # Arch-based
    elif which pacman &> /dev/null; then
        log "Running: sudo pacman -S $pacman_pkg"
        sudo pacman -S $pacman_pkg
        # RHEL-based
    elif which dnf &> /dev/null; then
        log "Running: sudo dnf install $dnf_pkg"
        sudo dnf install $dnf_pkg
    else
        error No supported package manager was found
    fi
}
