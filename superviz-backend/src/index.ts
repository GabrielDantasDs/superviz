import express from 'express';
import bodyParser from 'body-parser'
import projectRouter from './routes/project'
import cardRouter from './routes/card'
import taskRouter from './routes/task'
import tagRouter from './routes/tag'
import participantRouter from './routes/participant'
import listRouter from './routes/list'
import meetingRouter from './routes/meeting';

import cors from 'cors';

const app = express();
const PORT = 8000;

app.use(cors());

app.use(bodyParser.json());
app.use('/projects', projectRouter);
app.use('/cards', cardRouter);
app.use('/tasks', taskRouter);
app.use('/tags', tagRouter);
app.use('/participants', participantRouter);
app.use('/lists', listRouter);
app.use('/meetings', meetingRouter);

app.get('/', (req, res) => {res.send('Hello word')});

app.listen(PORT, () => console.log(`Server is running on port:${PORT}`))