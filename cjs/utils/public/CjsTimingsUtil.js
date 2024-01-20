/**
 *
 * @param {number} ms
 * @return {Promise<void>}
 */
async function sleep(ms) {
    return await new Promise((res) => { setTimeout(() => { res() }, ms) })
}