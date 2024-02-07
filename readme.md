# CNS project

A fuzzing toolkit to test malicious QR Codes in mobile applications

## Installation

The `install` script should be able to do everything by itself

The required dependencies can be installed and configured individually by using the scripts provided in `setup/`

## Usage

- `bin/fuzz` will automatically perform fuzzing tests on an application
- Use `util/stream <image.png>` to start a stream to the virtual webcam
- Use `util/launch-emulator [<video-device>]` to launch an emulator using `<video-device>` as a virtual webcam
- Use `util/apk-install <app> [...]` to download and install supported apps on the Android virtual device

`-h` or `--help` for detailed usage and available options

---

## Credits

This project is based on the [original work](https://github.com/spritz-group/QRFuzz) of:
- [Federico Carboni](https://github.com/Kero2375)
- [Denis Donadel](https://github.com/donadelden)
- [Mariano Sciacco](https://github.com/Maxelweb)

It has been developed as a final project for the "Computer and Network Security" course from the Master's Degrees in Computer Science and Cybersecurity of the University of Padua (Unipd, Italy)

---

## Troubleshooting

Common problems an how to solve them

<details>
<summary>Click to expand</summary>

### Environment

For the environment variables (`ANDROID_HOME`, `NVM_DIR`) you might need to play around a little with your system configuration

Be sure that your `~/.bashrc` gets called by scripts, i.e. there is nothing preventing it to be sourced by non-interactive shells. \
It would appear something like this:
```bash
[[ $- = *i* ]] || return
```

Also, when editing `~/.bash_profile` you will need to log out from your current session for the modifications to take effect (unless you are sourcing `~/.bash_profile` in your `~/.bashrc`). \
Additionally, mind that having a `~/.profile` could prevent `~/.bash_profile` to be sourced in some systems

### Emulator

If you want to perform a full reboot of the emulator you can launch it with

```bash
util/launch-emulator <video-device> -no-snapshot-load
```

If you want to wipe out every trace of the emulator you can reinstall it with

```bash
rm -rf ~/.android/avd/qrfuzz*
setup/android-sdk
```

</details>
