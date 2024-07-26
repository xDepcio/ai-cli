export function checkProcessExists(pid: number) {
    try {
        process.kill(pid, 0);
        // console.log(`Process with PID ${pid} is still running.`);
        return true;
    } catch (e) {
        // @ts-ignore
        if (e.code === 'ESRCH') {
            // console.log(`Process with PID ${pid} has already exited.`);
            return false;

        } // @ts-ignore
        else if (e.code === 'EPERM') {
            // console.log(`Process with PID ${pid} exists but we do not have permission.`);
            return true;
        }
        else {
            // console.error(`Error occurred while checking process with PID ${pid}:`, e);
            throw e;
        }
    }
};
