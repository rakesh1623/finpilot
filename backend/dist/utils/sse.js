export function createSSEStream(res) {
    const controller = new AbortController();
    res.status(200);
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, no-transform");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();
    function isOpen() {
        return (!controller.signal.aborted &&
            !res.writableEnded &&
            !res.destroyed);
    }
    function send(event, data) {
        if (!isOpen())
            return;
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    }
    const heartbeat = setInterval(() => {
        if (isOpen()) {
            res.write(": heartbeat\n\n");
        }
    }, 15000);
    res.once("close", () => {
        clearInterval(heartbeat);
        controller.abort();
    });
    function close() {
        clearInterval(heartbeat);
        if (!res.writableEnded && !res.destroyed) {
            res.end();
        }
    }
    return {
        send,
        close,
        isOpen,
        signal: controller.signal,
    };
}
//# sourceMappingURL=sse.js.map