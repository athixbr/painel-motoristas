const express = require('express');
const path = require('path');
const app = express();

// Caminho correto para a build do React
const buildPath = path.join(__dirname, 'build');

// Verifique se o caminho está correto
console.log('Servindo arquivos estáticos da pasta:', buildPath);

// Servir os arquivos estáticos da pasta 'build'
app.use(express.static(buildPath));

// Rota padrão que serve o index.html para qualquer requisição
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Definir a porta do servidor (variável de ambiente ou 3000 por padrão)
const PORT = process.env.PORT || 4949;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
