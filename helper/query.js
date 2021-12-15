const fs = require('fs');

function queryaction(chunk, query, for_whom, limit = 0){
    let result = [];
    if(query == 0 && for_whom != "") {

        let count = 0;
        result = chunk.filter((c) => {
            if(limit != 0 && count == limit){
                return false;
            }

            if((c.username).toLowerCase() === for_whom.toLowerCase()){
                count++;
                return (c.username).toLowerCase() === for_whom.toLowerCase();
            }

        });
        
    } else if(query == 1 && for_whom != "") {
        result = chunk.filter((c) => {
            if((c.location).toLowerCase() === for_whom.toLowerCase()){
                return c.username;
            }
        })
    } else if(query == 3 && for_whom != "") {
        result = chunk.filter((c) => {
            if(c.tweet_count >= for_whom){
                return c.username;
            }
        })
    } else if(query == 4 && for_whom != "") {
        result = chunk.filter((c) => {
            if(c.tweet_count == for_whom){
                return c.username;
            }
        })
    } else if(query == 2 && for_whom != "") {
        console.log(for_whom)
        console.log(for_whom.toLowerCase().replace(/ /g,''))

        result = chunk.filter((c) => {
            return (c.hashtag).includes(for_whom.toLowerCase().replace(/ /g,''))
        })
    }

    result = [...new Set(result)]
    return result;
};

module.exports = {
    queryaction
}