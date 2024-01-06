
function toYMDhms(date = new Date(), firstSeparator = "-", lastSeparator = ".") {
    let parsed = [[], []];

    parsed[0].push(date.getFullYear());
    parsed[0].push(((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1));
    parsed[0].push((date.getDate() < 10 ? '0' : '') + date.getDate());

    return parsed[0].join(firstSeparator) + " " + parsed[1].join(lastSeparator);
}

module.exports = {
    toYMDhms
}