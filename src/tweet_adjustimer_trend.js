const { TwitterApi } = require("twitter-api-v2");
const mysql = require('mysql2');
const util = require('util');

const client = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Read+Write level
const rwClient = client.readWrite;


(async () => {
    const pool = mysql.createPool({
        connectionLimit: 10,
        host: 'localhost',
        user: process.env.MARIADB_USER,
        password: process.env.MARIADB_PASS,
        database: "adjustimer_history"
    })
  
    pool.query = util.promisify(pool.query)
  
    // SELECT
    // 1週間の履歴でamazon primeでwatch partyではないもの（重複削除）
    // 同じものは削除
    const selectResult = await pool.query(
        ` select video_title, video_url from videoHistory
            where 
                create_date >= (NOW() - INTERVAL 7 DAY)
                and (video_service_type=0 or video_service_type=6)
                and video_url not like "%watchparty%"
                and not exists(
                    select * from tweetHistory 
                        where videoHistory.video_title=tweetHistory.video_title
                            and tweetHistory.create_date >= (NOW() - INTERVAL 7 DAY)
                )
            group by video_title;`
    )
    const targetVideo = selectResult[Math.floor(Math.random() * selectResult.length)];

    // tweet
    postTweet(rwClient, targetVideo);

    const insertResult = await pool.query('insert into tweetHistory set ?',  { video_title: targetVideo.video_title })
    console.log(targetVideo);

    pool.end();
})();

async function postTweet(rwClient, data) {
    const currentDate = new Date();
    const tweetText = `
        #今日のAdjusTimer\n#${currentDate.getFullYear()}${currentDate.getMonth()+1}${currentDate.getDate()}\n最近同時視聴された動画紹介\n『${data.video_title}』\n${data.video_url}
    `;
    const result = await rwClient.v1.tweet(tweetText, {});
} 