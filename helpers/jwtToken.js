import Jwt from 'jsonwebtoken';

const creatingToken = async (id, email, secretKey, expiryTime) => Jwt.sign({ id, email, date: Date.now() }, secretKey, { expiresIn: expiryTime });

export default creatingToken;
