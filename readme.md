## Installation

The required dependencies can be installed and configured by using the scripts provided in `setup/`

The `install` script should be able to do everything by itself

## Usage

- `bin/fuzz` will automatically perform fuzzing tests on an application
- Use `bin/stream <image.png>` to start a stream to the virtual webcam
- Use `bin/launch-emulator <video-device>` to launch an emulator using `<video-device>` as a virtual webcam

### Troubleshooting

#### Environment

For the environment variables (`ANDROID_HOME`, `NVM_DIR`) you might need to play around a little with your system configuration

Be sure that your `~/.bashrc` gets called by scripts, i.e. there is nothing preventing it to be sourced by non-interactive shells. \
It would appear something like this:
```bash
[[ $- = *i* ]] || return
```

Also, when editing `~/.bash_profile` you will need to log out from your current session for the modifications to take effect (unless you are sourcing `~/.bash_profile` in your `~/.bashrc`). \
Additionally, mind that having a `~/.profile` could prevent `~/.bash_profile` to be sourced in some systems

#### Emulator

If you want to perform a full reboot of the emulator you can launch it with

```bash
bin/launch-emulator <video-device> -no-snapshot-load
```

If you want to wipe out every trace of the emulator you can reinstall it with

```bash
rm -rf ~/.android/avd/qrfuzz*
setup/android-sdk
```
