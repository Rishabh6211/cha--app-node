import mongoose from 'mongoose';
import Promise from 'bluebird';
mongoose.Promise = global.Promise;
const promisify = Promise.promisify;

const log = require('./log')(module);
const connections = require('./connections');

mongoose.connection.openUri("mongodb://Rishabh:rishabh123@ds261929.mlab.com:61929/chatapp").then(() => {
    log.info('Connected to DB!');
}).catch((error) => {
    log.error(error);
});