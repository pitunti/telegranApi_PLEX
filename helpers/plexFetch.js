const fetch = require("node-fetch");
const plexFetch=async(url)=>{
    const peticion=await fetch(url,{
       headers:{
        Accept: 'application/json',
        "Content-Type": 'application/json'
       }
    });
    const data= await peticion.json();
    const plexRecent=data.MediaContainer.Metadata || [];
    const plexData=plexRecent.map(dataRecent=>{
        const {ratingKey,type,thumb,librarySectionTitle}=dataRecent;
       
        return {
            key:ratingKey,
            type,
            thumb:`${process.env.PLEX_HOST}/photo/:/transcode?width=860&height=640&minSize=1&upscale=1&url=${dataRecent.thumb}&X-Plex-Token=${process.env.PLEX_TOKEN}`,
            year:type=="movie"?dataRecent.year:dataRecent.parentYear,
            title:type=="movie"?dataRecent.title:dataRecent.parentTitle,
            season:type=="season" ? dataRecent.title:"Movie",
            description:type=="movie"?dataRecent.summary:dataRecent.parentSummary,
            librarySectionTitle
        }
    })
    return plexData;
}

module.exports=plexFetch;