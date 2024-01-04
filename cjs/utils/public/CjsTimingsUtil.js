/**
 *
 * @param {Number} ms
 * @return {Promise<unknown>}
 */
async function sleep(ms) {
    return await new Promise((res) => { setTimeout(() => { res() }, ms) })
}