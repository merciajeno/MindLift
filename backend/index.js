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

    app.post('/updateUser', async (req, res) => {

    })

    app.get('/getJournal/:id', async (req, res) => {
        try {
            const user = await Journal.findById(req.params.id);
            if (!user) return res.status(404).send({ message: 'User not found' });
            return res.status(200).send(user);
        } catch (err) {
            return res.status(400).send({ error: 'Invalid User ID' });
        }
    });


    app.post('/addJournal', async (req, res) => {
        try {
            const journal = new Journal(req.body);
            await journal.save();
            res.status(201).send({ message: 'Journal saved successfully' });
        } catch (err) {
            res.status(400).send({ error: err.message });
        }
    });

}).catch((err) => {
    console.error("❌ Failed to connect to MongoDB, exiting...");
    process.exit(1);
});
