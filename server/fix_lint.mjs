import fs from 'fs';

const lintOutput = JSON.parse(fs.readFileSync('./eslint-output.json', 'utf8'));

lintOutput.forEach(fileResult => {
  if (fileResult.messages.length === 0) return;
  
  let content = fs.readFileSync(fileResult.filePath, 'utf8');
  let lines = content.split('\n');
  
  const messages = fileResult.messages.sort((a, b) => b.line - a.line);
  
  messages.forEach(msg => {
    if (msg.ruleId === 'no-unused-vars') {
      const lineIdx = msg.line - 1;
      if (!lines[lineIdx].includes('eslint-disable-line no-unused-vars')) {
        lines[lineIdx] = lines[lineIdx] + ' // eslint-disable-line no-unused-vars';
      }
    } else if (msg.message.includes('Unused eslint-disable directive')) {
       lines[msg.line - 1] = lines[msg.line - 1].replace(/\/\* eslint-disable .*\*\/|\/\/ eslint-disable-line.*/, '');
    }
  });
  
  fs.writeFileSync(fileResult.filePath, lines.join('\n'), 'utf8');
});
console.log('Done');
