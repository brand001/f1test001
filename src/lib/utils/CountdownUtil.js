export default class CountdownUtil {
    constructor(duration, onTick, onComplete) {
        this.duration = duration;
        this.remainingTime = duration;
        this.onTick = onTick;
        this.onComplete = onComplete;
        this.timer = null;
        this.type = "MM:SS";
    }

    start() {
        if (this.timer) return;

        this.timer = setInterval(() => {
            if (this.remainingTime <= 0) {
                this.stop();
                this.onComplete && this.onComplete();
            } else {
                this.remainingTime--;
                this.onTick && this.onTick(this.formatTime(this.remainingTime));
            }
        }, 1000);
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    reset(newDuration) {
        this.stop();
        this.remainingTime = newDuration;
        this.start();
    }

    clear() {
        this.stop();
        this.remainingTime = this.duration;
    }

    setFormatType(type) {
        this.type = type;
    }

    getRemainingTime() {
        return this.remainingTime;
    }

    formatTime(totalSeconds) {
        const type = this.type;
        const pad = n => String(n).padStart(2, "0");

        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const totalHours = Math.floor(totalSeconds / 3600);
        const totalMinutes = Math.floor(totalSeconds / 60);

        switch (type) {
        case "DD:HH:MM:SS":
            return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        case "HH:MM:SS":
            return `${pad(totalHours)}:${pad(minutes)}:${pad(seconds)}`;
        case "MM:SS":
            return `${pad(totalMinutes)}:${pad(seconds)}`;
        case "SS":
            return `${totalSeconds}`;
        default:
            return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        }
    }

    // ✅ 新增方法：将 timeStr 转换为秒数
    getSecondsFromTimeStr(timeStr) {
        const parts = timeStr.split(":").map(Number);
        if (parts.length === 4) {
            const [d, h, m, s] = parts;
            return d * 86400 + h * 3600 + m * 60 + s;
        } else if (parts.length === 3) {
            const [h, m, s] = parts;
            return h * 3600 + m * 60 + s;
        } else if (parts.length === 2) {
            const [m, s] = parts;
            return m * 60 + s;
        } else if (parts.length === 1) {
            return parts[0];
        }
        return 0;
    }
}
