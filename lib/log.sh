#!/usr/bin/env false

[[ -n "$QRFUZZ_LOG" ]] || export QRFUZZ_LOG=true
[[ -n "$QRFUZZ_LOG_OK" ]] || export QRFUZZ_LOG_OK=true
[[ -n "$QRFUZZ_LOG_WARNING" ]] || export QRFUZZ_LOG_WARNING=true
[[ -n "$QRFUZZ_LOG_ERROR" ]] || export QRFUZZ_LOG_ERROR=true

log () {
    ! $QRFUZZ_LOG ||
        echo "[[1;34m$0[0m] $@"
}

ok () {
    ! $QRFUZZ_LOG_OK ||
        log "[[1;32mOK[0m] $@"
}

warning () {
    ! $QRFUZZ_LOG_WARNING ||
        log "[[1;33mWARNING[0m] $@" >&2
}

error () {
    ! $QRFUZZ_LOG_ERROR || {
        log "[[1;31mERROR[0m] $@" >&2
        exit 1
    }
}
