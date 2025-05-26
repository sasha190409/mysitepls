async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class WindowManager {
    constructor() {
        this.windows = [];
        this.size = 150;
        this.whiteWindowOpened = false;
        this.music = null;
        this.gridCols = 4;
        this.windowCount = 0;
    }

    async initAudio() {
        this.music = new Audio("wavetapper.mp3");
        await new Promise(resolve => {
            this.music.addEventListener("canplaythrough", resolve, { once: true });
            this.music.addEventListener("error", () => resolve());
        });
        try {
            await this.music.play();
        } catch {}
    }

    getWindowPosition() {
        const col = this.windowCount % this.gridCols;
        const row = Math.floor(this.windowCount / this.gridCols);
        const offsetX = 50;
        const offsetY = 60;
        const left = 50 + col * (this.size + offsetX);
        const top  = 50 + row * (this.size + offsetY);
        return { left, top };
    }

    async openWindow(color, delay) {
        await wait(delay);

        const { left, top } = this.getWindowPosition();
        const features = `width=${this.size},height=${this.size},left=${left},top=${top}`;

        const win = window.open(`Windows/${color}.html`, `win_${color}_${Date.now()}`, features);
        if (!win) {
            console.error(`Popup blocked for color ${color}`);
            return null;
        }

        this.windows.push(win);
        this.windowCount++;

        if (color === "white" && !this.whiteWindowOpened) {
            this.whiteWindowOpened = true;

            await wait(1000);  // ждем 1 секунду после открытия
            win.close();       // закрываем в 28.0 сек
            await wait(500);   // ждем 0.5 сек (пауза)
            return this.openWindow(color, 0); // открываем снова сразу (в 28.5 сек)
        }

        return win;
    }

    async closeAllWindows() {
        await wait(5000);
        for (const win of this.windows) {
            try {
                if (win && !win.closed) win.close();
            } catch {}
        }
        this.windows = [];
        this.windowCount = 0;
    }

    async start() {
        await this.initAudio();
        console.log("Audio initialized");

        const windowSequence = [
            { color: "red", delay: 2000 },
            { color: "green", delay: 9000 },
            { color: "blue", delay: 8000 },
            { color: "white", delay: 27000 }, // первое появление white в 27 сек
            { color: "purple", delay: 4500 },
            { color: "coral", delay: 20000 },
            { color: "teal", delay: 9000 },
            { color: "yellow", delay: 9000 },
            { color: "black", delay: 18000 },
            { color: "orange", delay: 40000 }
        ];

        for (const { color, delay } of windowSequence) {
            await this.openWindow(color, delay);
        }

        await this.closeAllWindows();
    }
}

async function start() {
    const manager = new WindowManager();
    await manager.start();
}
