# tweet_adjustimer_trend

adjustimerで起動されたことのある動画をツイートする.

@adjustimer のアカウントで呟く。

# Require

```
node v18.9.1
npm 8.19.2
```

# Usage

```
export TWITTER_CONSUMER_KEY=XXXXXXXXXXXXXX
export TWITTER_CONSUMER_SECRET=XXXXXXXXXXXXXX
export TWITTER_ACCESS_TOKEN_KEY=XXXXXXXXXXXXXX
export TWITTER_ACCESS_TOKEN_SECRET=XXXXXXXXXXXXXX

export MARIADB_PASS=XXXXXXXX
export MARIADB_USER=XXXX

npm install

node src/tweet_adjustimer_trend.js
(cronで毎日定時に呟く)
```