const dotenv = require('dotenv');
const axios = require('axios');
const csv = require('csv-parser');
const fs = require('fs');

dotenv.config();

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

async function sendWhatsAppMessage(number, message, media) {
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  };

  const data = {
    number: number,
    message: message,
    mediaUrl: media
  };

  try {
    const response = await axios.post(API_URL, data, { headers });
    console.log(`Mensagem enviada para ${number}:`, response.data);
    return true;
  } catch (error) {
    console.error(`Erro ao enviar para ${number}:`, error.response ? error.response.data : error.message);
    return false;
  }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function lerCSV(filePath) {
  return new Promise((resolve, reject) => {
    const contacts = [];
    fs.createReadStream(filePath)
      .pipe(csv(['numero', 'nome']))
      .on('data', (row) => contacts.push(row))
      .on('end', () => resolve(contacts))
      .on('error', reject);
  });
}

async function processCSV(filePath) {
  try {
    const contacts = await lerCSV(filePath);
    console.log(`CSV processado. ${contacts.length} contatos encontrados.`);

    const results = await Promise.all(contacts.map(async (contact) => {
      const nome = contact.nome.split(' ')[0].toLowerCase().replace(/^\w/, c => c.toUpperCase());
      await delay(2000 + Math.random() * 5000);

      // Envia duas imagens primeiro
      await sendWhatsAppMessage(contact.numero, '', '1744822131695.jpeg');

      await delay(1000 + Math.random() * 2000); // delay entre 1s e 3s
      await sendWhatsAppMessage(contact.numero, '', '1744822131695.jpeg');
      
      await delay(1000 + Math.random() * 2000); // delay entre 1s e 3s

      // Depois envia a mensagem personalizada
      const mensagemPersonalizada = process.env.MENSAGEM.replace('{nome}', nome);
      return await sendWhatsAppMessage(contact.numero, mensagemPersonalizada, null);
      
    }));

    // Exibir resumo
    const successful = results.filter(result => result).length;
    console.log(`\nResumo:
      Total de envios: ${contacts.length}
      Sucessos: ${successful}
      Falhas: ${contacts.length - successful}\n\n`);
  } catch (error) {
    console.error('Erro ao processar CSV:', error);
  }
}

// Executar script
const csvFilePath = process.argv[2];
if (!csvFilePath) {
  console.error('Por favor, informe o caminho do arquivo CSV');
  process.exit(1);
}

processCSV(csvFilePath);
