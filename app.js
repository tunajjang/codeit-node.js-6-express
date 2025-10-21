import express from 'express';
import mongoose from 'mongoose';
import Task from './task.js';
import { DATABASE_URL } from './constants.js';
import cors from 'cors';

const app = express();

app.use(cors()); // 모든 origin에 대해 허용
app.use(express.json());

/*

//특정 origin만 허용
const corsOptions = {
  origin: ['http://127.0.0.1:5500', 'https://my-todo.com'],
};

app.use(cors(corsOptions));

*/

await mongoose.connect(DATABASE_URL);

app.get('/task', async (req, res) => {
  /** 쿼리 목록
   *  - count: 아이템 개수
   *  - sort: 정렬
   */
  const count = Number(req.query.count) || 0;

  if (count === 0) {
    return res.json([]);
  }

  const sortOption =
    req.query.sort === 'oldest' ? ['createdAt', 'asc'] : ['createdAt', 'desc'];
  const tasks = await Task.find().limit(count).sort([sortOption]);
  res.send(tasks);
});

app.get('/task/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    res.send(task);
  } else {
    res.status(404).send({ message: '해당 id를 찾을 수 없습니다.' });
  }
});

app.post('/task', async (req, res) => {
  const newTask = await Task.create(req.body);
  res.send(newTask);
});

app.patch('/task/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    const { body } = req;
    Object.keys(body).forEach((key) => {
      task[key] = body[key];
    });
    await task.save();
    res.send(task);
  } else {
    res.status(404).send({ message: 'Cannot find given id' });
  }
});

app.delete('/task/:id', async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (task) {
    res.sendStatus(200);
  } else {
    res.status(404).send({ message: 'Cannot find given id' });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
