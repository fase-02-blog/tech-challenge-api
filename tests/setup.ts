import dotenv from 'dotenv';
import path from 'path';

// Carrega o .env.test se existir (para testes locais), senão usa o .env padrão
const envTestPath = path.resolve(__dirname, '..', '.env.test');
const envPath = path.resolve(__dirname, '..', '.env');

const result = dotenv.config({ path: envTestPath });
if (result.error) {
  dotenv.config({ path: envPath });
}
