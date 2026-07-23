import fs from 'fs';

const lintOutput = JSON.parse(fs.readFileSync('./eslint-output.json', 'utf8'));

lintOutput.forEach(fileResult => {
  if (fileResult.messages.length === 0) return;
  
  let content = fs.readFileSync(fileResult.filePath, 'utf8');
  content = content.replace(/\r \/\/ eslint-disable-line no-unused-vars/g, '');
  content = content.replace(/ \/\/ eslint-disable-line no-unused-vars/g, '');
  
  let lines = content.split(/\r?\n/);
  
  const messages = fileResult.messages.sort((a, b) => b.line - a.line);
  messages.forEach(msg => {
    if (msg.ruleId === 'no-unused-vars') {
      const lineIdx = msg.line - 1;
      if (!lines[lineIdx].includes('eslint-disable-line no-unused-vars')) {
        lines[lineIdx] = lines[lineIdx] + ' // eslint-disable-line no-unused-vars';
      }
    }
  });
  
  fs.writeFileSync(fileResult.filePath, lines.join('\r\n'), 'utf8');
});
console.log('Fixed correctly');
