//This is a Command Line Application equivalent of the Restful API
const axios = require('axios')
const prompts = require('prompts'); //Prompts - A simple lightweight user-friendly prompt for node js

(async () => {
    console.log('Starting Terminal scraper...')
    const response = await prompts({
        type: 'text',
        name: 'username',
        message: 'Which User you would like to scrape?'
    });
    console.log('Starting to scrape')
    //The input from the terminal can be found with response.username
    //now we take that result and call getFollowers
    getFollowers(response.username)
})();

async function getFollowers(username) {
    try {
        const {
            data
        } = await axios.get(`https://www.instagram.com/${username}/?__a=1`)
        user = data.graphql.user
        let followers = user.edge_followed_by.count
        let following = user.edge_follow.count
        let fullname = user.full_name
        let user_name = user.username
        let profile_pic = user.profile_pic_url_hd
        let biography = user.biography
        let recentPostMediaUrl = user.edge_owner_to_timeline_media.edges[0].node.display_url
        let recentPostTotalLikes = user.edge_owner_to_timeline_media.edges[0].node.edge_liked_by.count
        let recentPostTotalComments = user.edge_owner_to_timeline_media.edges[0].node.edge_media_to_comment.count
        let recentPostType = user.edge_owner_to_timeline_media.edges[0].node.__typename
        console.log(`${user_name} has ${followers} followers and follows ${following}. The account's full name is ${fullname} and their biography is ${biography}`)
        console.log(`Recent Post - Url - ${recentPostMediaUrl}`)
        console.log(`Recent Post - Total Number of Likes - ${recentPostTotalLikes}`)
        console.log(`Recent Post - Total Number of Comments - ${recentPostTotalComments}`)
        console.log(`Recent Post - Post Type - ${recentPostType}`)
        
    } catch (error) {
        console.log('USER NOT FOUND')
        //console.log(error)
        //throw Error(error);
    }
}