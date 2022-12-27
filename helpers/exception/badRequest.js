export default function BadRequest(message, err) {
  this.message = message;
  this.err = err;
  this.name = 'BadRequest';
  this.statusCode = 400;
}
