import {hash,randomBytes} from 'crypto-promise';
import config from './config';
export function md5Salt(value,salt){
  return new Promise(async (s,f)=>{
    try{
      const valueB = await hash('md5')(value.toString());
      const valueS = valueB.toString('hex');
      const saltB = await hash('md5')(salt.toString());
      const saltS = saltB.toString('hex');
      const resultS = await hash('md5')(`${valueS}${config.defaultParams.md5Salt}${saltS}`);
      var result = resultS.toString('hex');
    }catch(e){
      f(e);
      return;
    }
    s(result);
  });
}

export function generateToken(){
  return new Promise(async (s,f)=>{
    try{
      const rand = await randomBytes(32);
      var result = rand.toString('hex')
    }catch(e){
      f(e);
      return;
    }
    s(result)
  });
}

export function generateCode(){
  return new Promise(async (s,f)=>{
    try{
      const rand = await randomBytes(16);
      var result = rand.toString('hex')
    }catch(e){
      f(e);
      return;
    }
    s(result)
  });
}
