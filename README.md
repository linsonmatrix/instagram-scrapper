# INSTAGRAM SCRAPPER
A basic NodeJS API and Command Line App to scrape Instagram Profile

## URL of the application

This application can be run by hitting the following URL
`http://localhost:3000`

## API End Points

This application consists of 2 endpoints
1) `GET /get/{handler}` - this endpoint accepts a parameter where a valid instagram handle is provided and returns a JSON data from Instagram. The JSON contains the following elements.
- Instagram Account's User Name
- Instagram Account's Full Name
- Instagram Account's Biography
- Instagram Account's Followers Count
- Instagram Account's Following Count
- Instagram Account's Most Recent Post
    - Media URL
    - Number of Likes
    - Number of comments
    - Post Type, e.g. Carousel, Image or Video
- Datetime data was last retrieved from Instagram

The above information once retrieved is cached for 1 hour so that successive requests can be retrieved faster from cache.

2) `GET /get/{handler}/latest` - this endpoint accepts an additional parameter on top of the instagram handle name. This route was exclusively designed to avoid caching and thus the user can always request for latest data from Instagram.

## Installation and Dependency

1) Install Node JS and NPM from [here] (https://nodejs.org/en/download/)
2) Clone this artifact
3) Run the following command
```
npm install
```

## Running the App

1. The Rest API can be run by the following command
```
node app.js
```
2. The Command Line Application can be run by the following command
```
node index.js
```
