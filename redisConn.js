import {redisConn } from 'general-node-utils';
import config from './config';
export default redisConn(config.redisConn);
