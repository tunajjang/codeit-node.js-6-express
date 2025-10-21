import express from 'express';
import mongoose from 'mongoose';
import Task from './task.js';
import { DATABASE_URL } from './constants.js';
import cors from 'cors';

const app = express();

app.use(cors()); // 모든 origin에 대해 허용

/*

//특정 origin만 허용
const corsOptions = {
  origin: ['http://127.0.0.1:5500', 'https://my-todo.com'],
};

app.use(cors(corsOptions));

*/

app.use(express.json());

await mongoose.connect(DATABASE_URL);

app.get('/tasks', async (req, res) => {
  /** 쿼리 목록
   *  - count: 아이템 개수
   *  - sort: 정렬
   */
  const count = req.query.count || 0;

  if (count === 0) {
    return res.json([]);
  }

  const sortOption =
    req.query.sort === 'oldest' ? ['createdAt', 'asc'] : ['createdAt', 'desc'];
  const tasks = await Task.find().limit(count).sort([sortOption]);
  res.send(tasks);
});

app.get('/tasks/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    res.send(task);
  } else {
    res.status(404).send({ message: '해당 id를 찾을 수 없습니다.' });
  }
});

app.post('/tasks', async (req, res) => {
  const newTask = await Task.create(req.body);
  res.send(newTask);
});

app.patch('/tasks/:id', async (req, res) => {
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

app.delete('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (task) {
    res.sendStatus(200);
  } else {
    res.status(404).send({ message: 'Cannot find given id' });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
