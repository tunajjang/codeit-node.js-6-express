import express from 'express';
import tasks from './mock.js';

const PORT = 3000;
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Express');
});

app.post('/tasks', (req, res) => {
  const data = req.body;
  const ids = tasks.map((task) => task.id);
  const nextId = Math.max(...ids) + 1;
  const now = new Date();
  const newTask = {
    ...data,
    id: nextId,
    createdAt: now,
    updatedAt: now,
    isComplete: false,
  };
  tasks.push(newTask);

  res.status(201).send(newTask);
});

app.get('/tasks', (req, res) => {
  /*쿼리 파라미터
  -sort: 'oldest'인 경우 오래된 태스크 기준, 나머지 경우 새로운 태스크 기준
  -count: 태스크 개수
  */
  const sort = req.query.sort;
  const count = Number(req.query.count);
  console.log('sort : ', sort);
  console.log('count : ', count);
  console.log(typeof count);

  const compareFn =
    sort === 'oldest'
      ? (a, b) => a.createdAt - b.createdAt
      : (a, b) => b.createdAt - a.createdAt;
  let newTasks = tasks.sort(compareFn);

  if (count) {
    newTasks = newTasks.slice(0, count);
  }

  res.send(newTasks);
});

app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);

  if (task) {
    res.send(task);
  } else {
    res.status(404).send({ message: 'Cannot find given id' });
  }
});

app.patch('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);

  if (task) {
    Object.keys(req.body).forEach((key) => {
      task[key] = req.body[key];
    });
    task.updatedAt = new Date();
    res.send(task);
  } else {
    res.status(404).send({ message: 'Cannot find given id' });
  }
});

app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const taskIdx = tasks.findIndex((task) => task.id === id);

  if (taskIdx !== -1) {
    const [deletedTask] = tasks.splice(taskIdx, 1);
    res.send(deletedTask);
  } else {
    res.status(404).send({ message: 'Cannot find given id' });
  }
});

app.listen(PORT, (err) => {
  console.log(`Server Started on ${PORT}`);
  console.log(err);
});
