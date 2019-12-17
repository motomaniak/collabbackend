let sqlite3 = require('sqlite3')
let db = new sqlite3.Database('./database.db')

let createUserTable = `CREATE TABLE IF NOT EXISTS
    users (
        first_name TEXT,
        last_name TEXT,
        email TEXT
    )`
let createSportsTable = `CREATE TABLE IF NOT EXISTS
    sports (
        sport_name TEXT
    )`
let createSportUserJoinTable = `CREATE TABLE IF NOT EXISTS 
    sports_users (
        sports_id INTEGER,
        user_id INTEGER
    )`


;[createUserTable, createSportsTable, createSportUserJoinTable].forEach(table => {
    db.run(table, err => {
        if(err){
            console.log(`Couldn't create table`)
        }else{
            console.log(`Create table success`)
        }
    })
})
module.exports = db
