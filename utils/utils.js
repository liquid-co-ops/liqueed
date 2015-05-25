
function formatDate(date) {
    return [ date.getFullYear(),("00" + (date.getMonth() + 1)).slice(-2),("00" + date.getDate()).slice(-2) ].join('-')
}

module.exports = {
    formatDate: formatDate
}