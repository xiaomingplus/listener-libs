import rp from 'request-promise';
import {bearychat} from './config';
export function incoming ({
  text=""
} = {}) {
return new Promise (async (s,f)=>{
    if(!text){
      f('options text is required!');
      return;
    }
    const _option = {
        "text": text,
        "markdown": true,
        "channel": bearychat.appTestChannel
    };


    const opts = {
        simple:false,
        json:true,
        method:"POST",
        url:bearychat.incoming.url,
        body:_option
    };
    console.log(opts);
    try{
      var r = await rp(opts);
    }catch(e){
      f(e);
      return;
    }
    s(r);
});
};
