/*
import fs from 'fs';

fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log('파일 내용:', data);
}); // 콜백 함수 등록
// 파일 읽기가 완료되면(이벤트 발생) 콜백 함수 실행됨
////////////
import EventEmitter from 'events';

const emitter = new EventEmitter();

emitter.on('greet', () => console.log('Hello World')); // 콜백 함수 등록
emitter.emit('greet'); // 코드로 이벤트 발생 시킴. Hello World 출력
*/
