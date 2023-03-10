import http from 'http';
import chalk from 'chalk';
import app from '../app.js';

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

const server = http.createServer(app);

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      console.error(chalk.red(`${bind} requires elevated privileges`));
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(chalk.red(`${bind} is already in use`));
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `${addr.port}`;
  console.log(chalk.blue(`Server started at http://localhost:${bind}`));
};

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
