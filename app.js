const axios = require('axios') // Axios - a JS Library from NodeJS to make HTTP Requests
var express = require("express"); // Express - Backend Web Application Framework from NodeJS for building Web Apps and APIs
const NodeCache = require("node-cache"); // Node-Cache - A simple in-memory caching package
const cache = new NodeCache({ stdTTL: 3600 }); //As per request, the data is cached for 1 hour
var app = express();

// This method is executed on the route where the cached entry is checked for the given parameter
const verifyCache = (req, res, next) => {
    try {
      const { id } = req.params;
      console.log(`checking cache entry for ${id}`);
      if (cache.has(id)) {
        console.log('cache entry found')
        return res.status(200).json(cache.get(id));
      }
      return next();
    } catch (err) {
      throw new Error(err);
    }
};

/* Main route with cache validation
Parameters
/get/{id} - where id is the instagram handle to scrap
*/
app.get("/get/:id", verifyCache, (req, res) => {
    var id = req.params.id;
    console.log('Instagram User ID: ' + id);
    getFollowers(id).then(json => res.json(json));
});

/* Alternative route to retrieve always latest data without cache
Parameters
/get/{id}/{nocache} - where 'id' is the instagram handle and 'nocache' can be any value
example - /get/mavrckco/latest
*/
app.get("/get/:id/:nocache", (req, res) => {
    var id = req.params.id;
    var nocache = req.params.nocache
    console.log('Instagram User ID: ' + id);
    console.log('Cached/Latest: ' + nocache);
    getFollowers(id).then(json => res.json(json));
});

//Default route with no parameters
app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, () => {
 console.log("Server running on port 3000");
});

/* Aysnc Function to scrape data from Instagram using the Public API (?__a=1)
During Testing it was discovered that Instagram's Rate Limits are very low. So as a workaround, user-agent and cookie 
from a logged in session was added to the header of the axios HTTP request */
async function getFollowers(handler) {
    try {
        const {
            data
        } = await axios.get(`https://www.instagram.com/${handler}/?__a=1`)/*,
            { headers: {
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
                'cookie': 'mid={TBD}; csrftoken={TBD}; ds_user_id={TBD}; sessionid={TBD}; rur="{TBD}"'
            }
        })*/ 
        /*This header is required when Instagram enforces a rate limit forcing for authentication. In such cases the workaround is to login to instagram
        in a browser and grab the following cookies from Request Header - mid, csrftoken, ds_user_id, sessionid & rur. A user-agent is also required*/

        //console.log(data)
        user = data.graphql.user
        let followers = user.edge_followed_by.count
        let following = user.edge_follow.count
        let fullname = user.full_name
        let user_name = user.username
        //let profile_pic = user.profile_pic_url_hd
        let biography = user.biography
        let recentPostMediaUrl = user.edge_owner_to_timeline_media.edges[0].node.display_url
        let recentPostTotalLikes = user.edge_owner_to_timeline_media.edges[0].node.edge_liked_by.count
        let recentPostTotalComments = user.edge_owner_to_timeline_media.edges[0].node.edge_media_to_comment.count
        let recentPostType = user.edge_owner_to_timeline_media.edges[0].node.__typename
        switch(recentPostType) {
            case "GraphImage":
                recentPostType = "Image"
                break
            case "GraphSidecar":
                recentPostType = "Carousel"
                break
            case "GraphVideo":
                recentPostType = "Video"
                break
        }
        console.log(`${user_name} has ${followers} followers and follows ${following}. The account's full name is ${fullname} and their biography is ${biography}`)
        console.log(`Recent Post - Url - ${recentPostMediaUrl}`)
        console.log(`Recent Post - Total Number of Likes - ${recentPostTotalLikes}`)
        console.log(`Recent Post - Total Number of Comments - ${recentPostTotalComments}`)
        console.log(`Recent Post - Post Type - ${recentPostType}`)
        var result = new Object();
        result.user_name = user_name;
        result.fullname  = fullname;
        result.followers = followers;
        result.following = following;
        result.biography = biography;
        result.recentPostMediaUrl = recentPostMediaUrl;
        result.recentPostTotalLikes = recentPostTotalLikes;
        result.recentPostTotalComments = recentPostTotalComments;
        result.recentPostType = recentPostType;
        result.requestRetrievalDateTime = new Date();
        var jsonString= JSON.stringify(result);
        var jsonParsed = JSON.parse(jsonString);
        cache.set(handler, jsonParsed);
        return jsonParsed;
    } catch (error) {
        console.log('USER NOT FOUND')
        //throw Error(error);
        console.log(error);
        //The following is a dummy object created for testing the JSON response
        /*var result = new Object();
        result.user_name = "mavrckco";
        result.fullname  = "Mavrck";
        result.followers = 2035;
        result.following = 309;
        result.biography = "This is my biography";
        result.recentPostMediaUrl = "https://instagram.com/p/123445";
        result.recentPostTotalLikes = 26;
        result.recentPostTotalComments = 1;
        result.recentPostType = "Image";
        result.requestRetrievalDateTime = new Date();
        var jsonString= JSON.stringify(result);
        var jsonParsed = JSON.parse(jsonString);
        //console.log(jsonString);
        //console.log(jsonParsed);
        cache.set(handler, jsonParsed);
        //console.log(cache.get(handler));
        return jsonParsed;
        */
    }
}