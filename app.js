import express from 'express';
import tasks from './mock.js';

const PORT = 3000;
const app = express();

app.get('/', (req, res) => {
  res.send('Hello Express');
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

app.listen(PORT, (err) => {
  console.log(`Server Started on ${PORT}`);
  console.log(err);
});
