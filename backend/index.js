const express = require('express');
const connectDB = require('./models/mongo');
const User = require('./models/User');
const Journal = require('./models/JournalSchema');

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


    app.post('/addUser', async (req, res) => {
        try {
            const user = new User(req.body);
            await user.save();
            res.status(201).send({ message: 'User saved successfully' });
        } catch (err) {
            res.status(400).send({ error: err.message });
        }
    });

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

    app.get('/getJournal/:id', async (req, res) => {
        try {
            const user = await Journal.findOne({id:req.params.id})
            if (!user) return res.status(404).send({ message: 'User not found' });
            return res.status(200).send(user);
        } catch (err) {
            return res.status(400).send({ error: 'Invalid User ID' });
        }
    });

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
                user:req.params.id
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
