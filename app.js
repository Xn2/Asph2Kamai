const scores = require('./scores.json');
const db = require('./musicdb.json').mdb.music;
const fs = require("fs")

async function buildMeta() {
    return {
        "game": "sdvx",
        "playtype": "Single",
        "service": "Asphyxia"
    }
}

async function buildScores() {
    const parsedScores = []
    const lamps = ['NOT PLAYED', 'FAILED', 'CLEAR', 'EXCESSIVE CLEAR', 'ULTIMATE CHAIN', 'PERFECT ULTIMATE CHAIN']
    for (scoreObj of scores) {
        for (song of db) {
            if (scoreObj.mid == song['@id'] && song.info.version["#text"] != "6") {
                const score = scoreObj.score
                const identifier = scoreObj.mid.toString()
                const matchType = "inGameID";
                const lamp = lamps[scoreObj.clear]
                const difficulty = await formatDiffName(Object.keys(song.difficulty)[scoreObj.type],song)
                const timeAchieved = (new Date(scoreObj.updatedAt)).getTime()
                parsedScores.push({ score, lamp, matchType, identifier,  difficulty, timeAchieved })
            }
        }
    }
    return parsedScores
}
async function build() {
    const meta = await buildMeta()
    const scores = await buildScores()
    return { meta, scores }
}

async function write() {
    fs.writeFileSync('./export_kamaitachi.json', JSON.stringify(await build()))
}

async function formatDiffName(diff, song) {
    const infDiffs = ["MXM","INF","GRV","HVN","VVD"]
    switch (diff) {
        case "novice":
            return "NOV"
            break;
        case "advanced":
            return "ADV"
            break;
        case "exhaust":
            return "EXH"
            break;
        case "maximum":
            return "MXM"
            break;
        case "infinite":
            return infDiffs[song.info.inf_ver["#text"] - 1]
            break;
        }
}

write()
