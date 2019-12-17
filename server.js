let express = require('express')
let db = require('./database')

let app = express()

app.use((req, res, next)=>{
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', '*')
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	next()
})

app.use(express.json())

app.get('/', (res, req)=>{
	res.send('Home page')
})

app.get('/api/xgames/users', (req, res)=>{
	const getAllUsers = `
		SELECT * FROM users
		JOIN sports_users ON users.oid = sports_users.user_id
		JOIN sports ON sports_users.sports_id = sports.oid
		JOIN frequency ON users.frequency_id = frequency.oid
		`
	db.all(getAllUsers, (error, results)=>{
		if(error){
			console.log('Could not get user data')
			res.sendStatus(500)
		}else{
			console.log('results')
			res.status(200).json(results)
		}
	})
})

app.post('/api/xgames/users', (req, res)=>{
	let firstName = req.body.first_name
	let lastName = req.body.last_name
	let email = req.body.email
	let sports = req.body.sports

	const addNewUser = `INSERT INTO users VALUES (?, ?, ?)`
	const addNewSports = `INSERT INTO sports_users VALUES (?, ?)`
	db.run(addNewUser, [firstName, lastName, email], function(error, results){
		if(error){
			console.log('Could not insert new user', error)
			res.sendStatus(500)
		}else{
			sports.forEach((sport)=>{
				db.run(addNewSports, [sport, this.lastID], (error)=>{
					if(error){
						console.log('Could not insert into sports_users table')
						res.sendStatus(500)
					}else{
						console.log('Added new sport_user row')
					}
				})
			})
			res.sendStatus(200)
		}
    })
})

app.listen(9000, ()=>{
	console.log('Listening on port 9000')
})