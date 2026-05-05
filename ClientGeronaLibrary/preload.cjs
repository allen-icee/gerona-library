//ClientGeronaLibrary\preload.cjs
const { contextBridge, ipcRenderer, webFrame } = require("electron");

webFrame.setVisualZoomLevelLimits(1, 3);

window.addEventListener("wheel", (e) => {
    if (e.ctrlKey) {
        const currentZoom = webFrame.getZoomFactor();
        if (e.deltaY > 0) {
            webFrame.setZoomFactor(Math.max(currentZoom - 0.1, 0.5));
        } else {
            webFrame.setZoomFactor(Math.min(currentZoom + 0.1, 3.0));
        }
    }
});

contextBridge.exposeInMainWorld("electronAPI", {
    printTicket: (ticketData) => ipcRenderer.send("print-ticket", ticketData),
    onConnectionFailed: (callback) =>
        ipcRenderer.on("connection-failed", callback),
    saveIp: (ip) => ipcRenderer.send("save-ip", ip),
});
