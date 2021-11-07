const { sendPhoto } = require('pitunti_telegramapi');
const mongoose = require('mongoose');
const PeliculasModel = require('./models/PeliculasModel');
const plexFetch = require('./helpers/plexFetch');
require('dotenv').config();
const {
    CHAT_ID,
    TOKEN_TELEGRAM,
    DB_HOST,
    DB_USER,
    DB_PASS,
    DB,
    PLEX_HOST,
    PLEX_TOKEN
}=process.env;


mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB}`, { useNewUrlParser: true}).then(()=>{
    getPlexRecentsMovies();
});


const getPlexRecentsMovies=()=>{
    const uri=`${PLEX_HOST}/library/recentlyAdded/s.json?X-Plex-Token=${PLEX_TOKEN}`;
   plexFetch(uri).then(data=>{
       sendToTelegram(data)
   })
}

const sendToTelegram =async(data)=>{
  const peliculasRegistradas=await PeliculasModel.find({});
  const id_peliculasRegistradas=peliculasRegistradas.map(pelicula=>pelicula.id_plex);
  const peliculasNuevas=data.filter((elemento)=>!id_peliculasRegistradas.includes(elemento.key));
  peliculasNuevas.forEach(elemento=>{
      const {key,year,type,season,thumb,title,description} = elemento;
      const seasonText=type=="season"?season+"\n":"\n";
      const text=`
<b>🎬 Title</b>:${title}
${seasonText}
<b>🗓️ Year</b>:${year}\n
Info: ${description}
      `
      const pelicula=new PeliculasModel({
          id_plex:key
      })

     enviarFoto({thumb,text}).then(data=>{
          pelicula.save().then(()=>{}); 
      }).catch(error=>{
        console.log(error)
      })
  })
  

}



const enviarFoto=({thumb,text})=>{

    return new Promise((resolve,reject)=>{
     
            sendPhoto({
                 token:TOKEN_TELEGRAM,
                // token:"695529965:AAHtkZfYD4BhrAvhL2K-Lsls0TZ3I6FlFVc",
                 photo:encodeURIComponent(thumb),
                 caption:encodeURIComponent(text),
                 chatId:CHAT_ID
                })
                 .then((msg)=>{
                     const {ok}=msg;
                     if(ok){
                         resolve(msg)
                     }else{
                         reject("Se exedio el limite")
                     }
            })
            
      

    })

   
}

