# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: student-journey.spec.js >> GoGlish Academy Student Journey >> should register, login, check gated lessons, and complete checkout simulation
- Location: tests/student-journey.spec.js:7:7

# Error details

```
Error: browserType.launch: Target page, context or browser has been closed
Browser logs:

<launching> /Applications/Google Chrome.app/Contents/MacOS/Google Chrome --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-edgeupdater --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,Translate,AutoDeElevate,RenderDocument,OptimizationHints,msForceBrowserSignIn,msEdgeUpdateLaunchServicesPreferredVersion --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --disable-infobars --disable-search-engine-choice-screen --disable-sync --enable-unsafe-swiftshader --headless --hide-scrollbars --mute-audio --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --no-sandbox --user-data-dir=/var/folders/0w/yzmnllgn15q2nds7c4_c7crr0000gn/T/playwright_chromiumdev_profile-Lktymm --remote-debugging-pipe --no-startup-window
<launched> pid=12886
[pid=12886][err] [0711/170715.583740:ERROR:third_party/crashpad/crashpad/util/mach/bootstrap.cc:65] bootstrap_check_in org.chromium.crashpad.child_port_handshake.12889.290366.HCUDCKSGTRACJZIM: Permission denied (1100)
[pid=12886][err] [0711/170715.736059:ERROR:third_party/crashpad/crashpad/util/file/file_io.cc:103] ReadExactly: expected 4, observed 0
[pid=12886][err] [0711/170715.736934:ERROR:third_party/crashpad/crashpad/util/file/file_io_posix.cc:208] open /Users/user1/Library/Application Support/Google/Chrome/Crashpad/settings.dat: Operation not permitted (1)
[pid=12886][err] [0711/170715.737031:ERROR:third_party/crashpad/crashpad/util/file/file_io_posix.cc:208] open /Users/user1/Library/Application Support/Google/Chrome/Crashpad/settings.dat: Operation not permitted (1)
[pid=12886][err] [12886:290409:0711/170715.964482:FATAL:base/apple/mach_port_rendezvous_mac.cc:159] Check failed: kr == KERN_SUCCESS. bootstrap_check_in com.google.Chrome.MachPortRendezvousServer.12886: Permission denied (1100)
Call log:
  - <launching> /Applications/Google Chrome.app/Contents/MacOS/Google Chrome --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-edgeupdater --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,Translate,AutoDeElevate,RenderDocument,OptimizationHints,msForceBrowserSignIn,msEdgeUpdateLaunchServicesPreferredVersion --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --disable-infobars --disable-search-engine-choice-screen --disable-sync --enable-unsafe-swiftshader --headless --hide-scrollbars --mute-audio --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --no-sandbox --user-data-dir=/var/folders/0w/yzmnllgn15q2nds7c4_c7crr0000gn/T/playwright_chromiumdev_profile-Lktymm --remote-debugging-pipe --no-startup-window
  - <launched> pid=12886
  - [pid=12886][err] [0711/170715.583740:ERROR:third_party/crashpad/crashpad/util/mach/bootstrap.cc:65] bootstrap_check_in org.chromium.crashpad.child_port_handshake.12889.290366.HCUDCKSGTRACJZIM: Permission denied (1100)
  - [pid=12886][err] [0711/170715.736059:ERROR:third_party/crashpad/crashpad/util/file/file_io.cc:103] ReadExactly: expected 4, observed 0
  - [pid=12886][err] [0711/170715.736934:ERROR:third_party/crashpad/crashpad/util/file/file_io_posix.cc:208] open /Users/user1/Library/Application Support/Google/Chrome/Crashpad/settings.dat: Operation not permitted (1)
  - [pid=12886][err] [0711/170715.737031:ERROR:third_party/crashpad/crashpad/util/file/file_io_posix.cc:208] open /Users/user1/Library/Application Support/Google/Chrome/Crashpad/settings.dat: Operation not permitted (1)
  - [pid=12886][err] [12886:290409:0711/170715.964482:FATAL:base/apple/mach_port_rendezvous_mac.cc:159] Check failed: kr == KERN_SUCCESS. bootstrap_check_in com.google.Chrome.MachPortRendezvousServer.12886: Permission denied (1100)
  - [pid=12886] <gracefully close start>
  - [pid=12886] <kill>
  - [pid=12886] <will force kill>
  - [pid=12886] exception while trying to kill process: Error: kill EPERM
  - [pid=12886] <process did exit: exitCode=null, signal=SIGTRAP>
  - [pid=12886] starting temporary directories cleanup
  - [pid=12886] finished temporary directories cleanup
  - [pid=12886] <gracefully close end>

```