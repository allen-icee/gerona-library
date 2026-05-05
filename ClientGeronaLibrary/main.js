const { app, BrowserWindow, ipcMain, shell, Menu } = require("electron");
const path = require("path");
const fs = require("fs");

process.on("uncaughtException", (error) =>
    console.error("Uncaught Exception:", error),
);
process.on("unhandledRejection", (error) =>
    console.error("Unhandled Rejection:", error),
);

// Changed config name to match the library context
const configPath = path.join(
    app.getPath("userData"),
    "library-server-config.json",
);

// CRITICAL: Set the flag BEFORE app is ready so the camera works over local HTTP.
let currentIp = null;
if (fs.existsSync(configPath)) {
    try {
        const config = JSON.parse(fs.readFileSync(configPath));
        if (config.ip) {
            currentIp = config.ip;
            app.commandLine.appendSwitch(
                "unsafely-treat-insecure-origin-as-secure",
                `http://${currentIp}:8000`,
            );
        }
    } catch (e) {}
}

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        autoHideMenuBar: true,
        icon: path.join(__dirname, "GeronaLibraryLogo.png"), // Updated Logo
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.cjs"),
        },
    });

    const menuTemplate = [
        {
            label: "Edit",
            submenu: [
                { role: "undo" },
                { role: "redo" },
                { type: "separator" },
                { role: "cut" },
                { role: "copy" },
                { role: "paste" },
                { role: "selectAll" },
            ],
        },
        {
            label: "Settings",
            submenu: [
                {
                    label: "Change Server IP",
                    accelerator: "CmdOrCtrl+Shift+I",
                    click: () => {
                        if (fs.existsSync(configPath)) {
                            fs.unlinkSync(configPath);
                        }
                        mainWindow.loadFile(
                            path.join(__dirname, "settings.html"),
                        );
                    },
                },
                { type: "separator" },
                { role: "quit", label: "Exit Application" },
            ],
        },
        {
            label: "View",
            submenu: [
                { role: "reload" },
                { role: "forceReload" },
                { role: "toggleDevTools" },
                { type: "separator" },
                { role: "resetZoom" },
                { role: "zoomIn" },
                { role: "zoomOut" },
                { type: "separator" },
                { role: "togglefullscreen" },
            ],
        },
    ];

    mainWindow.setMenu(Menu.buildFromTemplate(menuTemplate));

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        return { action: "allow" }; // Allows PDF downloads to trigger naturally
    });

    const loadServer = (ip) => {
        const serverUrl = `http://${ip}:8000/login`;
        let loaded = false;

        mainWindow
            .loadURL(serverUrl)
            .then(() => {
                loaded = true;
            })
            .catch((err) => {
                loaded = true;
                if (!mainWindow.isDestroyed()) {
                    mainWindow
                        .loadFile(path.join(__dirname, "settings.html"))
                        .then(() => {
                            setTimeout(() => {
                                if (!mainWindow.isDestroyed()) {
                                    mainWindow.webContents.send(
                                        "connection-failed",
                                        ip,
                                    );
                                }
                            }, 800);
                        });
                }
            });

        // 8 second timeout fallback
        setTimeout(() => {
            if (!loaded && !mainWindow.isDestroyed()) {
                mainWindow.webContents.stop();
                mainWindow
                    .loadFile(path.join(__dirname, "settings.html"))
                    .then(() => {
                        setTimeout(() => {
                            if (!mainWindow.isDestroyed()) {
                                mainWindow.webContents.send(
                                    "connection-failed",
                                    ip,
                                );
                            }
                        }, 800);
                    });
            }
        }, 8000);
    };

    if (currentIp) {
        loadServer(currentIp);
    } else {
        mainWindow.loadFile(path.join(__dirname, "settings.html"));
    }

    ipcMain.on("save-ip", (event, ip) => {
        fs.writeFileSync(configPath, JSON.stringify({ ip }));
        // CRITICAL FIX: Restart the app so the camera security flag applies to the new IP
        app.relaunch();
        app.exit();
    });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
