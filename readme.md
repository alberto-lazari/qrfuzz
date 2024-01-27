## Installation
The required dependencies can be installed and configured by using the scripts provided in `setup/`

The `install` script should be able to do everything by itself

## Usage
- Use `bin/stream <image.png>` to start a stream to the virtual webcam
- Use `bin/launch-emulator <video-device>` to launch an emulator using `<video-device>` as a virtual webcam

### Troubleshooting
If you want to perform a full reboot of the emulator you can launch it with
```
bin/launch-emulator <video-device> -no-snapshot-load
```

If you want to wipe out every trace of the emulator you can reinstall it with
```
rm -rf ~/.android/avd/qrfuzz*
setup/android-sdk
```
