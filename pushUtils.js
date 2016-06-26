import {incoming} from './bearychat';
export function bearychat({
    id = "",
    title = "",
    text = ""
  } = {}){
    return incoming({
      text: title + text + "\n to:" + id
    })

  }
