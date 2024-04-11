/**
 * Creates a void type promise that will stop a function by provided amount of time
 * @param {number} ms
 * @return {Promise<void>}
 */
async function sleep(ms) {
    return await new Promise((res) => { setTimeout(() => { res() }, ms) })
}