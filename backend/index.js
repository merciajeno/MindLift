//require('dotenv').config();
const express = require('express');
const connectDB = require('./models/mongo');
const User = require('./models/User');
const Journal = require('./models/JournalSchema');
const AnalyseJournal =require('./analyseSentiment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Only start the server after MongoDB is connected
connectDB().then(() => {
    console.log("✅ Connected to MongoDB");

    app.listen(3000, () => {
        console.log('🚀 Server started on http://localhost:3000');
    });

    // Define routes after successful connection
    app.get('/', (req, res) => {
        res.send('Welcome to MndLift!');
    });

    app.get('/getUsers', (req, res) => {
        User.find({}).then((users) => {res.status(200).send(users)});
    })
    app.get('/getUser/:id', async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) return res.status(404).send({ message: 'User not found' });
            return res.status(200).send(user);
        } catch (err) {
            return res.status(400).send({ error: 'Invalid User ID' });
        }
    });


    app.post('/signup', async (req, res) => {
        try {
            const alreadyExistingUser =  await User.findOne({email:req.body.email})
            if(alreadyExistingUser){return res.status(400).send({error: 'Email already exist'});}
            const phoneAlreadyExist = await User.findOne({Phone:req.body.Phone})
            if(phoneAlreadyExist){
                return res.status(400).send({error: 'Phone already exist'});
            }
            req.body.password = await bcrypt.hash(req.body.password, 12);
            const user = new User(req.body);
            await user.save();
            return res.status(201).send({ message: 'User saved successfully' });
        } catch (err) {
            return res.status(400).send({ error: err.message });
        }
    });

    app.post('/login', async (req, res) => {
        try{
            const {name,password,email,age,phone }=req.body;
            const user = await User.findOne({email:email})
            if(!user){ return res.status(400).send({error:'User does not exist'})}
            const passwordMatch = await bcrypt.compare(password,user.password);
            if(!passwordMatch){return res.status(400).send({error:'Passwords do not match'})}
            console.log('Logged in')
            return res.status(200).send({'message':'Logged in'})

        }
        catch(err)
        {
            return res.status(400).send({ error: 'Invalid User ID' });
        }
    })
    app.post('/updateUser/:id', async (req, res) => {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }  // return updated doc, validate inputs
            );

            if (!updatedUser) {
                return res.status(404).send({ message: 'User not found' });
            }

            res.status(200).send({ message: 'User updated successfully', user: updatedUser });
        } catch (err) {
            res.status(400).send({ error: err.message });
        }
    });

    app.get('/getJournals', async (req, res) => {
        Journal.find({}).then((journal) => {res.status(200).send(journal)});
    })


    app.get('/getJournalForUser/:id', async (req, res) => {
        try {
            const journals = await Journal.find({ user: req.params.id }); // 'user' is the field name
            res.status(200).send(journals);
        } catch (err) {
            console.error(err.message);
            res.status(500).send({ error: 'Failed to fetch journals' });
        }
    });

    app.post('/addJournal/:id', async (req, res) => {
        try {

            const journal = new Journal({
                text: req.body.text,
                data:Date.now(),
                user:req.params.id,
                sentiment:await AnalyseJournal(req.body.text)
            });
            await journal.save();
            res.status(201).send({ message: 'Journal saved successfully' });
        } catch (err) {
            res.status(400).send({ error: err.message });
        }
    });

    app.post('/updateJournal/:id', async (req, res) => {
        try {
            const updatedJournal = await Journal.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }  // return updated doc, validate inputs
            );

            if (!updatedJournal) {
                return res.status(404).send({ message: 'User not found' });
            }

            res.status(200).send({ message: 'Journal updated successfully', user: updatedJournal });
        } catch (err) {
            res.status(400).send({ error: err.message });
        }
    });

    app.get('/analyseJournal/:id', async (req, res) => {
        try {
            const journal = await Journal.findById(req.params.id);
            if (!journal) return res.status(404).send({ error: 'Journal not found' });
            console.log(journal['text']);
            const result = await AnalyseJournal(journal['text']);
            res.status(200).send({ sentiment_analysis: result });
        } catch (err) {
            console.error(err.message);
            res.status(500).send({ error: 'Failed to analyze journal' });
        }
    })
    app.delete('/deleteUser/:id', (req, res) => {

           try{
               console.log(req.params.id);
               const result = User.findById(req.params.id);
               console.log(result)
               User.findByIdAndDelete(req.params.id,(err,res)=>{
                   if(err) console.log(err.message)
                   else res.status(200).send({ message: 'User deleted successfully' });
               })
           }
           catch(err){
               res.status(400).send({ error: 'Invalid User ID' });
           }
    })

}).catch((err) => {
    console.error("❌ Failed to connect to MongoDB, exiting...");
    process.exit(1);
});
