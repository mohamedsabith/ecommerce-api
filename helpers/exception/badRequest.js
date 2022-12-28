export default function BadRequest(message, code) {
  this.message = message;
  this.code = code;
  this.name = 'BadRequest';
  this.statusCode = 400;
}
